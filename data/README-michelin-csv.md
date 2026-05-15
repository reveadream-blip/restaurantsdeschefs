# Données Michelin France (CSV)

Le fichier **`france_complete_2024.csv`** provient du dépôt public  
[pineapple-bois/Michelin_Rated_Restaurants](https://github.com/pineapple-bois/Michelin_Rated_Restaurants)  
(chemin : `Years/2024/data/France/france_complete_2024.csv`), construit à partir du **Guide Michelin France 2024**.

- Colonnes utilisées : nom du restaurant, adresse, ville (`location`), étoiles, latitude, longitude, URL du site.
- Il n’y a pas de colonne « chef » : le script `scripts/build-etablissements-from-csv.mjs` déduit un libellé affichable à partir du nom de l’établissement (heuristique).

## Régénérer le seed et les données démo front

```bash
npm run data:michelin-import
```

Puis déployer la base D1 (après `schema.sql` et `topchef-candidats-seed.sql` si besoin) :

```bash
npx wrangler d1 execute chefs_db --remote --file=./data/etablissements-demo-seed.sql
npm run db:seed:topchef-restaurants
```

Licence et conditions d’usage des données Michelin : se conformer aux droits du **Guide Michelin** et à la licence du dépôt source ci-dessus.
