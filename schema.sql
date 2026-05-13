-- Schéma D1 / SQLite pour l'annuaire (chefs + tables) et le catalogue Top Chef.

-- Tables historiques (restaurants étoilés / liens chef)
CREATE TABLE IF NOT EXISTS chefs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    top_chef_saison INTEGER,
    top_chef_rang TEXT,
    parcours_resume TEXT
);

CREATE TABLE IF NOT EXISTS etablissements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chef_id INTEGER,
    nom_restaurant TEXT NOT NULL,
    etoiles_michelin INTEGER DEFAULT 0,
    adresse TEXT,
    ville TEXT,
    latitude REAL,
    longitude REAL,
    telephone TEXT,
    email TEXT,
    site_web TEXT,
    FOREIGN KEY (chef_id) REFERENCES chefs(id)
);

-- Candidats Top Chef (France) : noms + saisons importables ; le reste à enrichir manuellement.
CREATE TABLE IF NOT EXISTS top_chef_candidats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_complet TEXT NOT NULL UNIQUE,
    saisons_json TEXT NOT NULL,
    parcours TEXT,
    diplome TEXT,
    email_contact TEXT,
    telephone_contact TEXT,
    site_web TEXT,
    lien_wikipedia TEXT,
    lien_fandom TEXT,
    notes_source TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Un candidat peut avoir plusieurs restaurants (actuels / passés).
CREATE TABLE IF NOT EXISTS top_chef_restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidat_id INTEGER NOT NULL,
    nom_restaurant TEXT NOT NULL,
    adresse TEXT,
    ville TEXT,
    latitude REAL,
    longitude REAL,
    telephone_public TEXT,
    email_reservation TEXT,
    site_web TEXT,
    etoiles_michelin INTEGER DEFAULT 0,
    est_actif INTEGER DEFAULT 1,
    FOREIGN KEY (candidat_id) REFERENCES top_chef_candidats(id)
);
