output "nginx_ip" {
  value       = aws_instance.nginx.public_ip
  description = "IP publique du Bastion + Load Balancer (seul point d'entree)"
}

output "nginx_private_ip" {
  value       = aws_instance.nginx.private_ip
  description = "IP privee du Nginx (communication interne VPC)"
}

output "frontend_private_ip" {
  value       = aws_instance.frontend.private_ip
  description = "IP privee du Frontend React"
}

output "backend_private_ip" {
  value       = aws_instance.backend.private_ip
  description = "IP privee du Backend Flask"
}

output "database_private_ip" {
  value       = aws_instance.database.private_ip
  description = "IP privee de la Database MySQL"
}