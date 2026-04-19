<div align="center">

<img src="https://img.shields.io/badge/NEXUS-Conseil_%26_Associés-C9A84C?style=for-the-badge&logoColor=white" alt="NEXUS"/>

# NEXUS IT Service Desk

### Plateforme de gestion des incidents IT — Déployée sur AWS

*Conseil fiscal · Audit · Transformation numérique · Gestion des risques*

---

[![Terraform](https://img.shields.io/badge/Terraform-1.5+-7B42BC?style=flat-square&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Ansible](https://img.shields.io/badge/Ansible-2.16+-EE0000?style=flat-square&logo=ansible&logoColor=white)](https://www.ansible.com/)
[![AWS](https://img.shields.io/badge/AWS-EC2_%7C_VPC_%7C_NAT-FF9900?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18_%2B_Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MariaDB](https://img.shields.io/badge/MariaDB-10.6-003545?style=flat-square&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![ITIL](https://img.shields.io/badge/ITIL-v4_Compliant-6D28D9?style=flat-square)](https://www.axelos.com/certifications/itil-service-management)
[![License](https://img.shields.io/badge/License-MIT-16A34A?style=flat-square)](LICENSE)

</div>

---

## Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Fonctionnalités ITIL v4](#-fonctionnalités-itil-v4)
- [Accès — Toutes couches](#-accès--toutes-couches)
- [Déploiement depuis zéro](#-déploiement-depuis-zéro)
- [Playbooks Ansible](#-playbooks-ansible)
- [Structure du projet](#-structure-du-projet)
- [Sécurité](#-sécurité)
- [Auteur](#-auteur)

---

## 🏢 À propos du projet

**NEXUS Conseil & Associés** est une firme fictive de conseil inspirée des Big 4 (KPMG, Deloitte, PwC, EY), opérant sur trois bureaux canadiens — Toronto, Montréal et Vancouver — avec 450 collaborateurs.

Ce projet déploie un **système de gestion des incidents IT** (ITSM) complet et production-ready sur AWS, entièrement automatisé via **Terraform** et **Ansible**. Il implémente les pratiques **ITIL v4** pour la gestion du cycle de vie des incidents.

> **Projet de fin de programme** — Collège Boréal, Programme TSI 2026  
> Réalisé par **Frank Laurel Kadji Fomekon**

### Ce qui rend ce projet unique

- 🏗️ **Infrastructure as Code** — Terraform pour le provisionnement AWS
- 🤖 **Automatisation complète** — Ansible déploie tout en une commande
- 🔐 **Sécurité multicouche** — Bastion Host, Vault, JWT, bcrypt, UFW, fail2ban
- 📋 **ITIL v4 natif** — SLA, priorités P1-P4, catalogue de services, MTTR
- 📎 **Upload de fichiers** — Documents et photos sur chaque ticket
- 👥 **Gestion des rôles** — Admin / Tech / Utilisateur avec permissions granulaires

---

## 🏛️ Architecture

```
                        INTERNET
                            │
                     ┌──────▼──────┐
                     │   AWS VPC   │
                     │             │
          ┌──────────┤  SUBNET     ├──────────┐
          │          │  PUBLIC     │          │
          │          │ 10.0.1.0/24 │          │
          │          └─────────────┘          │
          │                │                  │
          ▼                ▼                  │
   ┌─────────────┐  ┌─────────────┐          │
   │   INTERNET  │  │   NGINX     │          │
   │   GATEWAY   │  │   BASTION   │          │
   └─────────────┘  │ 10.0.1.180  │          │
                    │ + LOAD      │          │
                    │ BALANCER    │          │
                    └──────┬──────┘          │
                           │                 │
               ┌───────────┼───────────┐     │
               │           │           │     │
               ▼           ▼           ▼     │
        ┌────────────┐ ┌────────────┐ ┌─────────────┐
        │  FRONTEND  │ │  BACKEND   │ │  DATABASE   │
        │   React    │ │   Flask    │ │   MariaDB   │
        │ 10.0.2.171 │ │  10.0.2.4  │ │  10.0.2.50  │
        └────────────┘ └────────────┘ └─────────────┘
              │               │               │
              └───────────────┴───────────────┘
                          SUBNET PRIVÉ
                          10.0.2.0/24
                               │
                         ┌─────▼─────┐
                         │    NAT    │
                         │  GATEWAY  │
                         └─────┬─────┘
                               │
                           INTERNET
                      (mises à jour apt)
```

### Flux de requêtes

```
Navigateur  →  Nginx (13.219.202.209)
                  ├── /api/*  →  Flask Backend (10.0.2.4:5000)
                  │                   └── MySQL (10.0.2.50:3306)
                  └── /*      →  React Frontend (10.0.2.171:80)
```

---

## 🛠️ Stack technique

| Couche | Technologie | Version | Rôle |
|---|---|---|---|
| **Provisionnement** | Terraform | 1.5+ | VPC, EC2, NAT Gateway, Security Groups |
| **Automatisation** | Ansible | 2.16+ | Déploiement, configuration, orchestration |
| **Load Balancer** | Nginx | 1.24 | Reverse proxy, point d'entrée unique |
| **Frontend** | React + Vite | 18 + 5 | Interface utilisateur ITIL |
| **Graphiques** | Chart.js | 4.x | Dashboard analytique |
| **Backend** | Flask | 3.0 | API REST + logique métier |
| **Auth** | Flask-JWT-Extended | 4.6 | Authentification stateless |
| **ORM** | SQLAlchemy | 3.1 | Abstraction base de données |
| **Base de données** | MariaDB | 10.6 | Persistance des données |
| **Hachage** | bcrypt | 4.1 | Sécurisation des mots de passe |
| **Serveur WSGI** | Gunicorn | 21.2 | Production Python server |
| **Secrets** | Ansible Vault | — | Chiffrement AES-256 des credentials |
| **OS** | Ubuntu | 22.04 LTS | Système d'exploitation serveurs |
| **Cloud** | AWS | — | us-east-1 (N. Virginia) |

---

## 📋 Fonctionnalités ITIL v4

### Gestion des incidents

| Priorité | Label | SLA | Accessible par |
|---|---|---|---|
| `critical` | **P1 — Critique** | 4 heures | Admin uniquement |
| `high` | **P2 — Haut** | 8 heures | Admin + Tech |
| `medium` | **P3 — Moyen** | 24 heures | Tous les rôles |
| `low` | **P4 — Bas** | 72 heures | Tous les rôles |

### Catalogue de services

| Service | Catégorie ITIL | Exemples d'incidents |
|---|---|---|
| 🔐 Accès & Identité | IAM | MFA, VPN, permissions SharePoint |
| 💻 Postes de travail | End-User Computing | Windows, imprimantes, matériel |
| 🌐 Réseau & Connectivité | Network | VPN Cisco, Wi-Fi, DNS |
| 📦 Applications métier | Application | SAP, TaxCycle, CCH, ERP |
| 🛡️ Sécurité & Conformité | Security | Certificats SSL, audits |
| 🖥️ Infrastructure | Infrastructure | Serveurs, stockage, cloud |

### Cycle de vie des incidents

```
NOUVEAU  →  EN COURS  →  RÉSOLU  →  FERMÉ
   │            │            │
   │      (assignation) (validation)
   │            │
   └── ESCALADE P1 → Notification équipe + SLA breach alert
```

### Métriques ITIL affichées

- **MTTR** — Mean Time To Resolve
- **SLA Compliance** — Taux de respect des délais
- **Taux de résolution** — % incidents résolus
- **Distribution par service** — Répartition par catalogue
- **Activity Feed** — Journal d'activité en temps réel

---

## 🔑 Accès — Toutes couches

### Application Web — http://13.219.202.209

| Rôle | Email | Mot de passe | Permissions |
|---|---|---|---|
| 👑 **Admin** | `admin@helpdesk.com` | `Admin@2024!` | Dashboard complet · Tous tickets · Gestion utilisateurs · Tous rôles P1-P4 |
| 🔧 **Tech** | `mc.beaumont@nexusconseil.ca` | `Tech@2024!` | Tickets · Statuts · Commentaires · P2/P3/P4 |
| 🔧 **Tech** | `jp.tremblay@nexusconseil.ca` | `Tech@2024!` | Tickets · Statuts · Commentaires · P2/P3/P4 |
| 👤 **User** | `s.ngandu@nexusconseil.ca` | `User@2024!` | Ses tickets uniquement · P3/P4 |
| 👤 **User** | `a.okafor@nexusconseil.ca` | `User@2024!` | Ses tickets uniquement · P3/P4 |
| 👤 **User** | `i.fontaine@nexusconseil.ca` | `User@2024!` | Ses tickets uniquement · P3/P4 |

---

### SSH — Accès serveurs

> **Prérequis** : Clé privée `aws-helpdesk` dans `~/.ssh/` + agent SSH actif

```bash
# Activer l'agent SSH (obligatoire avant chaque session)
eval $(ssh-agent -s) && ssh-add ~/.ssh/aws-helpdesk

# ─── Node 1 — Nginx Bastion (seul nœud exposé internet) ───
ssh ubuntu@13.219.202.209

# ─── Node 2 — Frontend React (via bastion) ───
ssh -o ForwardAgent=yes -J ubuntu@13.219.202.209 ubuntu@10.0.2.171

# ─── Node 3 — Backend Flask (via bastion) ───
ssh -o ForwardAgent=yes -J ubuntu@13.219.202.209 ubuntu@10.0.2.4

# ─── Node 4 — Database MariaDB (via bastion) ───
ssh -o ForwardAgent=yes -J ubuntu@13.219.202.209 ubuntu@10.0.2.50
```

| Nœud | IP Publique | IP Privée | Utilisateur SSH |
|---|---|---|---|
| Nginx Bastion | 13.219.202.209 | 10.0.1.180 | ubuntu |
| Frontend | — | 10.0.2.171 | ubuntu |
| Backend | — | 10.0.2.4 | ubuntu |
| Database | — | 10.0.2.50 | ubuntu |

---

### Base de données — MySQL CLI

```bash
# 1. Se connecter au serveur database
ssh -o ForwardAgent=yes -J ubuntu@13.219.202.209 ubuntu@10.0.2.50

# 2. Ouvrir le shell MySQL
sudo mysql -u root -pRoot2024 helpdesk_db
```

```sql
-- Requêtes de vérification
SHOW TABLES;
SELECT id, name, email, role FROM users;
SELECT id, title, status, priority FROM tickets;
SELECT status, COUNT(*) as total FROM tickets GROUP BY status;
SELECT * FROM categories;
SELECT * FROM attachments;
```

| Utilisateur | Mot de passe | Type d'accès |
|---|---|---|
| `root` | `Root2024` | Accès complet — CLI serveur uniquement |
| `helpdesk_user` | `HelpDesk@2024!` | CRUD sur `helpdesk_db` — utilisé par Flask |
| `admin` | `Admin2024` | Interface Adminer GUI |

---

### Adminer — Interface graphique DB

```bash
# Ouvrir le tunnel SSH (garder ce terminal ouvert)
eval $(ssh-agent -s) && ssh-add ~/.ssh/aws-helpdesk

ssh -L 8080:127.0.0.1:8080 \
    -o ForwardAgent=yes \
    -J ubuntu@13.219.202.209 \
    ubuntu@10.0.2.50 -N &
```

Ouvrir dans le navigateur : **http://localhost:8080/adminer.php**

| Champ | Valeur |
|---|---|
| Système | MySQL |
| Serveur | `127.0.0.1` |
| Utilisateur | `admin` |
| Mot de passe | `Admin2024` |
| Base de données | `helpdesk_db` |

---

### API REST — Backend Flask

```bash
# ─── Authentification ───
TOKEN=$(curl -s -X POST http://13.219.202.209/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@helpdesk.com","password":"Admin@2024!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# ─── Endpoints disponibles ───
# Dashboard stats
curl -H "Authorization: Bearer $TOKEN" \
  http://13.219.202.209/api/dashboard/stats | python3 -m json.tool

# Liste des tickets
curl -H "Authorization: Bearer $TOKEN" \
  http://13.219.202.209/api/tickets | python3 -m json.tool

# Créer un ticket
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","priority":"medium","category_id":1}' \
  http://13.219.202.209/api/tickets

# Liste des utilisateurs
curl -H "Authorization: Bearer $TOKEN" \
  http://13.219.202.209/api/users | python3 -m json.tool

# Catégories ITIL
curl -H "Authorization: Bearer $TOKEN" \
  http://13.219.202.209/api/categories | python3 -m json.tool
```

| Route | Méthode | Auth | Description |
|---|---|---|---|
| `/api/auth/login` | POST | ❌ | Connexion + JWT |
| `/api/auth/register` | POST | ❌ | Inscription |
| `/api/auth/me` | GET | ✅ | Profil connecté |
| `/api/tickets` | GET / POST | ✅ | Liste / Créer ticket |
| `/api/tickets/:id` | GET / PATCH | ✅ | Détail / Modifier |
| `/api/comments/ticket/:id` | GET / POST | ✅ | Commentaires |
| `/api/attachments/ticket/:id` | GET / POST | ✅ | Pièces jointes |
| `/api/attachments/file/:name` | GET | ❌ | Servir un fichier |
| `/api/users` | GET | ✅ Admin | Gestion utilisateurs |
| `/api/dashboard/stats` | GET | ✅ | Statistiques ITIL |
| `/api/categories` | GET | ✅ | Catalogue services |

---

### Ansible — Administration

```bash
cd ansible/

# Activer l'agent SSH
eval $(ssh-agent -s) && ssh-add ~/.ssh/aws-helpdesk

# ─── Vérifications ───
ansible all -m ping                          # Connectivité
ansible-playbook playbooks/health_check.yml  # Santé des services

# ─── Déploiements ───
ansible-playbook playbooks/site.yml --ask-vault-pass           # Complet
ansible-playbook playbooks/deploy_from_github.yml --ask-vault-pass  # Depuis GitHub

# ─── Maintenance ───
ansible-playbook playbooks/rollback.yml      # Redémarrage services
```

> **Mot de passe Ansible Vault** : `helpdesk2024`

---

### Logs — Monitoring en temps réel

```bash
# ─── Backend Flask — logs live ───
ssh -o ForwardAgent=yes -J ubuntu@13.219.202.209 ubuntu@10.0.2.4 \
  "sudo journalctl -u helpdesk-backend -f"

# ─── Nginx — logs accès ───
ssh ubuntu@13.219.202.209 \
  "sudo tail -f /var/log/nginx/access.log"

# ─── MariaDB — logs ───
ssh -o ForwardAgent=yes -J ubuntu@13.219.202.209 ubuntu@10.0.2.50 \
  "sudo journalctl -u mariadb -f"
```

---

## 🚀 Déploiement depuis zéro

### Prérequis

```bash
# Vérifier les outils installés
aws --version          # AWS CLI configuré
terraform --version    # >= 1.5
ansible --version      # >= 2.16
python3 --version      # >= 3.10
node --version         # >= 20 (pour le build frontend)

# Générer la clé SSH
ssh-keygen -t rsa -b 4096 -f ~/.ssh/aws-helpdesk -N ""
```

---

### Étape 1 — Cloner le repo

```bash
git clone https://github.com/frank17art/helpdesk-aws.git
cd helpdesk-aws
```

---

### Étape 2 — Provisionner l'infrastructure AWS

```bash
cd terraform
terraform init
terraform plan       # Vérifier les ressources à créer
terraform apply      # Confirmer avec "yes"
```

**Outputs attendus après `terraform apply` :**
```
nginx_public_ip     = "X.X.X.X"
frontend_private_ip = "10.0.2.X"
backend_private_ip  = "10.0.2.X"
database_private_ip = "10.0.2.X"
```

> ⚠️ Notez ces IPs — elles sont nécessaires pour l'étape suivante.

---

### Étape 3 — Configurer l'inventaire Ansible

Modifier `ansible/inventory/hosts.ini` avec les IPs obtenues :

```ini
[bastion]
nginx ansible_host=<NGINX_IP> ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/aws-helpdesk

[frontend_servers]
frontend ansible_host=10.0.2.X ansible_user=ubuntu \
  ansible_ssh_common_args='-o StrictHostKeyChecking=no -o ForwardAgent=yes -o ProxyJump=ubuntu@<NGINX_IP>'

[backend_servers]
backend ansible_host=10.0.2.X ansible_user=ubuntu \
  ansible_ssh_common_args='-o StrictHostKeyChecking=no -o ForwardAgent=yes -o ProxyJump=ubuntu@<NGINX_IP>'

[database_servers]
database ansible_host=10.0.2.X ansible_user=ubuntu \
  ansible_ssh_common_args='-o StrictHostKeyChecking=no -o ForwardAgent=yes -o ProxyJump=ubuntu@<NGINX_IP>'

[all_nodes:children]
bastion
frontend_servers
backend_servers
database_servers
```

---

### Étape 4 — Configurer le Vault Ansible

```bash
cd ansible
ansible-vault create vault/secrets.yml
# Mot de passe vault : helpdesk2024
```

Contenu du fichier `secrets.yml` :

```yaml
mysql_root_password: "RootSecure@2024!"
mysql_user: "helpdesk_user"
mysql_password: "HelpDesk@2024!"
mysql_database: "helpdesk_db"
mysql_adminer_password: "Adminer@2024!"
flask_secret_key: "FlaskSuper$ecret2024!"
jwt_secret_key: "JWT$uper$ecret2024!"
```

---

### Étape 5 — Déployer l'application

```bash
cd ansible
eval $(ssh-agent -s) && ssh-add ~/.ssh/aws-helpdesk
ansible-playbook playbooks/site.yml --ask-vault-pass
```

Le playbook exécute dans l'ordre :
1. ✅ **Common** — Sécurité, UFW, fail2ban, utilisateur système
2. ✅ **MySQL** — MariaDB, Adminer, base de données, tables
3. ✅ **Backend** — Python venv, Flask, Gunicorn, service systemd
4. ✅ **Frontend** — Node.js, npm install, React build, Nginx
5. ✅ **Nginx LB** — Reverse proxy, configuration, SSL-ready

---

### Étape 6 — Mettre à jour l'IP dans le frontend

```bash
# Remplacer l'IP dans api.js et rebuilder
ssh -o ForwardAgent=yes -J ubuntu@<NGINX_IP> ubuntu@<FRONTEND_IP> \
  "cd /opt/helpdesk-frontend && \
   sudo sed -i 's|http://[0-9.]*/api|http://<NGINX_IP>/api|g' src/api.js && \
   sudo -u helpdesk npm run build && \
   sudo systemctl restart nginx"
```

---

### Étape 7 — Vérifier le déploiement

```bash
# Health check complet
ansible-playbook playbooks/health_check.yml
```

**Résultats attendus :**
```
MariaDB    : active ✅
Flask API  : active | HTTP 401 (JWT requis) ✅
Nginx LB   : active | HTTP 200 ✅
```

**Accéder à l'application :**
```
http://<NGINX_IP>
```

---

### Étape 8 — Nettoyage (après démo)

```bash
# ⚠️ Détruire l'infrastructure pour éviter les frais AWS
cd terraform
terraform destroy
```

---

## 📦 Playbooks Ansible

| Playbook | Commande | Description |
|---|---|---|
| **Maître** | `ansible-playbook playbooks/site.yml --ask-vault-pass` | Déploiement complet 5 phases |
| **GitHub** | `ansible-playbook playbooks/deploy_from_github.yml --ask-vault-pass` | Clone + redéploie depuis GitHub |
| **Health Check** | `ansible-playbook playbooks/health_check.yml` | Vérifie tous les services |
| **Rollback** | `ansible-playbook playbooks/rollback.yml` | Redémarre tous les services |
| **Common** | `ansible-playbook playbooks/deploy_common.yml` | Sécurité de base |
| **MySQL** | `ansible-playbook playbooks/deploy_mysql.yml --ask-vault-pass` | Base de données |
| **Backend** | `ansible-playbook playbooks/deploy_backend.yml --ask-vault-pass` | API Flask |
| **Frontend** | `ansible-playbook playbooks/deploy_frontend.yml` | Interface React |
| **Nginx** | `ansible-playbook playbooks/deploy_nginx.yml` | Load Balancer |

---

## 📁 Structure du projet

```
helpdesk-aws/
│
├── 📂 terraform/                     # Infrastructure as Code
│   ├── main.tf                       # VPC, EC2, SG, NAT Gateway, IGW
│   ├── variables.tf                  # Variables configurables
│   └── outputs.tf                    # IPs et ressources créées
│
├── 📂 ansible/                       # Automatisation
│   ├── ansible.cfg                   # Configuration Ansible
│   ├── 📂 inventory/
│   │   ├── hosts.ini                 # Inventaire multi-groupes
│   │   └── 📂 group_vars/
│   │       └── all.yml               # Variables globales
│   ├── 📂 roles/
│   │   ├── 📂 common/                # UFW, fail2ban, SSH hardening
│   │   ├── 📂 mysql/                 # MariaDB + Adminer + sécurisation
│   │   ├── 📂 backend/               # Python venv, Flask, Gunicorn, systemd
│   │   ├── 📂 frontend/              # Node.js, npm, React build, Nginx
│   │   └── 📂 nginx/                 # Reverse proxy config
│   ├── 📂 playbooks/
│   │   ├── site.yml                  # Orchestration complète
│   │   ├── deploy_from_github.yml    # Clone + déploiement GitHub
│   │   ├── health_check.yml          # Vérification services
│   │   ├── rollback.yml              # Redémarrage services
│   │   └── deploy_*.yml              # Playbooks individuels
│   └── 📂 vault/
│       └── secrets.yml               # 🔐 AES-256 — Credentials chiffrés
│
├── 📂 app/
│   ├── 📂 backend/                   # API REST Flask
│   │   ├── app.py                    # Application factory
│   │   ├── models.py                 # SQLAlchemy models
│   │   ├── extensions.py             # Extensions Flask
│   │   ├── requirements.txt          # Dépendances Python
│   │   ├── .env.example              # Variables d'environnement
│   │   └── 📂 routes/
│   │       ├── auth.py               # Login, register, JWT
│   │       ├── tickets.py            # CRUD tickets ITIL
│   │       ├── users.py              # Gestion utilisateurs
│   │       ├── categories.py         # Catalogue de services
│   │       ├── comments.py           # Commentaires tickets
│   │       ├── attachments.py        # Upload fichiers/photos
│   │       ├── notifications.py      # Notifications
│   │       └── dashboard.py          # Statistiques ITIL
│   │
│   └── 📂 frontend/                  # Interface React
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── 📂 src/
│           ├── main.jsx
│           ├── App.jsx
│           ├── api.js                # Axios + intercepteurs JWT
│           ├── 📂 utils/
│           │   └── date.js           # Timezone EST Toronto
│           ├── 📂 components/
│           │   └── Layout.jsx        # Sidebar + navigation responsive
│           └── 📂 pages/
│               ├── Login.jsx         # Auth + design NEXUS
│               ├── Register.jsx      # Inscription
│               ├── Dashboard.jsx     # KPIs + MTTR + Activity feed
│               ├── Tickets.jsx       # Liste + filtres + création
│               ├── TicketDetail.jsx  # Détail + upload + commentaires
│               └── Users.jsx         # Gestion collaborateurs
│
└── README.md                         # Ce fichier
```

---

## 🔐 Sécurité

### Architecture Defense in Depth

```
┌─────────────────────────────────────────────────┐
│  COUCHE 1 — AWS Security Groups                 │
│  Seul port 80/443 + SSH 22 ouverts sur bastion  │
├─────────────────────────────────────────────────┤
│  COUCHE 2 — Bastion Host Pattern                │
│  Frontend/Backend/DB inaccessibles depuis web   │
├─────────────────────────────────────────────────┤
│  COUCHE 3 — UFW Firewall                        │
│  Pare-feu actif sur chaque nœud                 │
├─────────────────────────────────────────────────┤
│  COUCHE 4 — fail2ban                            │
│  Protection brute-force SSH                     │
├─────────────────────────────────────────────────┤
│  COUCHE 5 — Ansible Vault (AES-256)             │
│  Credentials chiffrés, jamais en clair          │
├─────────────────────────────────────────────────┤
│  COUCHE 6 — JWT Authentication                  │
│  Access token 15min + Refresh 7 jours           │
├─────────────────────────────────────────────────┤
│  COUCHE 7 — bcrypt Password Hashing             │
│  Salted hash, irréversible                      │
└─────────────────────────────────────────────────┘
```

### Mesures implémentées

| Mesure | Détail |
|---|---|
| **Bastion Host** | Seul Nginx exposé sur internet (port 80) |
| **NAT Gateway** | Nœuds privés sortent sur internet sans être exposés |
| **Security Groups AWS** | Règles granulaires — chaque nœud n'accepte que le trafic nécessaire |
| **UFW** | Firewall actif — ports bloqués par défaut |
| **fail2ban** | Ban automatique après 3 tentatives SSH échouées |
| **Ansible Vault** | Tous les secrets chiffrés AES-256 — jamais stockés en clair |
| **JWT** | Tokens signés HS256, expiration 15 min, refresh 7 jours |
| **bcrypt** | Hachage des mots de passe avec sel aléatoire |
| **Rôles applicatifs** | Admin / Tech / User — permissions strictement vérifiées backend |
| **SSH Hardening** | PasswordAuthentication désactivé — clé uniquement |

---

## 👨‍💻 Auteur

<table>
  <tr>
    <td align="center">
      <strong>Frank Laurel Kadji Fomekon</strong><br>
      Technicien IT · DevOps Engineer<br>
      Collège Boréal — Programme TSI 2026<br>
      Toronto, Ontario, Canada<br>
      <br>
      <a href="https://github.com/frank17art">GitHub @frank17art</a>
    </td>
  </tr>
</table>

---

## 📜 Conformité & Standards

| Standard | Implémentation |
|---|---|
| **ITIL v4** | Gestion des incidents, SLA P1-P4, Catalogue de services, MTTR, Escalade |
| **ISO 27001** | Sécurité de l'information, contrôle d'accès, journalisation |
| **SOC 2** | Disponibilité, confidentialité, sécurité |

---

<div align="center">

**NEXUS Conseil & Associés** — *Clarté. Stratégie. Excellence.*

Toronto · Montréal · Vancouver

`© 2026 — Projet académique TSI — Collège Boréal`

</div>
