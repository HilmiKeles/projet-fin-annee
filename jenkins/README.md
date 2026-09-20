# Infrastructure Jenkins (CI)

Ce dossier decrit l'integration de Jenkins au projet Thé Tip Top.

## Contenu
- `Dockerfile` : image Jenkins LTS + Docker CLI + plugins
- `plugins.txt` : liste des plugins Jenkins
- `docker-compose.yml` : service Jenkins (port 8080, agent :50000)
- `../Jenkinsfile` : pipeline declaratif versionne a la racine du repo

## Accès
- Production : https://jenkins.dsp5-archi-024a-g3.fr/
- Caddy reverse-proxifie le conteneur `jenkins:8080` (pas d'exposition du port 8080 sur l'hôte)

## Démarrage (production, à la racine du repo)
Jenkins est déclaré dans le `docker-compose.yml` racine, sur le même réseau que Caddy.
Ne pas lancer aussi `jenkins/docker-compose.yml` en parallèle (même `container_name`).

```bash
# Si un ancien conteneur Jenkins tourne encore (stack du dossier jenkins/)
cd jenkins && docker compose down && cd ..

docker compose up -d --build jenkins caddy
```

Une HTTP 502 sur le sous-domaine signifie que Caddy n'atteint pas Jenkins
(conteneur arrêté, mauvais réseau, ou port 8080 déjà pris sur l'hôte).

Mot de passe initial (premier démarrage) :
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## Configuration requise dans l'interface Jenkins
1. Creer un job de type **Pipeline** (ou **Multibranch Pipeline**)
2. Le lier a ce depot GitHub (URL `https://github.com/HilmiKeles/projet-fin-annee`)
3. Script Path : `Jenkinsfile`
4. Activer le webhook GitHub (Settings > Webhooks du repo) pointant vers
   `https://jenkins.dsp5-archi-024a-g3.fr/github-webhook/`

## Securite / notes
- Le socket Docker de l'hote est monte pour permettre les `docker build`
  dans le pipeline : c'est puissant, a securiser cote infra (acces reserve).
- Le user `jenkins` n'est pas root. L'entrypoint aligne automatiquement son
  groupe sur le GID de `/var/run/docker.sock` (sinon : `permission denied`
  sur le daemon Docker pendant `Install & Lint`).
- Toute modification du workflow se fait en editant `Jenkinsfile` a la racine
  (conformement a l'exigence : pas besoin d'acces a l'interface Jenkins).

### Erreur `permission denied ... docker.sock`
Reconstruire l'image Jenkins pour prendre l'entrypoint, puis relancer :

```bash
# Production (racine du repo)
docker compose up -d --build jenkins

# Ou stack isolee
cd jenkins && docker compose up -d --build
```

Verifier depuis le conteneur :

```bash
docker exec -u jenkins jenkins id
docker exec -u jenkins jenkins docker info
```

`id` doit lister un groupe dont le GID = `stat -c '%g' /var/run/docker.sock` sur l'hote.
