variable "aws_region" {
  default = "us-east-1"
}

variable "ami_id" {
  default = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS us-east-1
}

variable "instance_type" {
  default = "t3.micro" # Free tier
}

variable "key_name" {
  description = "Nom de la clé SSH créée dans AWS"
  default     = "aws-helpdesk"
}

variable "project_name" {
  default = "helpdesk"
}