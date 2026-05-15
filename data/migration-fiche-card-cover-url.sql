-- Image de couverture pour la carte liste + bandeau fiche (URL https).
-- À appliquer sur D1 distant si la table existe déjà :
--   npx wrangler d1 execute chefs_db --remote --file=./data/migration-fiche-card-cover-url.sql

ALTER TABLE etablissement_fiches ADD COLUMN card_cover_url TEXT;
