/**
 * Recense tous les candidats Top Chef (topchef-noms.json) et leurs établissements
 * détectés : matching CSV (même logique que seed-topchef-restaurants-from-csv.mjs) +
 * data/topchef-restaurants-manual.json.
 *
 *   node scripts/census-topchef-etablissements.mjs
 *
 * Sortie : data/topchef-candidats-etablissements.json
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const MIN_SCORE = 52;

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

/** Toutes les lignes CSV avec score >= seuil, tri décroissant (aperçu multi-tables). */
function csvMatchesFor(candidatNom, seuil = 40) {
  const hits = [];
  for (const row of csvRows) {
    const sc = scoreMatch(candidatNom, row.name);
    if (sc >= seuil) hits.push({ score: sc, ...row });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits;
}

const manualPath = join(root, "data", "topchef-restaurants-manual.json");
const manualByNom = new Map();
if (existsSync(manualPath)) {
  const manual = JSON.parse(readFileSync(manualPath, "utf8"));
  if (Array.isArray(manual)) {
    for (const m of manual) {
      if (m?.nom) manualByNom.set(String(m.nom).trim(), m);
    }
  }
}

const candidats = [];
let avec = 0;
let sans = 0;

for (const row of noms) {
  const nom = row.nom;
  const saisons = row.saisons ?? [];
  const hits = csvMatchesFor(nom, 40);
  const best = hits[0] ?? null;
  const csvRetenu =
    best && best.score >= MIN_SCORE
      ? {
          source: "csv_michelin",
          score: best.score,
          nom_restaurant: best.name,
          ville: best.ville,
          adresse: best.address,
          latitude: best.lat,
          longitude: best.lng,
          etoiles_michelin: best.stars,
          url: best.url || null,
        }
      : null;

  const manuel = manualByNom.get(nom) ?? null;
  const manuelFmt = manuel
    ? {
        source: "manuel",
        nom_restaurant: manuel.nom_restaurant,
        ville: manuel.ville,
        adresse: manuel.adresse ?? "",
        latitude: manuel.latitude,
        longitude: manuel.longitude,
        etoiles_michelin: manuel.etoiles_michelin ?? 0,
        url: manuel.site_web ?? null,
      }
    : null;

  const etablissements = [];
  if (csvRetenu) etablissements.push(csvRetenu);
  if (manuelFmt) {
    const dup =
      csvRetenu &&
      norm(csvRetenu.nom_restaurant) === norm(manuelFmt.nom_restaurant);
    if (!dup) etablissements.push(manuelFmt);
  }

  const hasGeo = etablissements.some(
    (e) => Number.isFinite(e.latitude) && Number.isFinite(e.longitude)
  );
  if (hasGeo) avec++;
  else sans++;

  candidats.push({
    nom,
    saisons,
    statut: hasGeo ? "avec_etablissement" : "sans_etablissement_repertorie",
    etablissements,
    candidatures_csv_meilleur_score: best ? best.score : null,
    autres_tables_csv_score_min_40: hits
      .slice(0, 8)
      .map((h) => ({ score: h.score, nom_restaurant: h.name, ville: h.ville })),
  });
}

const out = {
  meta: {
    genere_le: new Date().toISOString(),
    fichier_csv: "data/france_complete_2024.csv",
    fichier_manuel: "data/topchef-restaurants-manual.json",
    score_minimum_insert_sql: MIN_SCORE,
    note:
      "Les INSERT SQL ne retiennent que le meilleur match CSV si score >= " +
      MIN_SCORE +
      ", plus les entrées manuelles non dupliquées.",
  },
  resume: {
    total_candidats: candidats.length,
    avec_etablissement_geolocalise: avec,
    sans_etablissement: sans,
  },
  noms_sans_etablissement: candidats
    .filter((c) => c.statut === "sans_etablissement_repertorie")
    .map((c) => c.nom),
  candidats,
};

const outPath = join(root, "data", "topchef-candidats-etablissements.json");
writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log("Écrit", outPath);
console.log(
  `Résumé : ${avec} avec établissement (CSV seuil ${MIN_SCORE} et/ou manuel), ${sans} sans.`
);
