-- Abonnements partenaires + réglages bannière (admin /partenariat).
-- npx wrangler d1 execute chefs_db --remote --file=./data/migration-abonnement-partenaire.sql

ALTER TABLE etablissement_fiches ADD COLUMN subscription_tier TEXT;

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO site_settings (key, value_json) VALUES (
  'partner_banner',
  '{"enabled":true,"interval":5,"title":"Visibilité premium pour votre table","subtitle":"Apparaissez en tête des recherches dans votre ville — packs dès 9 €/mois.","ctaLabel":"Découvrir les packs","ctaHref":"/partenariat"}'
);
