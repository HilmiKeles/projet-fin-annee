# Comptes employé boutique

L'espace employé est sur **`/employe`**
(`https://dsp5-archi-024a-g3.fr/employe` en production).

Un employé voit **qui a gagné quel lot** et peut **marquer un lot comme remis**.

## Créer un employé (le plus simple)

1. Connecte-toi sur **`/admin`**
2. Dans **Créer un employé boutique**, saisis l'e-mail et un mot de passe
3. Clique **Créer l'employé**
4. Le collègue se connecte sur **`/employe`** avec ces identifiants

Mot de passe : 8 caractères min., une majuscule, une minuscule et un caractère spécial
(`Employe123!` par exemple).

Si le collègue a **déjà un compte client**, ouvre l'onglet **Clients** et clique
**Rendre employé** : il garde le même mot de passe.

## Autres méthodes (optionnel)

Script Docker :

```bash
docker exec -i thetiptop_backend node src/scripts/promouvoirEmploye.js \
  employe@exemple.fr 'MotDePasse1!'
```

SQL :

```bash
docker exec -i thetiptop_db psql -U thetiptop -d thetiptop -c \
  "UPDATE \"User\" SET role = 'EMPLOYEE' WHERE email = 'employe@exemple.fr';"
```
