/**
 * Génère src/data/topChefCatalog.ts à partir des listes par saison.
 * Source des noms : https://topchef.fandom.com/fr/wiki/Liste_des_candidats_de_Top_Chef_par_saison (CC-BY-SA)
 * Exécution : node scripts/build-topchef-catalog.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Index 0 = saison 1 */
const PAR_SAISON = [
  [
    "Pierre Augé",
    "Anaïs Catherine",
    "Grégory Cuilleron",
    "Benjamin Darnaud",
    "Alexandre Dionisio",
    "David Fricaud",
    "Benjamin Kalifa",
    "Flora Lamoure",
    "Brice Morvent",
    "Renaud Ramamourty",
    "Yoaké San",
    "Romain Tischenko",
  ],
  [
    "Paul-Arthur Berlan",
    "Christophe Bibard",
    "Pierre Sang Boyer",
    "Alexis Braconnier",
    "Adrien Clauwaert",
    "Abraham de la Rosa",
    "Grégory Delobe",
    "Tiffany Depardieu",
    "David Gilabert",
    "Ronan Kernen",
    "Stéphanie Le Quellec",
    "Matthieu Lestrade",
    "Fanny Rey",
    "Ludovic Turac",
  ],
  [
    "Juan Arbelaez",
    "Tabata Bonardi",
    "Julien Burbaud",
    "Carl Gillain",
    "Gérald Guille",
    "Noëmie Honiat",
    "Jean Imbert",
    "Denny Imbroisi",
    "Mehdi Kebboul",
    "Amélie Langlais",
    "Florent Pietravalle",
    "Ruben Sarfati",
    "Norbert Tarayre",
    "Cyrille Zen",
  ],
  [
    "Joris Bijdendijk",
    "Quentin Bourdy",
    "Aurélien Coutaudier",
    "Naoëlle d'Hainaut",
    "Adrien Demametz",
    "Étienne Geney",
    "Vincent Gomis",
    "Julien Hagnery",
    "Latifa Ichou",
    "Florent Ladeyn",
    "Virginie Martinetti",
    "Fabien Morreale",
    "Valentin Néraudeau",
    "Émilie Oberlin",
    "Yoni Saada",
    "Jean-Philippe Watteyne",
  ],
  [
    "Pierre Augé",
    "Quentin Bourdy",
    "Alexis Braconnier",
    "Jérémy Brun",
    "Anne-Cécile Degenne",
    "Tiffany Depardieu",
    "Julien Duboué",
    "Étienne Geney",
    "Julien Hagnery",
    "Noëmie Honiat",
    "Jean-Edern Hurstel",
    "Latifa Ichou",
    "Julien Lapraille",
    "Dieuveil Malonga",
    "Marjorie Maltais",
    "Steven Ramon",
    "Yoaké San",
    "Ruben Sarfati",
    "Mohamed Si Abdelkader",
    "Thibault Sombardier",
    "Jennifer Taïeb",
    "Jordan Vignal",
  ],
  [
    "Fatimata Amadou",
    "Jean-Baptiste Ascione",
    "Harmony Brioude",
    "Florian Chatelard",
    "Pierre Ciampi",
    "Adel Dakkar",
    "Kévin d'Andréa",
    "Xavier Koenig",
    "Julien Machet",
    "Jérémy Moscovici",
    "Christophe Pirotais",
    "Nicolas Pourcheresse",
    "Vanessa Robuschi",
    "Olivier Streiff",
    "Martin Volkaerts",
  ],
  [
    "Clément Bruneau",
    "Pierre Eon",
    "Gabriel Evin",
    "Coline Faulquier",
    "Sarah Gade",
    "Charles Gantois",
    "Wilfried Graux",
    "Pierre Meneau",
    "Alexandre Moormann",
    "Thomas Murer",
    "Xavier Pincemin",
    "Joy-Astrid Poinsot",
    "Franck Radiu",
    "Kevin Roquet",
    "Nicolas Seibold",
    "Clément Torres",
  ],
  [
    "Jean-François Bury",
    "Alexis Delassaux",
    "Maximilien Dienst",
    "Carl Dutting",
    "David Gremillet",
    "Jérémie Izarn",
    "Marion Lefebvre",
    "Thomas Letourneur",
    "Franck Pelux",
    "Kelly Rangama",
    "Mickaël Riss",
    "Guillaume Sanchez",
    "Alexandre Spinelli",
    "Giacinta Trivero",
    "Julien Wauthier",
  ],
  [
    "Ella Aflalo",
    "Thibault Barbafieri",
    "Vincent Crepel",
    "Geoffrey Degros",
    "Camille Delcroix",
    "Adrien Descouls",
    "Thibaud Erard-Penguilly",
    "Mathew Hegarty",
    "Justine Imbert",
    "Tara Khattar",
    "Franckelie Laloum",
    "Victor Mercier",
    "Franck Morello",
    "Jérémy Vandernoot",
    "Clément Vergeat",
  ],
  [
    "Fanny Aimerito",
    "Samuel Albert",
    "Florian Barbarot",
    "Anissa Boulesteix",
    "Merouan Bounekraf",
    "Paul Delrez",
    "Alexia Duchêne",
    "Maël Duval",
    "Ibrahim Kharbach",
    "Damien Laforce",
    "Marie-Victorine Manoa",
    "Camille Maury",
    "Sébastien Oger",
    "Guillaume Pape",
    "Baptiste Renouard",
  ],
  [
    "Diego Alary",
    "Jean-Philippe Berens",
    "Pauline Berghonnier",
    "Adrien Cachot",
    "Martin Feragus",
    "Mallory Gabsi",
    "David Gallienne",
    "Gianmarco Gorni",
    "Gratien Leroy",
    "Nastasia Lyard",
    "Justine Piluso",
    "Mory Sacko",
    "Arthur Vonderheyden",
    "Jordan Yuste",
    "Maxime Zimmer",
  ],
  [
    "Bruno Aubin",
    "Arnaud Baptiste",
    "Chloé Charles",
    "Mohamed Cheikh",
    "Thomas Chisholm",
    "Pierre Chomet",
    "Yohei Hosaka",
    "Sarah Mainguy",
    "Matthias Marc",
    "Jarvis Scott",
    "Pauline Séné",
    "Charline Stengel",
    "Baptiste Trudel",
    "Mathieu Vande Velde",
    "Adrien Zedda",
  ],
  [
    "Pascal Barandoni",
    "Lucie Berthier Gembara",
    "Elis Bond",
    "Louise Bourrat",
    "Mickaël Braure",
    "Tania Cadeddu",
    "Arnaud Delvenne",
    "Logan Depuydt",
    "Lilian Douchet",
    "Renaud Ramamourty",
    "Sébastien Renard",
    "Wilfried Romain",
    "Thibaut Spiwack",
    "Elliott Van de Velde",
    "Ambroise Voreux",
  ],
  [
    "Albane Auvray",
    "Victor Blanchet",
    "Jean Covillault",
    "Bérangère Fagart",
    "Jérémie Falissard",
    "Carla Ferrari",
    "Miguel Garcia-Herrera",
    "Danny Khezzar",
    "Jacques Lagarde",
    "Mathieu Lagarde",
    "César Lewandowski",
    "Alexandre Marchon",
    "Léo Renusson",
    "Hugo Riboulet",
    "Gaston Savina",
    "Sarika Sor",
  ],
  [
    "Pierre-Pascal Clément",
    "Bryan Debouche",
    "Lise Deveix",
    "Pol-Henri Dieu",
    "Jorick Dorignac",
    "Shirley Duthilleux",
    "Pavel Hug",
    "Anicée Lacrouts",
    "Thibault Marchand",
    "Quentin Maufrais",
    "Arnaud Munster",
    "Marie Pacotte",
    "Clotaire Poirier",
    "Valentin Raffali",
    "Pierre Reure",
    "Inès Trontin",
  ],
  [
    "Charlie Anne",
    "Rémi Blanpoil",
    "Noémie Cadré",
    "Margaux Elie",
    "Kilian Franceschi",
    "Sean Gabbiani",
    "Philippine Jaillet",
    "Quentin Mauro",
    "Charles Neyers",
    "Noé Pellet",
    "Claudio Semedo Borges",
    "Esteban Salazar",
    "Steven Thiebault-Pellegrino",
    "Ilane Tinchant",
    "Grégoire Touchard",
  ],
  [
    "Alexy Algar-Denos",
    "Aboubakar Bamba",
    "Sacha Boyadjian",
    "Dylan Bury",
    "Théo Chassé",
    "Antoine Garcia",
    "Alexia Jolivet",
    "Victor Kuntz",
    "Tom Paduano",
    "Nicolas Parage",
    "Maël Paranthoen",
    "Louise Perrone",
    "Matteo Pioppi",
    "Viviana Pisacane",
    "Lucas Renault",
    "Léa Vautier Lecointre",
  ],
];

const byNom = new Map();
for (let i = 0; i < PAR_SAISON.length; i++) {
  const saison = i + 1;
  for (const nom of PAR_SAISON[i]) {
    if (!byNom.has(nom)) byNom.set(nom, []);
    byNom.get(nom).push(saison);
  }
}

const merged = [...byNom.entries()]
  .map(([nom, saisons]) => ({
    nom,
    saisons: [...new Set(saisons)].sort((a, b) => a - b),
  }))
  .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

const bySaison = {};
for (let s = 1; s <= PAR_SAISON.length; s++) {
  bySaison[s] = PAR_SAISON[s - 1];
}

const header = `/**
 * Catalogue des candidats Top Chef (France) par saison — noms uniquement.
 * Généré par scripts/build-topchef-catalog.mjs — ne pas éditer à la main.
 *
 * Source des listes : https://topchef.fandom.com/fr/wiki/Liste_des_candidats_de_Top_Chef_par_saison
 * (saisons 1–17 ; saison 17 : https://topchef.fandom.com/fr/wiki/Saison_17_de_Top_Chef )
 * Contenu sous licence CC-BY-SA (communauté Fandom).
 *
 * Aucune donnée personnelle de contact ici. Téléphone et e-mail des restaurants
 * se renseignent au niveau des fiches établissement (table top_chef_restaurants ou équivalent).
 */
`;

const body = `export const TOP_CHEF_BY_SAISON = ${JSON.stringify(bySaison, null, 2)} as const;

export type TopChefSaison = keyof typeof TOP_CHEF_BY_SAISON;

/** Candidats uniques avec toutes leurs saisons (ex. Pierre Augé : 1 et 5). */
export const TOP_CHEF_CANDIDATS_MERGED: { nom: string; saisons: number[] }[] = ${JSON.stringify(merged, null, 2)};

export const TOP_CHEF_NOMBRE_SAISONS = ${PAR_SAISON.length};

export const TOP_CHEF_NOMBRE_CANDIDATS_UNIQUES = ${merged.length};
`;

const root = join(__dirname, "..");
const tsPath = join(root, "src", "data", "topChefCatalog.ts");
writeFileSync(tsPath, header + "\n" + body, "utf8");
console.log("Écrit", tsPath, merged.length, "candidats uniques.");

const esc = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const sqlLines = [
  "-- Seed top_chef_candidats (noms + saisons). Généré par scripts/build-topchef-catalog.mjs",
  "-- (pas de BEGIN/COMMIT : D1 `wrangler d1 execute --remote --file` ne les accepte pas.)",
];
for (const row of merged) {
  sqlLines.push(
    `INSERT OR IGNORE INTO top_chef_candidats (nom_complet, saisons_json) VALUES (${esc(row.nom)}, ${esc(JSON.stringify(row.saisons))});`
  );
}
const sqlDir = join(root, "data");
mkdirSync(sqlDir, { recursive: true });
const sqlPath = join(sqlDir, "topchef-candidats-seed.sql");
writeFileSync(sqlPath, sqlLines.join("\n") + "\n", "utf8");
console.log("Écrit", sqlPath, merged.length, "INSERT.");

const nomsPath = join(sqlDir, "topchef-noms.json");
writeFileSync(nomsPath, JSON.stringify(merged, null, 2), "utf8");
console.log("Écrit", nomsPath);
