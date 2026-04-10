output "url_site" {
  description = "URL do CloudFront para acessar o Angular"
  value       = "https://${aws_cloudfront_distribution.cdn.domain_name}"
}

output "url_api" {
  description = "Endpoint do API Gateway para o formulário"
  value       = aws_apigatewayv2_stage.stage.invoke_url
}

output "bucket_name" {
  value = aws_s3_bucket.frontend_bucket.id
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.cdn.id
}
