# NEXUS Conseil & Associes — Systeme de gestion des incidents IT

Deploiement automatise d'une application Help Desk multi-tiers sur AWS via Terraform et Ansible.

## Stack
- Infrastructure : Terraform + AWS (VPC, EC2, NAT Gateway)
- Automatisation : Ansible (5 roles)
- Backend : Flask + SQLAlchemy + JWT
- Frontend : React + Vite + Chart.js
- Base de donnees : MariaDB
- Securite : Bastion Host, UFW, fail2ban, Ansible Vault

## Deploiement rapide
1. git clone https://github.com/frank17art/helpdesk-aws.git
2. cd helpdesk-aws/terraform && terraform apply
3. Mettre a jour les IPs dans ansible/inventory/hosts.ini
4. cd ../ansible && ansible-playbook playbooks/site.yml --ask-vault-pass
5. Acceder a http://<nginx_ip>

## Auteur
Frank Kadji — Technicien IT | DevOps — College Boreal TSI 2026
