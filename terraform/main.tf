terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ─── CLÉ SSH ───────────────────────────────────────────
resource "aws_key_pair" "helpdesk_key" {
  key_name   = var.key_name
  public_key = file("~/.ssh/aws-helpdesk.pub")
}

# ─── VPC ───────────────────────────────────────────────
resource "aws_vpc" "helpdesk_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "${var.project_name}-vpc" }
}

# ─── SUBNET PUBLIC (Nginx/Bastion uniquement) ──────────
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.helpdesk_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags = { Name = "${var.project_name}-public-subnet" }
}

# ─── SUBNET PRIVÉ (Frontend, Backend, Database) ────────
resource "aws_subnet" "private_subnet" {
  vpc_id                  = aws_vpc.helpdesk_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = false
  tags = { Name = "${var.project_name}-private-subnet" }
}

# ─── INTERNET GATEWAY ──────────────────────────────────
resource "aws_internet_gateway" "helpdesk_igw" {
  vpc_id = aws_vpc.helpdesk_vpc.id
  tags = { Name = "${var.project_name}-igw" }
}

# ─── ROUTE TABLE PUBLIQUE ──────────────────────────────
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.helpdesk_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.helpdesk_igw.id
  }
  tags = { Name = "${var.project_name}-public-rt" }
}

resource "aws_route_table_association" "public_rta" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# ─── ROUTE TABLE PRIVÉE (aucune route vers internet) ───
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.helpdesk_vpc.id
  tags = { Name = "${var.project_name}-private-rt" }
}

resource "aws_route_table_association" "private_rta" {
  subnet_id      = aws_subnet.private_subnet.id
  route_table_id = aws_route_table.private_rt.id
}

# ═══════════════════════════════════════════════════════
# SECURITY GROUPS
# ═══════════════════════════════════════════════════════

# ─── SG NGINX — Bastion + Load Balancer ────────────────
resource "aws_security_group" "sg_nginx" {
  name        = "${var.project_name}-sg-nginx"
  description = "Bastion Host Load Balancer seul point entree internet"
  vpc_id      = aws_vpc.helpdesk_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-sg-nginx" }
}

# ─── SG FRONTEND — React (réseau privé) ────────────────
resource "aws_security_group" "sg_frontend" {
  name        = "${var.project_name}-sg-frontend"
  description = "Frontend React accessible depuis Nginx uniquement"
  vpc_id      = aws_vpc.helpdesk_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.0/24"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.0/24"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.0/24"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-sg-frontend" }
}

# ─── SG BACKEND — Flask API (réseau privé) ─────────────
resource "aws_security_group" "sg_backend" {
  name        = "${var.project_name}-sg-backend"
  description = "Backend Flask accessible depuis subnet prive uniquement"
  vpc_id      = aws_vpc.helpdesk_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.0/24"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-sg-backend" }
}

# ─── SG DATABASE — MySQL (réseau privé, isolée) ────────
resource "aws_security_group" "sg_database" {
  name        = "${var.project_name}-sg-database"
  description = "Database MySQL accessible depuis backend uniquement"
  vpc_id      = aws_vpc.helpdesk_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.0/24"]
  }

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.0.2.0/24"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["10.0.2.0/24"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-sg-database" }
}

# ═══════════════════════════════════════════════════════
# EC2 INSTANCES
# ═══════════════════════════════════════════════════════

# ─── NODE 1 — Nginx (Bastion + Load Balancer) ──────────
# Seule machine avec IP publique
resource "aws_instance" "nginx" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.sg_nginx.id]
  key_name               = aws_key_pair.helpdesk_key.key_name

  tags = {
    Name    = "${var.project_name}-nginx"
    Role    = "Bastion + Load Balancer"
    Project = var.project_name
  }
}

# ─── NODE 2 — Frontend React (privé) ───────────────────
resource "aws_instance" "frontend" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.private_subnet.id
  vpc_security_group_ids = [aws_security_group.sg_frontend.id]
  key_name               = aws_key_pair.helpdesk_key.key_name

  tags = {
    Name    = "${var.project_name}-frontend"
    Role    = "React Frontend"
    Project = var.project_name
  }
}

# ─── NODE 3 — Backend Flask (privé) ────────────────────
resource "aws_instance" "backend" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.private_subnet.id
  vpc_security_group_ids = [aws_security_group.sg_backend.id]
  key_name               = aws_key_pair.helpdesk_key.key_name

  tags = {
    Name    = "${var.project_name}-backend"
    Role    = "Flask Backend"
    Project = var.project_name
  }
}

# ─── NODE 4 — Database MySQL (privé, isolée) ───────────
resource "aws_instance" "database" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.private_subnet.id
  vpc_security_group_ids = [aws_security_group.sg_database.id]
  key_name               = aws_key_pair.helpdesk_key.key_name

  tags = {
    Name    = "${var.project_name}-database"
    Role    = "MySQL Database"
    Project = var.project_name
  }
}
