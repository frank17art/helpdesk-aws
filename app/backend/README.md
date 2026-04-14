# NEXUS Conseil - Backend API

API REST Flask pour le systeme de gestion des incidents IT.

## Installation locale

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Remplir les variables
flask run
```

## Routes disponibles

- POST /api/auth/login
- POST /api/auth/register
- GET  /api/tickets
- POST /api/tickets
- GET  /api/dashboard/stats
- GET  /api/users (admin)
