
 GNU nano 7.2                                             main.tf
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
