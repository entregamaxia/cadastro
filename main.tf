# 1. Configurações Gerais e Variáveis
variable "projeto_nome" {
  default = "cadastro-ia-itau"
}

# 2. Bucket S3 para Hospedagem do Angular
resource "aws_s3_bucket" "frontend_bucket" {
  bucket        = "${var.projeto_nome}-frontend"
  force_destroy = true # Permite deletar o bucket mesmo com arquivos dentro
}

# Configuração de Website Estático no S3
resource "aws_s3_bucket_website_configuration" "frontend_config" {
  bucket = aws_s3_bucket.frontend_bucket.id
  index_document { suffix = "index.html" }
}

# 3. CloudFront (CDN) para HTTPS e Distribuição Global
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "oac-${var.projeto_nome}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name              = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_id                = "S3Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Política do S3 para permitir apenas o CloudFront ler os arquivos
resource "aws_s3_bucket_policy" "allow_access_from_cloudfront" {
  bucket = aws_s3_bucket.frontend_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}

# 4. Backend: Fila SQS
resource "aws_sqs_queue" "cadastro_queue" {
  name = "${var.projeto_nome}-queue"
}

# 5. Backend: Função Lambda (Node.js)
resource "aws_iam_role" "lambda_role" {
  name = "${var.projeto_nome}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Permissão para o Lambda enviar mensagens ao SQS
resource "aws_iam_role_policy" "lambda_sqs_policy" {
  name = "lambda-sqs-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["sqs:SendMessage"]
        Effect   = "Allow"
        Resource = aws_sqs_queue.cadastro_queue.arn
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_lambda_function" "cadastro_handler" {
  function_name = "${var.projeto_nome}-handler"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  # O Terraform vai zipar sua pasta 'lambda/' automaticamente
  filename         = "lambda_function.zip"
  source_code_hash = filebase64sha256("lambda_function.zip")

  environment {
    variables = {
      QUEUE_URL = aws_sqs_queue.cadastro_queue.id
    }
  }
}

# 6. API Gateway (Ponto de entrada para o Angular)
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.projeto_nome}-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"] # Em prod, coloque a URL do CloudFront aqui
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.cadastro_handler.invoke_arn
}

resource "aws_apigatewayv2_route" "route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /cadastro"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cadastro_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# 7. Outputs (Aparecerão no terminal após o apply)
output "url_site" {
  value = "https://${aws_cloudfront_distribution.cdn.domain_name}"
}

output "url_api" {
  value = aws_apigatewayv2_stage.stage.invoke_url
}
