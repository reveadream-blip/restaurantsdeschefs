-- Généré par scripts/seed-topchef-restaurants-from-csv.mjs (145 requêtes INSERT).
-- Associe candidats Top Chef (topchef-noms.json) au CSV Michelin France + data/topchef-restaurants-manual.json.
-- Les entrées manuelles sont appliquées en premier et remplacent le matching CSV pour le même candidat.
-- Prérequis : topchef-candidats-seed.sql déjà appliqué sur D1.
--   npx wrangler d1 execute chefs_db --remote --file=./data/topchef-restaurants-from-csv.sql

INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Augé' LIMIT 1),
       'La Maison de Petit Pierre',
       '22 avenue Pierre Verdier, 34500 Béziers, France',
       'Béziers',
       43.344297,
       3.2308641,
       '',
       NULL,
       'https://www.lamaisondepetitpierre.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Augé' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Augé' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Maison de Petit Pierre'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Stéphanie Le Quellec' LIMIT 1),
       'La Scène',
       '32 avenue Matignon, 75008 Paris, France',
       'Paris',
       48.8720354,
       2.314504,
       '',
       NULL,
       'https://www.la-scene.paris/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Stéphanie Le Quellec' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Stéphanie Le Quellec' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Scène'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Sang Boyer' LIMIT 1),
       'Pierre Sang in Oberkampf',
       '55 rue Oberkampf, 75011 Paris, France',
       'Paris',
       48.8647051,
       2.3724235,
       '',
       NULL,
       'https://pierresang.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Sang Boyer' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Sang Boyer' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Pierre Sang in Oberkampf'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ludovic Turac' LIMIT 1),
       'Une Table au Sud',
       '2 quai du Port, 13002 Marseille, France',
       'Marseille',
       43.2963677,
       5.373659,
       '',
       NULL,
       'https://www.unetableausud.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ludovic Turac' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ludovic Turac' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Une Table au Sud'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Tabata Bonardi' LIMIT 1),
       'Ombellule',
       '36 cours Franklin Roosevelt, 69006 Lyon, France',
       'Lyon',
       45.7687857,
       4.8469171,
       '',
       NULL,
       'https://www.ombellule.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Tabata Bonardi' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Tabata Bonardi' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Ombellule'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Norbert Tarayre' LIMIT 1),
       '19.20 by Norbert Tarayre',
       '33 avenue George V, 75008 Paris, France (hôtel Prince de Galles)',
       'Paris',
       48.8691274,
       2.3007665,
       '',
       NULL,
       'https://www.19-20paris.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Norbert Tarayre' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Norbert Tarayre' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('19.20 by Norbert Tarayre'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Denny Imbroisi' LIMIT 1),
       'Ischia',
       '14 rue Cauchy, 75015 Paris, France',
       'Paris',
       48.8429578,
       2.2759583,
       '',
       NULL,
       'https://restaurant-ischia.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Denny Imbroisi' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Denny Imbroisi' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Ischia'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mehdi Kebboul' LIMIT 1),
       'Le Savarin',
       '4 rue de Navarin, 75009 Paris, France',
       'Paris',
       48.8795302,
       2.3396341,
       '',
       NULL,
       'https://www.lapantruchoise.com/lesavarin',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mehdi Kebboul' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mehdi Kebboul' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Savarin'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Gérald Guille' LIMIT 1),
       'Pureté',
       '79 rue de la Monnaie, 59800 Lille, France',
       'Lille',
       50.6415293,
       3.0618541,
       '',
       NULL,
       'https://www.restaurant-purete.com/fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Gérald Guille' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Gérald Guille' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Pureté'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Naoëlle d''Hainaut' LIMIT 1),
       'L''or Q''idée',
       '6 rue de la Pierre aux Poissons, 95300 Pontoise, France',
       'Pontoise',
       49.050436,
       2.0977379,
       '',
       NULL,
       'https://www.lorqidee.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Naoëlle d''Hainaut' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Naoëlle d''Hainaut' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('L''or Q''idée'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Florent Ladeyn' LIMIT 1),
       'Pigments',
       '1 allée du Musée (LaM), 59650 Villeneuve-d''Ascq, France',
       'Villeneuve-d''Ascq',
       50.6375886,
       3.1511611,
       '',
       NULL,
       'https://pigments.zensites.zenchef.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Florent Ladeyn' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Florent Ladeyn' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Pigments'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Yoni Saada' LIMIT 1),
       'Phénice',
       '7 rue du Conservatoire, 75009 Paris, France (Hôtel De Nell)',
       'Paris',
       48.8731709,
       2.3467834,
       '',
       NULL,
       'https://www.hoteldenell.com/restaurant-bar',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Yoni Saada' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Yoni Saada' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Phénice'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thibault Sombardier' LIMIT 1),
       'Anne',
       '28 place des Vosges, 75003 Paris, France (Hôtel Pavillon de la Reine)',
       'Paris',
       48.8563739,
       2.3661099,
       '',
       NULL,
       'https://www.pavillon-de-la-reine.com/restaurant',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thibault Sombardier' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thibault Sombardier' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Anne'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Steven Ramon' LIMIT 1),
       'Rouge Barre',
       '50 rue de la Halle, 59800 Lille, France',
       'Lille',
       50.6443664,
       3.0594052,
       '',
       NULL,
       'https://www.rougebarre.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Steven Ramon' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Steven Ramon' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Rouge Barre'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Christophe Pirotais' LIMIT 1),
       'Mieux qu''à la Maison (MQLM)',
       '137 rue du Général Leclerc, 95320 Saint-Leu-la-Forêt, France',
       'Saint-Leu-la-Forêt',
       49.0208265,
       2.2387495,
       '',
       NULL,
       'https://mieuxqualamaison.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Christophe Pirotais' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Christophe Pirotais' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Mieux qu''à la Maison (MQLM)'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mohamed Si Abdelkader' LIMIT 1),
       'Médley',
       '72 route de Pontoise, 95100 Argenteuil, France',
       'Argenteuil',
       48.947236,
       2.2061686,
       '',
       NULL,
       'https://medley-si.netlify.app/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mohamed Si Abdelkader' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mohamed Si Abdelkader' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Médley'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vanessa Robuschi' LIMIT 1),
       'Question de Goût',
       '147 avenue Joseph Vidal, 13008 Marseille, France',
       'Marseille',
       43.2516822,
       5.3781947,
       '',
       NULL,
       'https://unequestiondegout.fr/fr',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vanessa Robuschi' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vanessa Robuschi' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Question de Goût'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Joy-Astrid Poinsot' LIMIT 1),
       'Chez Camille',
       '1 place Édouard Herriot, 21230 Arnay-le-Duc, France',
       'Arnay-le-Duc',
       47.1337388,
       4.4860426,
       '',
       NULL,
       'https://www.chezcamillearnay.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Joy-Astrid Poinsot' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Joy-Astrid Poinsot' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Chez Camille'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémie Izarn' LIMIT 1),
       'La Tour des Sens',
       'Route de Theys, 38570 Tencin, France',
       'Tencin',
       45.3134683,
       5.9655763,
       '',
       NULL,
       'https://latourdessens.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémie Izarn' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémie Izarn' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Tour des Sens'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexis Delassaux' LIMIT 1),
       'Luz Verde',
       '24 rue Henry Monnier, 75009 Paris, France',
       'Paris',
       48.8803935,
       2.3376028,
       '',
       NULL,
       'https://luzverde.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexis Delassaux' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexis Delassaux' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Luz Verde'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Carl Dutting' LIMIT 1),
       'Bella',
       '2 rue Brougham, square Mistral, 06400 Cannes, France (Hôtel & Spa Belle Plage)',
       'Cannes',
       43.549483,
       7.007531,
       '',
       NULL,
       'https://www.hotelbelleplage.fr/fr/page/restaurant-rooftop-cannes.12413.html',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Carl Dutting' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Carl Dutting' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Bella'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Camille Delcroix' LIMIT 1),
       'Bacôve',
       '8 rue Caventou, 62500 Saint-Omer, France',
       'Saint-Omer',
       50.7482609,
       2.2553606,
       '',
       NULL,
       'https://restaurant-bacove.com/fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Camille Delcroix' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Camille Delcroix' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Bacôve'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Descouls' LIMIT 1),
       'Origines',
       'Rue du clos de la Chaux, 63500 Le Broc, France (Issoire)',
       'Le Broc',
       45.5014095,
       3.2436174,
       '',
       NULL,
       'https://restaurant-origines.fr/fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Descouls' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Descouls' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Origines'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Damien Laforce' LIMIT 1),
       'Le Braque',
       '45 rue de la Monnaie, 59000 Lille, France',
       'Lille',
       50.6410463,
       3.0627196,
       '',
       NULL,
       'https://www.le-braque.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Damien Laforce' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Damien Laforce' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Braque'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Camille Maury' LIMIT 1),
       'Maison Nouvelle',
       '11 rue Rode, 33000 Bordeaux, France',
       'Bordeaux',
       44.8524933,
       -0.5720934,
       '',
       NULL,
       'https://maison-nouvelle.fr/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Camille Maury' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Camille Maury' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Maison Nouvelle'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Baptiste Renouard' LIMIT 1),
       'Ochre',
       '56 rue du Gué, 92500 Rueil-Malmaison, France',
       'Rueil-Malmaison',
       48.8778387,
       2.1830535,
       '',
       NULL,
       'https://ochre.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Baptiste Renouard' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Baptiste Renouard' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Ochre'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Anissa Boulesteix' LIMIT 1),
       'Le Jardin Alpin (Cheval Blanc)',
       'Le Jardin Alpin, Courchevel 1850, 73120 Courchevel, France (Hôtel Cheval Blanc)',
       'Courchevel',
       45.4094877,
       6.6338696,
       '',
       NULL,
       'https://www.chevalblanc.com/',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Anissa Boulesteix' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Anissa Boulesteix' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Jardin Alpin (Cheval Blanc)'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Marie-Victorine Manoa' LIMIT 1),
       'La Fontaine Gaillon',
       '1 rue de la Michodière, 75002 Paris, France',
       'Paris',
       48.8691078,
       2.3344279,
       '',
       NULL,
       'https://www.fitz-group.fr/fontaine-gaillon-paris',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Marie-Victorine Manoa' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Marie-Victorine Manoa' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Fontaine Gaillon'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Cachot' LIMIT 1),
       'Le Vaisseau',
       '35 rue Faidherbe, 75011 Paris, France',
       'Paris',
       48.8531937,
       2.3825854,
       '',
       NULL,
       'https://www.restaurant-vaisseau.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Cachot' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Cachot' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Vaisseau'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean-Philippe Berens' LIMIT 1),
       'Ducasse sur Seine',
       '19 Port Debilly, 75016 Paris, France',
       'Paris',
       48.8604329,
       2.2917343,
       '',
       NULL,
       'https://ducasse-seine.com/fr',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean-Philippe Berens' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean-Philippe Berens' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Ducasse sur Seine'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mohamed Cheikh' LIMIT 1),
       'Meïda',
       '10 place de la République, 93400 Saint-Ouen-sur-Seine, France',
       'Saint-Ouen-sur-Seine',
       48.9117906,
       2.3331565,
       '',
       NULL,
       'https://www.meida.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mohamed Cheikh' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mohamed Cheikh' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Meïda'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sarah Mainguy' LIMIT 1),
       'Freia',
       '22 boulevard de Berlin, 44000 Nantes, France',
       'Nantes',
       47.2167806,
       -1.5366484,
       '',
       NULL,
       'https://www.freia-restaurant.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sarah Mainguy' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sarah Mainguy' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Freia'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Baptiste Trudel' LIMIT 1),
       'Halo',
       '12 rue Saint-Sauveur, 75002 Paris, France',
       'Paris',
       48.8660178,
       2.3488601,
       '',
       NULL,
       'https://www.halo-paris.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Baptiste Trudel' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Baptiste Trudel' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Halo'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jarvis Scott' LIMIT 1),
       'Turbulent',
       '1 rue Durand Couyère, 14360 Trouville-sur-Mer, France',
       'Trouville-sur-Mer',
       49.364229,
       0.0836106,
       '',
       NULL,
       'https://turbulent-trouville.com/fr',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jarvis Scott' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jarvis Scott' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Turbulent'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Zedda' LIMIT 1),
       'Culina Hortus',
       '38 rue de l''Arbre Sec, 69001 Lyon, France',
       'Lyon',
       45.7666794,
       4.8373615,
       '',
       NULL,
       'https://www.culinahortus.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Zedda' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adrien Zedda' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Culina Hortus'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sébastien Renard' LIMIT 1),
       'Maison Renard',
       '15 place de la République, boulevard Kitchener, 62400 Béthune, France',
       'Béthune',
       50.5323226,
       2.6407399,
       '',
       NULL,
       'https://www.maisonrenard-bethune.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sébastien Renard' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sébastien Renard' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Maison Renard'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thibaut Spiwack' LIMIT 1),
       'Anona',
       '80 boulevard des Batignolles, 75017 Paris, France',
       'Paris',
       48.8819703,
       2.3187122,
       '',
       NULL,
       'https://www.anona.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thibaut Spiwack' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thibaut Spiwack' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Anona'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lilian Douchet' LIMIT 1),
       'Le Capucine',
       '480 route du Bois du Breuil, 14600 Pennedepie, France',
       'Pennedepie',
       49.4037071,
       0.1783194,
       '',
       NULL,
       'https://jardins-coppelia.com/fr/produits/5526037231774466085/5526040324209639461/5528439191639162917',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lilian Douchet' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lilian Douchet' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Capucine'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ambroise Voreux' LIMIT 1),
       'La Cabane à Matelot',
       '19 avenue du 11 Novembre, 37130 Bréhémont, France',
       'Bréhémont',
       47.295309,
       0.353658,
       '',
       NULL,
       'https://les-pecheries-ligeriennes.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ambroise Voreux' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ambroise Voreux' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Cabane à Matelot'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Renaud Ramamourty' LIMIT 1),
       'Petrossian',
       '13 boulevard de la Tour-Maubourg, 75007 Paris, France',
       'Paris',
       48.8609742,
       2.3104452,
       '',
       NULL,
       'https://restaurant.petrossian.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Renaud Ramamourty' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Renaud Ramamourty' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Petrossian'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Valentin Raffali' LIMIT 1),
       'Bus Palladium',
       '6 rue Pierre Fontaine, 75009 Paris, France',
       'Paris',
       48.8807709,
       2.3349113,
       '',
       NULL,
       'https://www.buspalladium.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Valentin Raffali' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Valentin Raffali' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Bus Palladium'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Anicée Lacrouts' LIMIT 1),
       'La Table',
       '13 vieille route des Pensières, 74290 Veyrier-du-Lac, France',
       'Veyrier-du-Lac',
       45.8889235,
       6.1721868,
       '',
       NULL,
       'https://yoann-conte.com/la-table-de-yoann-conte/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Anicée Lacrouts' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Anicée Lacrouts' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Quentin Mauro' LIMIT 1),
       'Restaurant Donna',
       '157 rue Saint-Martin, 75003 Paris, France',
       'Paris',
       48.8622221,
       2.3518817,
       '',
       NULL,
       'https://www.donna-paris.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Quentin Mauro' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Quentin Mauro' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Restaurant Donna'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Grégoire Touchard' LIMIT 1),
       'Pavyllon Paris',
       'Pavillon Ledoyen, 8 avenue Dutuit, 75008 Paris, France',
       'Paris',
       48.8660193,
       2.315754,
       '',
       NULL,
       'https://www.yannick-alleno.com/les-etablissements-du-groupe/pavyllon-paris',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Grégoire Touchard' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Grégoire Touchard' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Pavyllon Paris'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ilane Tinchant' LIMIT 1),
       'L''Oursin',
       '1 boulevard des Moulins, 13620 Carry-le-Rouet, France',
       'Carry-le-Rouet',
       43.3297339,
       5.1512273,
       '',
       NULL,
       'https://www.hotelbleucarry.com/fr/restaurant-et-bar.html',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ilane Tinchant' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ilane Tinchant' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('L''Oursin'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Charles Neyers' LIMIT 1),
       'Le Boréal',
       '39 rue Montcalm, 75018 Paris, France',
       'Paris',
       48.893816,
       2.3390239,
       '',
       NULL,
       'https://www.leborealparis.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Charles Neyers' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Charles Neyers' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Boréal'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Esteban Salazar' LIMIT 1),
       'Le Tilleul',
       '1 rue du Château-du-Theil, 19200 Ussel, France',
       'Ussel',
       45.5564317,
       2.3268836,
       '',
       NULL,
       'https://www.chateaudutheil.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Esteban Salazar' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Esteban Salazar' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Tilleul'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Claudio Semedo Borges' LIMIT 1),
       'Prince de Galles',
       '33 avenue George V, 75008 Paris, France',
       'Paris',
       48.8691274,
       2.3007665,
       '',
       NULL,
       'https://www.marriott.com/fr/hotels/parlc-prince-de-galles-a-luxury-collection-hotel-paris/overview/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Claudio Semedo Borges' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Claudio Semedo Borges' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Prince de Galles'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Steven Thiebault-Pellegrino' LIMIT 1),
       'Leptine',
       '16 rue Hippolyte Flandrin, 69001 Lyon, France',
       'Lyon',
       45.7680321,
       4.8306177,
       '',
       NULL,
       'https://www.leptine.fr/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Steven Thiebault-Pellegrino' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Steven Thiebault-Pellegrino' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Leptine'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Noémie Cadré' LIMIT 1),
       'Caravane Palace',
       '13 rue Saint-Georges, 35000 Rennes, France',
       'Rennes',
       48.1118335,
       -1.676539,
       '',
       NULL,
       'https://www.caravanepalace.pro/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Noémie Cadré' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Noémie Cadré' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Caravane Palace'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Parage' LIMIT 1),
       'Prévelle',
       '34 rue Saint-Dominique, 75007 Paris, France',
       'Paris',
       48.8599844,
       2.3154233,
       '',
       NULL,
       'https://prevelle.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Parage' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Parage' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Prévelle'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Dylan Bury' LIMIT 1),
       'Maison Rostang',
       '20 rue Rennequin, Paris, 75017, France',
       'Paris',
       48.881407,
       2.2985363,
       '',
       NULL,
       'https://www.maisonrostang.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Dylan Bury' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Dylan Bury' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Maison Rostang'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Antoine Garcia' LIMIT 1),
       'Le Clos des Sens',
       '13 rue Jean-Mermoz - à Annecy-le-Vieux, Annecy, 74940, France',
       'Annecy',
       45.9176317,
       6.1445765,
       '',
       NULL,
       'https://www.closdessens.com/',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Antoine Garcia' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Antoine Garcia' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Clos des Sens'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexy Algar-Denos' LIMIT 1),
       'L''Almandin',
       'Boulevard de l''Almandin, St-Cyprien Sud, Saint-Cyprien, 66750, France',
       'Saint-Cyprien',
       42.6095379,
       3.036187,
       '',
       NULL,
       'https://www.almandin.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexy Algar-Denos' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexy Algar-Denos' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('L''Almandin'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matteo Pioppi' LIMIT 1),
       'Blanc',
       '52 rue de Longchamp, Paris, 75116, France',
       'Paris',
       48.8651172,
       2.2874808,
       '',
       NULL,
       'https://blanc-paris.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matteo Pioppi' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matteo Pioppi' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Blanc'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Tom Paduano' LIMIT 1),
       'Le Feuillée - Le Couvent des Minimes',
       'Chemin des Jeux-de-Maï, Mane, 04300, France',
       'Mane',
       43.9395915,
       5.7723757,
       '',
       NULL,
       'https://www.couventdesminimes-hotelspa.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Tom Paduano' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Tom Paduano' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Feuillée - Le Couvent des Minimes'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Kuntz' LIMIT 1),
       'Ida',
       '117 rue de Vaugirard, 75015 Paris, France',
       'Paris',
       48.8447004,
       2.3190024,
       '',
       NULL,
       'https://www.restaurant-ida.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Kuntz' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Kuntz' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Ida'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Viviana Pisacane' LIMIT 1),
       'Le Bœuf d''Argent',
       '29 rue du Bœuf, Lyon, 69005, France',
       'Lyon',
       45.762197,
       4.8264533,
       '',
       NULL,
       'https://restaurant-leboeufdargent.com/',
       0,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Viviana Pisacane' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Viviana Pisacane' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Bœuf d''Argent'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adel Dakkar' LIMIT 1),
       'Casadelmar',
       'route de Palombaggia, Porto-Vecchio, 20137, France',
       'Porto-Vecchio',
       41.5948102,
       9.3099771,
       '',
       NULL,
       'https://www.casadelmar.fr',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adel Dakkar' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Adel Dakkar' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Casadelmar'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Dionisio' LIMIT 1),
       'AM par Alexandre Mazzia',
       '9 rue François-Rocca, Marseille, 13008, France',
       'Marseille',
       43.2701104,
       5.3862325,
       '',
       NULL,
       'https://www.alexandre-mazzia.com/',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Dionisio' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Dionisio' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('AM par Alexandre Mazzia'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Marchon' LIMIT 1),
       'AM par Alexandre Mazzia',
       '9 rue François-Rocca, Marseille, 13008, France',
       'Marseille',
       43.2701104,
       5.3862325,
       '',
       NULL,
       'https://www.alexandre-mazzia.com/',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Marchon' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Marchon' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('AM par Alexandre Mazzia'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Moormann' LIMIT 1),
       'AM par Alexandre Mazzia',
       '9 rue François-Rocca, Marseille, 13008, France',
       'Marseille',
       43.2701104,
       5.3862325,
       '',
       NULL,
       'https://www.alexandre-mazzia.com/',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Moormann' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Moormann' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('AM par Alexandre Mazzia'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Spinelli' LIMIT 1),
       'AM par Alexandre Mazzia',
       '9 rue François-Rocca, Marseille, 13008, France',
       'Marseille',
       43.2701104,
       5.3862325,
       '',
       NULL,
       'https://www.alexandre-mazzia.com/',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Spinelli' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Alexandre Spinelli' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('AM par Alexandre Mazzia'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Arthur Vonderheyden' LIMIT 1),
       'Paul-Arthur',
       '23-25 place de la Pucelle, Rouen, 76000, France',
       'Rouen',
       49.4423399,
       1.0884942,
       '',
       NULL,
       'http://www.paul-arthurrestaurant.fr',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Arthur Vonderheyden' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Arthur Vonderheyden' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Paul-Arthur'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Bruno Aubin' LIMIT 1),
       'Table - Bruno Verjus',
       '3 rue de Prague, Paris, 75012, France',
       'Paris',
       48.8486151,
       2.3759654,
       '',
       NULL,
       'http://www.table.paris',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Bruno Aubin' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Bruno Aubin' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Table - Bruno Verjus'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Charlie Anne' LIMIT 1),
       'Anne de Bretagne',
       'Port de Gravette, La Plaine-sur-Mer, 44770, France',
       'La Plaine-sur-Mer',
       47.1547317,
       -2.2134222,
       '',
       NULL,
       'http://www.annedebretagne.com',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Charlie Anne' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Charlie Anne' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Anne de Bretagne'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Christophe Bibard' LIMIT 1),
       'La Table des Amis by Christophe Bacquié',
       'Les Mas Les Eydins, 2420 chemin du Four, Bonnieux, 84480, France',
       'Bonnieux',
       43.8511871,
       5.3018513,
       '',
       NULL,
       'http://www.leseydins.com',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Christophe Bibard' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Christophe Bibard' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table des Amis by Christophe Bacquié'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Bruneau' LIMIT 1),
       'Clément Artisan Culinaire',
       '6 rue Eugène-Mazélie, Lauzun, 47410, France',
       'Lauzun',
       44.62969,
       0.46069,
       '',
       NULL,
       NULL,
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Bruneau' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Bruneau' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Clément Artisan Culinaire'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Torres' LIMIT 1),
       'Clément Artisan Culinaire',
       '6 rue Eugène-Mazélie, Lauzun, 47410, France',
       'Lauzun',
       44.62969,
       0.46069,
       '',
       NULL,
       NULL,
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Torres' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Torres' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Clément Artisan Culinaire'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Vergeat' LIMIT 1),
       'Clément Artisan Culinaire',
       '6 rue Eugène-Mazélie, Lauzun, 47410, France',
       'Lauzun',
       44.62969,
       0.46069,
       '',
       NULL,
       NULL,
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Vergeat' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Clément Vergeat' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Clément Artisan Culinaire'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Fricaud' LIMIT 1),
       'David Toutain',
       '29 rue Surcouf, Paris, 75007, France',
       'Paris',
       48.8602663,
       2.3097038,
       '',
       NULL,
       'https://www.davidtoutain.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Fricaud' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Fricaud' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('David Toutain'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gallienne' LIMIT 1),
       'David Toutain',
       '29 rue Surcouf, Paris, 75007, France',
       'Paris',
       48.8602663,
       2.3097038,
       '',
       NULL,
       'https://www.davidtoutain.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gallienne' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gallienne' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('David Toutain'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gilabert' LIMIT 1),
       'David Toutain',
       '29 rue Surcouf, Paris, 75007, France',
       'Paris',
       48.8602663,
       2.3097038,
       '',
       NULL,
       'https://www.davidtoutain.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gilabert' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gilabert' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('David Toutain'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gremillet' LIMIT 1),
       'David Toutain',
       '29 rue Surcouf, Paris, 75007, France',
       'Paris',
       48.8602663,
       2.3097038,
       '',
       NULL,
       'https://www.davidtoutain.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gremillet' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'David Gremillet' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('David Toutain'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Elis Bond' LIMIT 1),
       'La Table d''Élise',
       '5 rue Marie-Lemonnier, L''Herbaudière, 85330, France',
       'L''Herbaudière',
       47.0236705,
       -2.298846,
       '',
       NULL,
       'https://www.alexandrecouillon.com/fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Elis Bond' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Elis Bond' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table d''Élise'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ella Aflalo' LIMIT 1),
       'Maison Rosella par Francesco Di Marzio',
       'Château de Germigney, 31 rue Edgar-Faure, Port-Lesney, 39600, France',
       'Port-Lesney',
       46.9990085,
       5.8239441,
       '',
       NULL,
       'http://www.chateaudegermigney.com/fr/restaurant/maison-rosella.html',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ella Aflalo' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ella Aflalo' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Maison Rosella par Francesco Di Marzio'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Émilie Oberlin' LIMIT 1),
       'Émilie & Thomas - Moulin de Cambelong',
       '61 lieu-dit Cambelong, Conques-en-Rouergue, 12320, France',
       'Conques-en-Rouergue',
       44.5926775,
       2.3959849,
       '',
       NULL,
       'http://www.moulindecambelong.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Émilie Oberlin' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Émilie Oberlin' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Émilie & Thomas - Moulin de Cambelong'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Fanny Aimerito' LIMIT 1),
       'L''Auberge de Saint-Rémy - Fanny Rey & Jonathan Wahid',
       '12 boulevard Mirabeau, Saint-Rémy-de-Provence, 13210, France',
       'Saint-Rémy-de-Provence',
       43.7885608,
       4.8333205,
       '',
       NULL,
       'https://www.aubergesaintremy.com/fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Fanny Aimerito' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Fanny Aimerito' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('L''Auberge de Saint-Rémy - Fanny Rey & Jonathan Wahid'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Fanny Rey' LIMIT 1),
       'L''Auberge de Saint-Rémy - Fanny Rey & Jonathan Wahid',
       '12 boulevard Mirabeau, Saint-Rémy-de-Provence, 13210, France',
       'Saint-Rémy-de-Provence',
       43.7885608,
       4.8333205,
       '',
       NULL,
       'https://www.aubergesaintremy.com/fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Fanny Rey' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Fanny Rey' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('L''Auberge de Saint-Rémy - Fanny Rey & Jonathan Wahid'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Morello' LIMIT 1),
       'La Table de Franck Putelat',
       '80 chemin des Anglais, au Sud de la Cité, Carcassonne, 11000, France',
       'Carcassonne',
       43.2013363,
       2.3603104,
       '',
       NULL,
       'https://www.franckputelat.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Morello' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Morello' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table de Franck Putelat'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Pelux' LIMIT 1),
       'La Table de Franck Putelat',
       '80 chemin des Anglais, au Sud de la Cité, Carcassonne, 11000, France',
       'Carcassonne',
       43.2013363,
       2.3603104,
       '',
       NULL,
       'https://www.franckputelat.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Pelux' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Pelux' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table de Franck Putelat'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Radiu' LIMIT 1),
       'La Table de Franck Putelat',
       '80 chemin des Anglais, au Sud de la Cité, Carcassonne, 11000, France',
       'Carcassonne',
       43.2013363,
       2.3603104,
       '',
       NULL,
       'https://www.franckputelat.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Radiu' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Franck Radiu' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table de Franck Putelat'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Gabriel Evin' LIMIT 1),
       'Le Gabriel - La Réserve Paris',
       'La Réserve Paris, 42 avenue Gabriel, Paris, 75008, France',
       'Paris',
       48.8697309,
       2.3132078,
       '',
       NULL,
       'https://www.lareserve-paris.com/',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Gabriel Evin' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Gabriel Evin' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Gabriel - La Réserve Paris'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Guillaume Pape' LIMIT 1),
       'Guillaume Scheer - Les Plaisirs Gourmands',
       '35 route du Général-de-Gaulle, Schiltigheim, 67300, France',
       'Schiltigheim',
       48.6005284,
       7.7392002,
       '',
       NULL,
       'http://www.les-plaisirs-gourmands.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Guillaume Pape' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Guillaume Pape' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Guillaume Scheer - Les Plaisirs Gourmands'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Guillaume Sanchez' LIMIT 1),
       'Guillaume Scheer - Les Plaisirs Gourmands',
       '35 route du Général-de-Gaulle, Schiltigheim, 67300, France',
       'Schiltigheim',
       48.6005284,
       7.7392002,
       '',
       NULL,
       'http://www.les-plaisirs-gourmands.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Guillaume Sanchez' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Guillaume Sanchez' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Guillaume Scheer - Les Plaisirs Gourmands'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Inès Trontin' LIMIT 1),
       'Origines',
       'Rue du Clos-de-la-Chaux, Le Broc, 63500, France',
       'Le Broc',
       45.5014095,
       3.2436174,
       '',
       NULL,
       'http://www.restaurant-origines.fr',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Inès Trontin' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Inès Trontin' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Origines'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jacques Lagarde' LIMIT 1),
       'Le Puits Saint Jacques',
       '57 avenue Victor-Capoul, Pujaudran, 32600, France',
       'Pujaudran',
       43.5907291,
       1.149996,
       '',
       NULL,
       'http://www.lepuitssaintjacques.fr',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jacques Lagarde' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jacques Lagarde' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Puits Saint Jacques'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean Covillault' LIMIT 1),
       'Le Grand Restaurant - Jean-François Piège',
       '7 rue d''Aguesseau, Paris, 75008, France',
       'Paris',
       48.8701983,
       2.3193146,
       '',
       NULL,
       'http://jeanfrancoispiege.com/le-grand-restaurant',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean Covillault' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean Covillault' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Grand Restaurant - Jean-François Piège'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean Imbert' LIMIT 1),
       'Jean Imbert au Plaza Athénée',
       '25 avenue Montaigne, Paris, 75008, France',
       'Paris',
       48.8661718,
       2.3042735,
       '',
       NULL,
       'https://www.dorchestercollection.com/fr/paris/hotel-plaza-athenee/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean Imbert' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean Imbert' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Jean Imbert au Plaza Athénée'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean-François Bury' LIMIT 1),
       'Le Grand Restaurant - Jean-François Piège',
       '7 rue d''Aguesseau, Paris, 75008, France',
       'Paris',
       48.8701983,
       2.3193146,
       '',
       NULL,
       'http://jeanfrancoispiege.com/le-grand-restaurant',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean-François Bury' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jean-François Bury' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Grand Restaurant - Jean-François Piège'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Brun' LIMIT 1),
       'Table - Bruno Verjus',
       '3 rue de Prague, Paris, 75012, France',
       'Paris',
       48.8486151,
       2.3759654,
       '',
       NULL,
       'http://www.table.paris',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Brun' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Brun' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Table - Bruno Verjus'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Moscovici' LIMIT 1),
       'Jérémy Galvan',
       '29 rue du Bœuf, Lyon, 69005, France',
       'Lyon',
       45.7621837,
       4.8264211,
       '',
       NULL,
       'http://www.jeremygalvanrestaurant.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Moscovici' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Moscovici' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Jérémy Galvan'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Vandernoot' LIMIT 1),
       'Jérémy Galvan',
       '29 rue du Bœuf, Lyon, 69005, France',
       'Lyon',
       45.7621837,
       4.8264211,
       '',
       NULL,
       'http://www.jeremygalvanrestaurant.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Vandernoot' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Jérémy Vandernoot' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Jérémy Galvan'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Juan Arbelaez' LIMIT 1),
       'Don Juan II',
       'Port Debilly, Paris, 75016, France',
       'Paris',
       48.8630387,
       2.2959142,
       '',
       NULL,
       'http://www.donjuan2.yachtsdeparis.fr',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Juan Arbelaez' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Juan Arbelaez' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Don Juan II'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Burbaud' LIMIT 1),
       'Restaurant Julien Binz',
       '7 rue des Cigognes, Ammerschwihr, 68770, France',
       'Ammerschwihr',
       48.1256598,
       7.2828846,
       '',
       NULL,
       'http://www.restaurantjulienbinz.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Burbaud' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Burbaud' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Restaurant Julien Binz'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Duboué' LIMIT 1),
       'Restaurant Julien Binz',
       '7 rue des Cigognes, Ammerschwihr, 68770, France',
       'Ammerschwihr',
       48.1256598,
       7.2828846,
       '',
       NULL,
       'http://www.restaurantjulienbinz.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Duboué' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Duboué' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Restaurant Julien Binz'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Hagnery' LIMIT 1),
       'Restaurant Julien Binz',
       '7 rue des Cigognes, Ammerschwihr, 68770, France',
       'Ammerschwihr',
       48.1256598,
       7.2828846,
       '',
       NULL,
       'http://www.restaurantjulienbinz.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Hagnery' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Hagnery' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Restaurant Julien Binz'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Lapraille' LIMIT 1),
       'Restaurant Julien Binz',
       '7 rue des Cigognes, Ammerschwihr, 68770, France',
       'Ammerschwihr',
       48.1256598,
       7.2828846,
       '',
       NULL,
       'http://www.restaurantjulienbinz.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Lapraille' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Lapraille' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Restaurant Julien Binz'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Machet' LIMIT 1),
       'Restaurant Julien Binz',
       '7 rue des Cigognes, Ammerschwihr, 68770, France',
       'Ammerschwihr',
       48.1256598,
       7.2828846,
       '',
       NULL,
       'http://www.restaurantjulienbinz.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Machet' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Machet' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Restaurant Julien Binz'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Wauthier' LIMIT 1),
       'Restaurant Julien Binz',
       '7 rue des Cigognes, Ammerschwihr, 68770, France',
       'Ammerschwihr',
       48.1256598,
       7.2828846,
       '',
       NULL,
       'http://www.restaurantjulienbinz.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Wauthier' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Julien Wauthier' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Restaurant Julien Binz'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Justine Imbert' LIMIT 1),
       'Jean Imbert au Plaza Athénée',
       '25 avenue Montaigne, Paris, 75008, France',
       'Paris',
       48.8661718,
       2.3042735,
       '',
       NULL,
       'https://www.dorchestercollection.com/fr/paris/hotel-plaza-athenee/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Justine Imbert' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Justine Imbert' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Jean Imbert au Plaza Athénée'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Kelly Rangama' LIMIT 1),
       'Le Faham by Kelly Rangama',
       '108 rue Cardinet, Paris, 75017, France',
       'Paris',
       48.8857122,
       2.3117036,
       '',
       NULL,
       'http://www.lefaham.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Kelly Rangama' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Kelly Rangama' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Faham by Kelly Rangama'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Latifa Ichou' LIMIT 1),
       'Le Chabichou by Stéphane Buron',
       '90 rue des Chenus, Courchevel 1850, Courchevel, 73120, France',
       'Courchevel',
       45.41616,
       6.629984,
       '',
       NULL,
       'https://www.chabichou-courchevel.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Latifa Ichou' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Latifa Ichou' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Chabichou by Stéphane Buron'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Léa Vautier Lecointre' LIMIT 1),
       'Ivan Vautier',
       '3 avenue Henry-Chéron, Caen, 14000, France',
       'Caen',
       49.174106,
       -0.3905952,
       '',
       NULL,
       'https://www.ivanvautier.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Léa Vautier Lecointre' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Léa Vautier Lecointre' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Ivan Vautier'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lise Deveix' LIMIT 1),
       'La Grange de Belle-Église',
       '28 boulevard René-Aimé-Lagabrielle, Belle-Église, 60540, France',
       'Belle-Église',
       49.1921304,
       2.2144517,
       '',
       NULL,
       'https://www.lagrangedebelleeglise.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lise Deveix' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lise Deveix' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Grange de Belle-Église'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Louise Bourrat' LIMIT 1),
       'Louise',
       '4 rue Léo-le-Bourgo, Lorient, 56100, France',
       'Lorient',
       47.7487936,
       -3.3650768,
       '',
       NULL,
       'https://www.restaurantlouise.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Louise Bourrat' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Louise Bourrat' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Louise'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Louise Perrone' LIMIT 1),
       'Louise',
       '4 rue Léo-le-Bourgo, Lorient, 56100, France',
       'Lorient',
       47.7487936,
       -3.3650768,
       '',
       NULL,
       'https://www.restaurantlouise.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Louise Perrone' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Louise Perrone' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Louise'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lucas Renault' LIMIT 1),
       'Lucas Carton',
       '9 place de la Madeleine, Paris, 75008, France',
       'Paris',
       48.8697476,
       2.3232442,
       '',
       NULL,
       'https://www.lucascarton.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lucas Renault' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lucas Renault' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Lucas Carton'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lucie Berthier Gembara' LIMIT 1),
       'Le Valucien - Château de Vault-de-Lugny',
       '11 rue du Château, Vault-de-Lugny, 89200, France',
       'Vault-de-Lugny',
       47.4956359,
       3.8548891,
       '',
       NULL,
       'http://www.lugny.fr',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lucie Berthier Gembara' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Lucie Berthier Gembara' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Valucien - Château de Vault-de-Lugny'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Maël Duval' LIMIT 1),
       'Auberge de La Mère Duval',
       'Impasse de la Linerie, Auzouville-sur-Saâne, 76730, France',
       'Auzouville-sur-Saâne',
       49.7410587,
       0.9436443,
       '',
       NULL,
       'https://www.lamereduval.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Maël Duval' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Maël Duval' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Auberge de La Mère Duval'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mallory Gabsi' LIMIT 1),
       'Mallory Gabsi',
       '28 rue des Acacias, Paris, 75017, France',
       'Paris',
       48.876837,
       2.2915873,
       '',
       NULL,
       'http://www.mallory-gabsi.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mallory Gabsi' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mallory Gabsi' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Mallory Gabsi'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Margaux Elie' LIMIT 1),
       'La Sommelière',
       '6 rue Mourguet, Lyon, 69005, France',
       'Lyon',
       45.759793,
       4.8261445,
       '',
       NULL,
       'https://www.la-sommeliere.net/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Margaux Elie' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Margaux Elie' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Sommelière'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Marie Pacotte' LIMIT 1),
       'Rosemarie',
       '149 rue de l''Université, Paris, 75007, France',
       'Paris',
       48.8611264,
       2.3055501,
       '',
       NULL,
       'http://www.rosemariebistrotparis.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Marie Pacotte' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Marie Pacotte' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Rosemarie'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Martin Feragus' LIMIT 1),
       'Le Saint-Martin',
       '2490 avenue des Templiers, Vence, 06140, France',
       'Vence',
       43.7316508,
       7.1066248,
       '',
       NULL,
       'https://www.oetkercollection.com/hotels/chateau-saint-martin/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Martin Feragus' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Martin Feragus' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Saint-Martin'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Martin Volkaerts' LIMIT 1),
       'Le Saint-Martin',
       '2490 avenue des Templiers, Vence, 06140, France',
       'Vence',
       43.7316508,
       7.1066248,
       '',
       NULL,
       'https://www.oetkercollection.com/hotels/chateau-saint-martin/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Martin Volkaerts' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Martin Volkaerts' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Saint-Martin'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mathieu Lagarde' LIMIT 1),
       'La Table de Xavier Mathieu',
       'Route de Murs, Joucas, 84220, France',
       'Joucas',
       43.9289042,
       5.2559385,
       '',
       NULL,
       'https://www.lephebus.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mathieu Lagarde' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mathieu Lagarde' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table de Xavier Mathieu'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mathieu Vande Velde' LIMIT 1),
       'La Table de Xavier Mathieu',
       'Route de Murs, Joucas, 84220, France',
       'Joucas',
       43.9289042,
       5.2559385,
       '',
       NULL,
       'https://www.lephebus.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mathieu Vande Velde' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Mathieu Vande Velde' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table de Xavier Mathieu'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matthias Marc' LIMIT 1),
       'Restaurant Marcon',
       'Larsiallas, Saint-Bonnet-le-Froid, 43290, France',
       'Saint-Bonnet-le-Froid',
       45.1386734,
       4.4342679,
       '',
       NULL,
       'https://www.lesmaisonsmarcon.fr/',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matthias Marc' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matthias Marc' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Restaurant Marcon'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matthieu Lestrade' LIMIT 1),
       'Burgundy by Matthieu',
       '24 quai Saint-Antoine, Lyon, 69002, France',
       'Lyon',
       45.7628677,
       4.8321372,
       '',
       NULL,
       'https://www.burgundybym.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matthieu Lestrade' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Matthieu Lestrade' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Burgundy by Matthieu'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Maxime Zimmer' LIMIT 1),
       'René et Maxime Meilleur',
       'Hameau de Saint-Marcel, Saint-Martin-de-Belleville, 73440, France',
       'Saint-Martin-de-Belleville',
       45.3690463,
       6.5133065,
       '',
       NULL,
       'https://www.la-bouitte.com/fr/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Maxime Zimmer' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Maxime Zimmer' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('René et Maxime Meilleur'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Pourcheresse' LIMIT 1),
       'Nicolas Carro - Hôtel de Carantec',
       '20 rue du Kelenn, Carantec, 29660, France',
       'Carantec',
       48.6706639,
       -3.9127356,
       '',
       NULL,
       'https://www.hotel-carantec.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Pourcheresse' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Pourcheresse' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Nicolas Carro - Hôtel de Carantec'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Seibold' LIMIT 1),
       'Nicolas Carro - Hôtel de Carantec',
       '20 rue du Kelenn, Carantec, 29660, France',
       'Carantec',
       48.6706639,
       -3.9127356,
       '',
       NULL,
       'https://www.hotel-carantec.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Seibold' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Nicolas Seibold' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Nicolas Carro - Hôtel de Carantec'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Olivier Streiff' LIMIT 1),
       'La Table d''Olivier Nasti',
       '9-13 rue du Général-de-Gaulle, Kaysersberg, 68240, France',
       'Kaysersberg',
       48.1386233,
       7.265581,
       '',
       NULL,
       'https://www.lechambard.fr/fr/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Olivier Streiff' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Olivier Streiff' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Table d''Olivier Nasti'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Paul Delrez' LIMIT 1),
       'Paul Bocuse',
       '40 quai de la Plage, Collonges-au-Mont-d''Or, 69660, France',
       'Collonges-au-Mont-d''Or',
       45.8156437,
       4.8475623,
       '',
       NULL,
       'http://www.bocuse.fr',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Paul Delrez' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Paul Delrez' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Paul Bocuse'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Paul-Arthur Berlan' LIMIT 1),
       'Paul-Arthur',
       '23-25 place de la Pucelle, Rouen, 76000, France',
       'Rouen',
       49.4423399,
       1.0884942,
       '',
       NULL,
       'http://www.paul-arthurrestaurant.fr',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Paul-Arthur Berlan' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Paul-Arthur Berlan' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Paul-Arthur'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Chomet' LIMIT 1),
       'Pierre Gagnaire',
       '6 rue Balzac, Paris, 75008, France',
       'Paris',
       48.8732506,
       2.3003862,
       '',
       NULL,
       'http://pierregagnaire-lerestaurant.com',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Chomet' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Chomet' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Pierre Gagnaire'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Ciampi' LIMIT 1),
       'Pierre Gagnaire',
       '6 rue Balzac, Paris, 75008, France',
       'Paris',
       48.8732506,
       2.3003862,
       '',
       NULL,
       'http://pierregagnaire-lerestaurant.com',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Ciampi' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Ciampi' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Pierre Gagnaire'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Meneau' LIMIT 1),
       'Pierre Gagnaire',
       '6 rue Balzac, Paris, 75008, France',
       'Paris',
       48.8732506,
       2.3003862,
       '',
       NULL,
       'http://pierregagnaire-lerestaurant.com',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Meneau' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Meneau' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Pierre Gagnaire'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Reure' LIMIT 1),
       'Pierre Gagnaire',
       '6 rue Balzac, Paris, 75008, France',
       'Paris',
       48.8732506,
       2.3003862,
       '',
       NULL,
       'http://pierregagnaire-lerestaurant.com',
       3,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Reure' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre Reure' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Pierre Gagnaire'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre-Pascal Clément' LIMIT 1),
       'Clément Artisan Culinaire',
       '6 rue Eugène-Mazélie, Lauzun, 47410, France',
       'Lauzun',
       44.62969,
       0.46069,
       '',
       NULL,
       NULL,
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre-Pascal Clément' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pierre-Pascal Clément' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Clément Artisan Culinaire'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pol-Henri Dieu' LIMIT 1),
       'Le Bistrot de Villedieu',
       '21 place de la Libération, Villedieu, 84110, France',
       'Villedieu',
       44.2840228,
       5.0342051,
       '',
       NULL,
       'http://www.azoulay-gastronomie.com/le-bistrot-de-villedieu',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pol-Henri Dieu' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Pol-Henri Dieu' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Bistrot de Villedieu'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Rémi Blanpoil' LIMIT 1),
       'La Cour de Rémi',
       '1 rue Baillet, Bermicourt, 62130, France',
       'Bermicourt',
       50.4062836,
       2.2291703,
       '',
       NULL,
       'http://www.lacourderemi.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Rémi Blanpoil' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Rémi Blanpoil' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Cour de Rémi'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ronan Kernen' LIMIT 1),
       'Maison Ronan Kervarrec',
       '1 impasse du Vieux-Bourg, Saint-Grégoire, 35760, France',
       'Saint-Grégoire',
       48.1533015,
       -1.6805561,
       '',
       NULL,
       'http://www.le-saison.com/fr',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ronan Kernen' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Ronan Kernen' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Maison Ronan Kervarrec'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Samuel Albert' LIMIT 1),
       'Albert 1er',
       'Hameau Albert-1er, 38 route du Bouchet, Chamonix-Mont-Blanc, 74400, France',
       'Chamonix-Mont-Blanc',
       45.9249264,
       6.8739886,
       '',
       NULL,
       'https://www.hameaualbert.fr',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Samuel Albert' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Samuel Albert' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Albert 1er'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sarah Gade' LIMIT 1),
       'Brigade du Tigre',
       '38 rue du Faubourg-Poissonnière, Paris, 75010, France',
       'Paris',
       48.8734837,
       2.3479318,
       '',
       NULL,
       'https://www.brigadedutigre.fr/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sarah Gade' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Sarah Gade' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Brigade du Tigre'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Théo Chassé' LIMIT 1),
       'Au Lion d''Or - Chez Théo',
       '5 rue Village-Neuf, Rosenau, 68128, France',
       'Rosenau',
       47.6365191,
       7.5355895,
       '',
       NULL,
       'https://www.auliondor-rosenau.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Théo Chassé' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Théo Chassé' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Au Lion d''Or - Chez Théo'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Chisholm' LIMIT 1),
       'Émilie & Thomas - Moulin de Cambelong',
       '61 lieu-dit Cambelong, Conques-en-Rouergue, 12320, France',
       'Conques-en-Rouergue',
       44.5926775,
       2.3959849,
       '',
       NULL,
       'http://www.moulindecambelong.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Chisholm' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Chisholm' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Émilie & Thomas - Moulin de Cambelong'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Letourneur' LIMIT 1),
       'Émilie & Thomas - Moulin de Cambelong',
       '61 lieu-dit Cambelong, Conques-en-Rouergue, 12320, France',
       'Conques-en-Rouergue',
       44.5926775,
       2.3959849,
       '',
       NULL,
       'http://www.moulindecambelong.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Letourneur' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Letourneur' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Émilie & Thomas - Moulin de Cambelong'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Murer' LIMIT 1),
       'Émilie & Thomas - Moulin de Cambelong',
       '61 lieu-dit Cambelong, Conques-en-Rouergue, 12320, France',
       'Conques-en-Rouergue',
       44.5926775,
       2.3959849,
       '',
       NULL,
       'http://www.moulindecambelong.com',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Murer' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Thomas Murer' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Émilie & Thomas - Moulin de Cambelong'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Blanchet' LIMIT 1),
       'La Ferme de Victorine',
       '141 route du Plan-Dessert, Notre-Dame-de-Bellecombe, 73590, France',
       'Notre-Dame-de-Bellecombe',
       45.8054077,
       6.5512822,
       '',
       NULL,
       'https://la-ferme-de-victorine.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Blanchet' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Blanchet' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Ferme de Victorine'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Mercier' LIMIT 1),
       'La Ferme de Victorine',
       '141 route du Plan-Dessert, Notre-Dame-de-Bellecombe, 73590, France',
       'Notre-Dame-de-Bellecombe',
       45.8054077,
       6.5512822,
       '',
       NULL,
       'https://la-ferme-de-victorine.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Mercier' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Victor Mercier' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('La Ferme de Victorine'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vincent Crepel' LIMIT 1),
       'Vincent Favre Félix',
       '15 chemin de l''Abbaye - à Annecy-le-Vieux, Annecy, 74940, France',
       'Annecy',
       45.9177189,
       6.1416315,
       '',
       NULL,
       'https://www.restaurant-vff.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vincent Crepel' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vincent Crepel' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Vincent Favre Félix'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vincent Gomis' LIMIT 1),
       'Vincent Favre Félix',
       '15 chemin de l''Abbaye - à Annecy-le-Vieux, Annecy, 74940, France',
       'Annecy',
       45.9177189,
       6.1416315,
       '',
       NULL,
       'https://www.restaurant-vff.com/',
       1,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vincent Gomis' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Vincent Gomis' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Vincent Favre Félix'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Xavier Koenig' LIMIT 1),
       'Le Pré - Xavier Beaudiment',
       'Route de la Baraque, Clermont-Ferrand, 63000, France',
       'Clermont-Ferrand',
       45.7886787,
       3.0519431,
       '',
       NULL,
       'https://www.restaurant-lepre.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Xavier Koenig' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Xavier Koenig' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Pré - Xavier Beaudiment'))
  );
INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Xavier Pincemin' LIMIT 1),
       'Le Pré - Xavier Beaudiment',
       'Route de la Baraque, Clermont-Ferrand, 63000, France',
       'Clermont-Ferrand',
       45.7886787,
       3.0519431,
       '',
       NULL,
       'https://www.restaurant-lepre.com/',
       2,
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Xavier Pincemin' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = 'Xavier Pincemin' LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM('Le Pré - Xavier Beaudiment'))
  );
