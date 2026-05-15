-- 1) Candidats manquants : tout chef avec top_chef_saison renseignée et un établissement géolocalisé,
--    absent de top_chef_candidats (ex. après import Michelin seul).
-- 2) Fiches restaurant Top Chef : copie des établissements vers top_chef_restaurants quand nom chef = nom candidat.
--
-- Requis : schema.sql, topchef-candidats-seed.sql (ou équivalent), données chefs/etablissements.
-- Idempotent sur les restaurants (pas de doublon candidat_id + nom_restaurant).
--
--   npm run db:seed:topchef-restaurants

INSERT OR IGNORE INTO top_chef_candidats (nom_complet, saisons_json)
SELECT ch.nom,
  CAST(json_array(ch.top_chef_saison) AS TEXT)
FROM chefs ch
WHERE ch.top_chef_saison IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM etablissements e
    WHERE e.chef_id = ch.id
      AND e.latitude IS NOT NULL
      AND e.longitude IS NOT NULL
  )
  AND NOT EXISTS (
    SELECT 1
    FROM top_chef_candidats c
    WHERE LOWER(TRIM(c.nom_complet)) = LOWER(TRIM(ch.nom))
  );

INSERT INTO top_chef_restaurants (
  candidat_id,
  nom_restaurant,
  adresse,
  ville,
  latitude,
  longitude,
  telephone,
  email,
  site_web,
  etoiles_michelin,
  est_actif
)
SELECT
  c.id,
  e.nom_restaurant,
  e.adresse,
  e.ville,
  e.latitude,
  e.longitude,
  NULLIF(TRIM(COALESCE(e.telephone, '')), ''),
  e.email,
  e.site_web,
  COALESCE(e.etoiles_michelin, 0),
  1
FROM etablissements e
INNER JOIN chefs ch ON ch.id = e.chef_id
INNER JOIN top_chef_candidats c
  ON LOWER(TRIM(c.nom_complet)) = LOWER(TRIM(ch.nom))
WHERE e.latitude IS NOT NULL
  AND e.longitude IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM top_chef_restaurants r
    WHERE r.candidat_id = c.id
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM(e.nom_restaurant))
  );
