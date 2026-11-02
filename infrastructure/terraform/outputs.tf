output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "rds_endpoint" {
  description = "PostgreSQL RDS connection endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "s3_bucket" {
  description = "Reports S3 bucket name"
  value       = aws_s3_bucket.reports.id
}

output "backend_ecr_repo" {
  description = "Backend ECR Repository URL"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repo" {
  description = "Frontend ECR Repository URL"
  value       = aws_ecr_repository.frontend.repository_url
}
