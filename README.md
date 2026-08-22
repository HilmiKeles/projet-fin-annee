# 🍵 Thé Tip Top - Application de Jeu-Concours

## 📝 À propos du projet
Projet de fin d'année consistant à développer une application web de jeu-concours pour la boutique "Thé Tip Top". Les clients peuvent s'inscrire, saisir le code présent sur leur ticket de caisse et découvrir immédiatement leur lot.

## 🛠️ Architecture & Stack Technique
Le projet est architecturé autour de conteneurs isolés pour garantir une fiabilité maximale en développement et en production.

* **Frontend :** React.js (Vite)
* **Backend :** Node.js / Express
* **Base de données :** PostgreSQL (via l'ORM Prisma)
* **Serveur Web / Proxy :** Nginx
* **Conteneurisation :** Docker & Docker Compose

## 🚀 Installation et Lancement (Environnement Local)

L'ensemble de l'infrastructure a été automatisé. Il n'est pas nécessaire d'installer Node ou PostgreSQL sur votre machine, tout est géré par Docker.

### Prérequis
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et en cours d'exécution.
* Git.

### Étapes de démarrage rapide

1. **Cloner le dépôt :**
   ```bash
   git clone <URL_DE_VOTRE_REPO>
   cd projet-fin-annee
Variables d'environnement :
Copiez le fichier .env.example en .env dans les dossiers correspondants si nécessaire.

Lancer l'infrastructure :
Exécutez simplement cette commande à la racine du projet :

Bash
docker-compose up
(Lors du premier lancement, Docker va construire les images et initialiser la base de données. Cela peut prendre quelques minutes).

Accéder à l'application :
Une fois les conteneurs démarrés, ouvrez votre navigateur à l'adresse : http://localhost
