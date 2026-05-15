-- Contenus éditoriaux par fiche (D1). À appliquer une fois sur la base distante :
--   npx wrangler d1 execute chefs_db --remote --file=./data/migration-etablissement-fiches.sql
-- (ou --local pour le dev.)

CREATE TABLE IF NOT EXISTS etablissement_fiches (
    etablissement_id INTEGER PRIMARY KEY,
    description_text TEXT,
    photos_json TEXT,
    menu_prix TEXT,
    video_url TEXT,
    contact_json TEXT,
    card_cover_url TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
