# Comptes administrateur

Le back-office est sur **`/admin`**
(`https://dsp5-archi-024a-g3.fr/admin` en production).

Une fois connecté, la section **Tableaux de bord GA4 & KPI** affiche le taux de
conversion (tickets utilisés / tickets), les clics CTA du site et un ROI estimé
(valeur des lots / `CAMPAGNE_BUDGET`). Le lien Google Analytics 4 ouvre le détail
d’audience (pages vues, sources, temps réel).

Seuls les utilisateurs dont le rôle est `ADMIN` peuvent s’y connecter.
Un compte client créé via `/inscription` n’a **pas** ces droits tant qu’on ne le promeut pas.

## Compte admin par défaut

Au démarrage de l’API, le backend crée ou met à jour le compte défini dans le `.env` :

```env
ADMIN_EMAIL=admin@thetiptop.fr
ADMIN_PASSWORD=Admin123!
```

Identifiants par défaut :

- e-mail : `admin@thetiptop.fr`
- mot de passe : `Admin123!`

Change ces variables sur le VPS puis relance `docker compose up -d` pour appliquer un nouveau mot de passe à ce compte.

## Promouvoir un compte existant (collègue déjà inscrit)

Le collègue s’inscrit d’abord sur le site avec **son** e-mail et **son** mot de passe.
Ensuite, en SSH sur le VPS :

```bash
cd ~/projet-fin-annee

docker exec -i thetiptop_db psql -U thetiptop -d thetiptop -c \
  "UPDATE \"User\" SET role = 'ADMIN' WHERE email = 'collegue@exemple.fr';"
```

Il se connecte ensuite sur `/admin` avec **le même mot de passe** que son inscription.

Pour un compte **boutique** (voir les gagnants, marquer un lot remis), ouvre `/admin` puis **Créer un employé boutique**. Détail : [compte employé](compte-employe.md).

Vérifier que la ligne a bien été mise à jour :

```bash
docker exec -i thetiptop_db psql -U thetiptop -d thetiptop -c \
  "SELECT email, role FROM \"User\" WHERE email = 'collegue@exemple.fr';"
```

Le résultat doit afficher `ADMIN`. Si `UPDATE 0`, l’e-mail n’existe pas encore : le collègue doit d’abord créer son compte.

## Créer ou réinitialiser un admin (script)

Utile si le collègue n’a pas encore de compte, ou s’il a oublié son mot de passe.

Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial (`!`, `@`, etc.).

**Sur le VPS (conteneur déjà déployé avec le script) :**

```bash
docker exec -i thetiptop_backend node src/scripts/promouvoirAdmin.js \
  collegue@exemple.fr 'MotDePasse1!'
```

**En local (API Node, pas Docker) :**

```bash
cd backend
npm run admin:create -- collegue@exemple.fr "MotDePasse1!"
```

Le script crée le compte s’il n’existe pas, ou le passe `ADMIN` et remplace le mot de passe s’il existe déjà.

## Retirer les droits admin

```bash
docker exec -i thetiptop_db psql -U thetiptop -d thetiptop -c \
  "UPDATE \"User\" SET role = 'CLIENT' WHERE email = 'collegue@exemple.fr';"
```
