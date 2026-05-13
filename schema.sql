-- schema.sql
CREATE TABLE chefs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    top_chef_saison INTEGER,
    top_chef_rang TEXT,
    parcours_resume TEXT
);

CREATE TABLE etablissements (
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