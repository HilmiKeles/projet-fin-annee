# Infrastructure Jenkins (CI)

Ce dossier decrit l'integration de Jenkins au projet Thé Tip Top.

## Contenu
- `Dockerfile` : image Jenkins LTS + Docker CLI + plugins
- `plugins.txt` : liste des plugins Jenkins
- `docker-compose.yml` : service Jenkins (port 8080, agent :50000)
- `../Jenkinsfile` : pipeline declaratif versionne a la racine du repo

## Demarrage en local
```bash
cd jenkins
docker compose up -d --build
# Interface : http://localhost:8080
```
Recuper du mot de passe initial (premier demarrage) :
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## Configuration requise dans l'interface Jenkins
1. Creer un job de type **Pipeline** (ou **Multibranch Pipeline**)
2. Le lier a ce depot GitHub (URL `https://github.com/HilmiKeles/projet-fin-annee`)
3. Script Path : `Jenkinsfile`
4. Activer le webhook GitHub (Settings > Webhooks du repo) pointant vers
   `http://<hote>/github-webhook/`

## Securite / notes
- Le socket Docker de l'hote est monte pour permettre les `docker build`
  dans le pipeline : c'est puissant, a securiser cote infra (acces reserve).
- Toute modification du workflow se fait en editant `Jenkinsfile` a la racine
  (conformement a l'exigence : pas besoin d'acces a l'interface Jenkins).
