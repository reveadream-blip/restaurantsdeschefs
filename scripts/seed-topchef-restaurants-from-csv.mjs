/**
 * Propose des INSERT dans top_chef_restaurants en rapprochant chaque candidat
 * (data/topchef-noms.json) d’une ligne du CSV Michelin France (data/france_complete_2024.csv).
 *
 *   node scripts/seed-topchef-restaurants-from-csv.mjs > data/topchef-restaurants-from-csv.sql
 *   npx wrangler d1 execute chefs_db --remote --file=./data/topchef-restaurants-from-csv.sql
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

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

function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sqlStr(s) {
  return `'${String(s ?? "").replace(/'/g, "''")}'`;
}

function scoreMatch(candidatNom, restName) {
  const cn = norm(candidatNom);
  const rn = norm(restName);
  if (!cn || !rn) return 0;
  if (rn.includes(cn)) return 100;
  const par = restName.match(/\bpar\s+(.+)$/i);
  if (par) {
    const p = norm(par[1]);
    if (p.includes(cn) || cn.includes(p)) return 92;
  }
  const parts = candidatNom.trim().split(/\s+/).filter(Boolean);
  const toks = parts.map((p) => norm(p)).filter((t) => t.length >= 4);
  let ok = 0;
  for (const t of toks) {
    if (rn.includes(t)) ok++;
  }
  if (toks.length >= 2 && ok >= 2) return 78 + ok * 3;
  if (toks.length >= 2 && ok === 1) return 56;
  if (parts.length >= 2) {
    const last = norm(parts[parts.length - 1]);
    const first = norm(parts[0]);
    if (last.length >= 4 && rn.includes(last)) {
      if (first.length >= 3 && rn.includes(first)) return 75;
      return 62;
    }
  }
  if (parts.length === 1 && parts[0].length >= 5) {
    const t = norm(parts[0]);
    if (rn.includes(t)) return 55;
  }
  return 0;
}

const csvRaw = readFileSync(join(root, "data", "france_complete_2024.csv"), "utf8");
const lines = csvRaw.split(/\r?\n/).filter(Boolean);
const csvRows = [];
for (let i = 1; i < lines.length; i++) {
  const cols = parseCsvLine(lines[i]);
  if (cols.length < 11) continue;
  const [name, address, location, , , , url, , starsStr, lonStr, latStr] = cols;
  const lat = parseFloat(latStr);
  const lng = parseFloat(lonStr);
  const stars = Math.min(3, Math.max(0, Math.round(parseFloat(starsStr) || 0)));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !name?.trim()) continue;
  csvRows.push({
    name: name.trim(),
    address: (address || "").trim(),
    ville: (location || "").trim(),
    lat,
    lng,
    stars,
    url: (url || "").trim(),
  });
}

const noms = JSON.parse(
  readFileSync(join(root, "data", "topchef-noms.json"), "utf8")
);

const MIN_SCORE = 52;
const inserts = [];

/** Candidats pour lesquels le fichier manuel remplace toute proposition CSV (évite faux positifs). */
const manualNomSet = new Set();

function pushRestaurantInsert(
  candidatNom,
  restName,
  address,
  ville,
  lat,
  lng,
  stars,
  url
) {
  const tel = "";
  const site = url && String(url).trim() ? sqlStr(String(url).trim()) : "NULL";
  const adr = address && String(address).trim() ? sqlStr(String(address).trim()) : "NULL";
  inserts.push(`INSERT INTO top_chef_restaurants (candidat_id, nom_restaurant, adresse, ville, latitude, longitude, telephone, email, site_web, etoiles_michelin, est_actif)
SELECT (SELECT id FROM top_chef_candidats WHERE nom_complet = ${sqlStr(candidatNom)} LIMIT 1),
       ${sqlStr(restName)},
       ${adr},
       ${sqlStr(ville)},
       ${lat},
       ${lng},
       ${sqlStr(tel)},
       NULL,
       ${site},
       ${stars},
       1
WHERE (SELECT id FROM top_chef_candidats WHERE nom_complet = ${sqlStr(candidatNom)} LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM top_chef_restaurants r
    WHERE r.candidat_id = (SELECT id FROM top_chef_candidats WHERE nom_complet = ${sqlStr(candidatNom)} LIMIT 1)
      AND LOWER(TRIM(r.nom_restaurant)) = LOWER(TRIM(${sqlStr(restName)}))
  );`);
}

const manualPath = join(root, "data", "topchef-restaurants-manual.json");
if (existsSync(manualPath)) {
  const manual = JSON.parse(readFileSync(manualPath, "utf8"));
  if (Array.isArray(manual)) {
    for (const m of manual) {
      const nom = m.nom;
      const nr = m.nom_restaurant;
      const lat = Number(m.latitude);
      const lng = Number(m.longitude);
      const stars = Math.min(3, Math.max(0, Math.round(Number(m.etoiles_michelin ?? 0))));
      if (!nom || !nr || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const candidatNom = String(nom).trim();
      manualNomSet.add(candidatNom);
      pushRestaurantInsert(
        candidatNom,
        String(nr).trim(),
        m.adresse != null ? String(m.adresse) : "",
        m.ville != null ? String(m.ville) : "",
        lat,
        lng,
        stars,
        m.site_web != null ? String(m.site_web) : ""
      );
    }
  }
}

for (const { nom: candidatNom } of noms) {
  if (manualNomSet.has(candidatNom)) continue;
  let best = null;
  let bestScore = 0;
  for (const row of csvRows) {
    const sc = scoreMatch(candidatNom, row.name);
    if (sc > bestScore) {
      bestScore = sc;
      best = row;
    }
  }
  if (!best || bestScore < MIN_SCORE) continue;

  pushRestaurantInsert(
    candidatNom,
    best.name,
    best.address,
    best.ville,
    best.lat,
    best.lng,
    best.stars,
    best.url
  );
}

const header = `-- Généré par scripts/seed-topchef-restaurants-from-csv.mjs (${inserts.length} requêtes INSERT).
-- Associe candidats Top Chef (topchef-noms.json) au CSV Michelin France + data/topchef-restaurants-manual.json.
-- Les entrées manuelles sont appliquées en premier et remplacent le matching CSV pour le même candidat.
-- Prérequis : topchef-candidats-seed.sql déjà appliqué sur D1.
--   npx wrangler d1 execute chefs_db --remote --file=./data/topchef-restaurants-from-csv.sql
`;

const outPath = join(root, "data", "topchef-restaurants-from-csv.sql");
writeFileSync(outPath, `${header}\n${inserts.join("\n")}\n`, "utf8");
console.log(`Écrit ${outPath} (${inserts.length} insertions candidates)`);
