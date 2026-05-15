-- Schéma D1 / SQLite — pas de données personnelles des chefs.
-- Seuls téléphone et e-mail des établissements (restaurants) sont prévus au niveau contact.

-- Chefs / candidats : identité et contexte pro (pas de mail ni téléphone perso ici).
CREATE TABLE IF NOT EXISTS chefs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    top_chef_saison INTEGER,
    top_chef_rang TEXT,
    parcours_resume TEXT
);

-- Restaurants : coordonnées = celles du restaurant (standard, réservation, accueil).
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

-- Candidats Top Chef : noms + saisons ; pas de champs de contact personnel.
CREATE TABLE IF NOT EXISTS top_chef_candidats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_complet TEXT NOT NULL UNIQUE,
    saisons_json TEXT NOT NULL,
    parcours TEXT,
    diplome TEXT,
    site_web TEXT,
    lien_wikipedia TEXT,
    lien_fandom TEXT,
    notes_source TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Restaurants liés à un candidat : seul endroit pour téléphone / mail (établissement).
CREATE TABLE IF NOT EXISTS top_chef_restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidat_id INTEGER NOT NULL,
    nom_restaurant TEXT NOT NULL,
    adresse TEXT,
    ville TEXT,
    latitude REAL,
    longitude REAL,
    telephone TEXT,
    email TEXT,
    site_web TEXT,
    etoiles_michelin INTEGER DEFAULT 0,
    est_actif INTEGER DEFAULT 1,
    FOREIGN KEY (candidat_id) REFERENCES top_chef_candidats(id)
);

-- Fiches éditoriales (description, photos URL, menu/prix, vidéo, contact) — éditables via /admin.
CREATE TABLE IF NOT EXISTS etablissement_fiches (
    etablissement_id INTEGER PRIMARY KEY,
    description_text TEXT,
    photos_json TEXT,
    menu_prix TEXT,
    video_url TEXT,
    contact_json TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
