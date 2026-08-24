# Thé Tip Top — Jeu-Concours
> Projet étudiant fictif réalisé dans le cadre du DSP5 Archi Web — Furious Ducks
Agency.
> Aucun achat réel ni réservation ne peut être effectué sur ce site.

## Présentation
Application web du jeu-concours Thé Tip Top : les clients participent via un code
ticket obtenu en boutique (ou en ligne) et remportent des lots (thés, coffrets...).
- **Frontend** : WebApp React (Vite, Tailwind) — participants + back-office
- **Backend** : API REST Node.js/Express + Prisma (PostgreSQL)
- **Tirages au sort** : effectués côté serveur
- **Communication API** : webApp, caisses en magasin, futur site e-commerce
  
## Fonctionnalités
- Inscription / connexion / profil utilisateur
- Participation au jeu via code ticket
- Visualisation des gains et des lots
- Back-office administrateur : statistiques (tickets, lots, gagnants), export emailing
- Espace employé boutique : validation et remise des gains
- Responsive (mobile / tablette / desktop), accessible et RGPD friendly
  
## Stack technique
| Couche | Technologie |
| Frontend | React, Vite, TailwindCSS, Nginx |
| Backend | Node.js, Express, Prisma |
| BDD | PostgreSQL 16 |
| Conteneurisation | Docker / Docker Compose |
| CI/CD | (à compléter : Jenkins / GitHub Actions) |
| Monitoring | (à compléter : Prometheus, Grafana) |

## Structure du projet
├── frontend/ # WebApp React (Docker + Nginx)
├── backend/ # API Express + Prisma (Docker)
├── docker-compose.yml
└── nginx.conf

## Installation & lancement

### Prérequis
- Docker & Docker Compose
- 
### Lancement
```bash
cp .env.example .env # renseigner les variables
docker compose up -d --build
• Frontend : http://localhost
• API : http://localhost:4000
• BDD : localhost:5432
Variables d'environnement
Variable Description
DB_PASSWORD Mot de passe PostgreSQL
JWT_SECRET Clé secrète JWT
 Mise en ligne
• Site : http://dsp5-archi-024a-g3.fr/
• Workflow : http://wk-archi-oXXa-…-GX.fr (jenkins.wk-…, grafana.wk-…)
 Équipe
Membre Rôle
- Chef de projet
- Développeur front
- Développeur back
- DevOps

 Liens utiles
• Suivi de projet (Trello/Notion public)
• Cahier des charges
• Cahier des spécifications techniques
 Mentions légales
Projet étudiant fictif — Thé Tip Top est une marque fictive. Aucune transaction réelle ne
peut être effectuée.
