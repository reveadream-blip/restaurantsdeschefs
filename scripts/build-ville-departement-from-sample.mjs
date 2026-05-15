/**
 * Génère src/lib/villeDepartementFrance.ts à partir de sampleRestaurants :
 * pour chaque ville, département majoritaire déduit du code postal dans l'adresse.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function stripAccents(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

const DEPT_LIBELLE_KEYS = new Set([
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
  "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
  "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79",
  "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95",
  "2A", "2B", "971", "972", "973", "974", "975", "976",
]);

function cpToDept(cp) {
  if (!/^\d{5}$/.test(cp)) return null;
  if (cp.startsWith("97") || cp.startsWith("98")) {
    const trois = cp.slice(0, 3);
    return DEPT_LIBELLE_KEYS.has(trois) ? trois : null;
  }
  if (cp.startsWith("20")) {
    const n = parseInt(cp, 10);
    if (n >= 20000 && n <= 20199) return "2A";
    return "2B";
  }
  const deux = cp.slice(0, 2);
  if (deux === "00") return null;
  return DEPT_LIBELLE_KEYS.has(deux) ? deux : null;
}

const t = fs.readFileSync(path.join(root, "src/data/sampleRestaurants.ts"), "utf8");
const chunks = t.split(/\{\s*\n/);
const counts = new Map();

for (const ch of chunks) {
  const vm = ch.match(/ville:\s*"([^"]*)"/);
  const am = ch.match(/restaurant_adresse:\s*"([^"]*)"/);
  if (!vm || !am) continue;
  const ville = vm[1].trim();
  const addr = am[1];
  if (!ville) continue;
  const cps = [...addr.matchAll(/\b(\d{5})\b/g)].map((m) => m[1]);
  const depts = new Set();
  for (const cp of cps) {
    const d = cpToDept(cp);
    if (d) depts.add(d);
  }
  if (depts.size !== 1) continue;
  const dept = [...depts][0];
  const key = stripAccents(ville);
  if (!key) continue;
  const cur = counts.get(key) ?? new Map();
  cur.set(dept, (cur.get(dept) ?? 0) + 1);
  counts.set(key, cur);
}

const out = {};
for (const [villeNorm, deptMap] of counts) {
  let best = null;
  let bestN = 0;
  for (const [d, n] of deptMap) {
    if (n > bestN) {
      bestN = n;
      best = d;
    }
  }
  if (best && bestN >= 1) out[villeNorm] = best;
}

const keys = Object.keys(out).sort();
const lines = keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(out[k])},`);

const header = `/**
 * Ville (sans accents, minuscules) → code département INSEE.
 * Généré par scripts/build-ville-departement-from-sample.mjs — ne pas éditer à la main.
 */
export const VILLE_NORMALISEE_VERS_DEPT: Readonly<Record<string, string>> = {
`;

const fileContent = `${header}${lines.join("\n")}\n} as const;\n`;

fs.writeFileSync(path.join(root, "src/lib/villeDepartementFrance.ts"), fileContent, "utf8");
console.error("Written", keys.length, "ville → dept entries");
