/**
 * Lit data/france_complete_2024.csv (source : projet GitHub pineapple-bois/Michelin_Rated_Restaurants,
 * fichier Years/2024/data/France/france_complete_2024.csv — données Guide Michelin France 2024).
 *
 * Génère :
 *   - data/etablissements-demo-seed.sql (chefs + etablissements, coordonnées obligatoires)
 *   - src/data/sampleRestaurants.ts (fallback client sans API)
 *
 * Usage : node scripts/build-etablissements-from-csv.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const csvPath = join(root, "data", "france_complete_2024.csv");

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQ = !inQ;
      continue;
    }
    if (!inQ && c === ",") {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

/** Heuristique : nom du chef à afficher (CSV sans colonne chef). */
function chefFromRestaurantName(name) {
  const n = name.trim();
  const par = n.match(/\bpar\s+(.+)$/i);
  if (par) return par[1].trim().replace(/\s*[-–—].*$/, "").trim();
  const by = n.match(/\bby\s+(.+)$/i);
  if (by) return by[1].trim().replace(/\s*[-–—].*$/, "").trim();
  const parts = n.split(/\s-\s/).map((p) => p.trim());
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    if (
      last.length > 0 &&
      last.length <= 42 &&
      /^[A-ZÀÂÄÉÈÊËÎÏÔÙÛÜŸa-zàâäéèêëîïôùûüÿç .'-]+$/.test(last) &&
      !/^(Le|La|Les|Cheval|L'|Chez)\s/i.test(last)
    ) {
      return last;
    }
    return parts[0].replace(/^L'|^La\s|^Les\s/i, "").trim() || parts[0];
  }
  return n;
}

function sqlStr(s) {
  return `'${String(s ?? "").replace(/'/g, "''")}'`;
}

const raw = readFileSync(csvPath, "utf8");
const lines = raw.split(/\r?\n/).filter(Boolean);
const header = lines[0].toLowerCase();
if (!header.includes("name") || !header.includes("latitude")) {
  console.error("CSV inattendu : en-tête", header);
  process.exit(1);
}

const rows = [];
for (let i = 1; i < lines.length; i++) {
  const cols = parseCsvLine(lines[i]);
  if (cols.length < 11) continue;
  const [
    name,
    address,
    location,
    ,
    ,
    ,
    url,
    ,
    starsStr,
    lonStr,
    latStr,
  ] = cols;
  const lat = parseFloat(latStr);
  const lng = parseFloat(lonStr);
  const stars = Math.min(3, Math.max(0, Math.round(parseFloat(starsStr) || 0)));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
  if (!name?.trim()) continue;
  rows.push({
    nom_restaurant: name.trim(),
    chef_nom: chefFromRestaurantName(name),
    ville: (location || "").trim() || "France",
    adresse: (address || "").trim() || null,
    lat,
    lng,
    etoiles: stars,
    site_web: (url || "").trim() || null,
  });
}

/** Clé stable pour dédoublonner les chefs (accent-insensible simplifié). */
function chefKey(n) {
  return n
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

const chefIdByKey = new Map();
const chefs = [];
for (const r of rows) {
  const k = chefKey(r.chef_nom);
  if (!k) continue;
  if (!chefIdByKey.has(k)) {
    chefIdByKey.set(k, chefs.length + 1);
    chefs.push({ id: chefs.length + 1, nom: r.chef_nom });
  }
}

const sqlParts = [];
sqlParts.push(`-- Généré par scripts/build-etablissements-from-csv.mjs (${rows.length} établissements).
-- Source CSV : data/france_complete_2024.csv (Michelin France 2024, voir data/README-michelin-csv.md).
-- Appliquez schema.sql puis data/topchef-candidats-seed.sql avant import.
-- Ensuite (Top Chef + restaurants liés) : npm run db:seed:topchef-restaurants
--
--   npx wrangler d1 execute chefs_db --remote --file=./data/etablissements-demo-seed.sql
--
PRAGMA foreign_keys = OFF;
DELETE FROM etablissements;
DELETE FROM chefs;
DELETE FROM sqlite_sequence WHERE name IN ('etablissements', 'chefs');
PRAGMA foreign_keys = ON;
`);

const CHUNK = 35;

function pushChunkedInserts(tableName, columns, valueRows) {
  for (let i = 0; i < valueRows.length; i += CHUNK) {
    const slice = valueRows.slice(i, i + CHUNK);
    sqlParts.push(`INSERT INTO ${tableName} (${columns}) VALUES
${slice.join(",\n")};`);
  }
}

const chefValues = chefs.map(
  (c) =>
    `  (${c.id}, ${sqlStr(c.nom)}, NULL, NULL, NULL)`
);
pushChunkedInserts(
  "chefs",
  "id, nom, top_chef_saison, top_chef_rang, parcours_resume",
  chefValues
);

const etabValues = rows.map((r, idx) => {
  const cid = chefIdByKey.get(chefKey(r.chef_nom));
  const id = idx + 1;
  const tel = "";
  const site = r.site_web ? sqlStr(r.site_web) : "NULL";
  const adr = r.adresse ? sqlStr(r.adresse) : "NULL";
  return `  (${id}, ${cid}, ${sqlStr(r.nom_restaurant)}, ${r.etoiles}, ${adr}, ${sqlStr(r.ville)}, ${r.lat}, ${r.lng}, ${sqlStr(tel)}, NULL, ${site})`;
});

pushChunkedInserts(
  "etablissements",
  "id, chef_id, nom_restaurant, etoiles_michelin, adresse, ville, latitude, longitude, telephone, email, site_web",
  etabValues
);

writeFileSync(join(root, "data", "etablissements-demo-seed.sql"), sqlParts.join("\n\n"), "utf8");

const tsLines = rows.map((r, idx) => {
  const id = idx + 1;
  const top =
    /mory|coline|mazzia|blondet|kanzaki|di giacomo|virtus|mosuke|doublet|amaryllis/i.test(
      r.nom_restaurant + r.chef_nom
    );
  return `  {
    id: ${id},
    nom_restaurant: ${JSON.stringify(r.nom_restaurant)},
    chef_nom: ${JSON.stringify(r.chef_nom)},
    ville: ${JSON.stringify(r.ville)},
    restaurant_adresse: ${JSON.stringify(r.adresse ?? "")},
    etoiles_michelin: ${r.etoiles},
    top_chef: ${top},
    latitude: ${r.lat},
    longitude: ${r.lng},
    telephone: ""
  }`;
});

const tsOut = `import type { Restaurant } from "@/types/restaurant";

/**
 * Données de démonstration (alignées sur data/etablissements-demo-seed.sql).
 * Généré par scripts/build-etablissements-from-csv.mjs — ne pas éditer à la main.
 */
export const sampleRestaurants: Restaurant[] = [
${tsLines.join(",\n")},
];
`;

writeFileSync(join(root, "src", "data", "sampleRestaurants.ts"), tsOut, "utf8");

console.log(
  `OK : ${rows.length} établissements, ${chefs.length} chefs uniques → data/etablissements-demo-seed.sql + src/data/sampleRestaurants.ts`
);
