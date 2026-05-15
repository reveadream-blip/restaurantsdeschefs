-- Badge « Sponsoring » (case à cocher dans /admin/fiche).
-- npx wrangler d1 execute chefs_db --remote --file=./data/migration-fiche-sponsoring.sql

ALTER TABLE etablissement_fiches ADD COLUMN sponsoring INTEGER NOT NULL DEFAULT 0;
