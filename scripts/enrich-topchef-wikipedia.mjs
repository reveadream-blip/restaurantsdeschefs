/**
 * Enrichit chaque candidat Top Chef avec des infos publiques Wikipédia (intro + lien).
 * Entrée : data/topchef-noms.json (généré par npm run data:topchef)
 * Sorties : data/topchef-enriched.json, data/topchef-enrich-wikipedia.sql
 *
 * Licence du texte d’intro : CC BY-SA (Wikipédia) — crédit obligatoire en production.
 * Délai entre requêtes pour respecter https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const UA =
  "RestaurantsDesChefs/1.0 (https://github.com/reveadream-blip/restaurantsdeschefs; enrichissement public)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function wikiApi(params) {
  const u = new URL("https://fr.wikipedia.org/w/api.php");
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, String(v));
  return fetch(u.toString(), { headers: { "user-agent": UA } });
}

/** Raccourcit et normalise le texte pour stockage SQL. */
function clipExtract(text, max = 1200) {
  if (!text) return "";
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length <= max ? oneLine : oneLine.slice(0, max - 1) + "…";
}

function sqlEsc(s) {
  return "'" + String(s).replace(/'/g, "''") + "'";
}

async function enrichOne(nom) {
  const r1 = await wikiApi({
    action: "query",
    format: "json",
    list: "search",
    srsearch: nom,
    srlimit: "1",
    srnamespace: "0",
  });
  if (!r1.ok) throw new Error(`search HTTP ${r1.status}`);
  const j1 = await r1.json();
  const hit = j1?.query?.search?.[0];
  if (!hit?.title) {
    return {
      nom,
      found: false,
      wikipedia_title: null,
      wikipedia_url: null,
      wikidata_id: null,
      extract: null,
    };
  }
  const title = hit.title;
  await sleep(450);
  const r2 = await wikiApi({
    action: "query",
    format: "json",
    titles: title,
    redirects: "1",
    prop: "extracts|pageprops",
    exintro: "1",
    explaintext: "1",
    ppprop: "wikibase_item",
  });
  if (!r2.ok) throw new Error(`extract HTTP ${r2.status}`);
  const j2 = await r2.json();
  const pages = j2?.query?.pages;
  if (!pages) {
    return {
      nom,
      found: true,
      wikipedia_title: title,
      wikipedia_url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`,
      wikidata_id: null,
      extract: null,
    };
  }
  const page = Object.values(pages)[0];
  const pageid = page?.pageid;
  const extract = page?.extract ?? null;
  const wikidata_id = page?.pageprops?.wikibase_item ?? null;
  const wikipedia_url =
    pageid && pageid > 0
      ? `https://fr.wikipedia.org/?curid=${pageid}`
      : `https://fr.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`;
  return {
    nom,
    found: true,
    wikipedia_title: title,
    wikipedia_url,
    wikidata_id,
    extract: extract ? clipExtract(extract) : null,
  };
}

async function main() {
  const nomsPath = join(root, "data", "topchef-noms.json");
  const raw = readFileSync(nomsPath, "utf8");
  const rows = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error("topchef-noms.json invalide");

  const out = [];
  const sql = [
    "-- Mise à jour parcours + liens Wikipédia (texte intro CC BY-SA — crédit Wikipédia).",
    "-- Généré par scripts/enrich-topchef-wikipedia.mjs",
    "BEGIN TRANSACTION;",
  ];

  let i = 0;
  for (const row of rows) {
    const nom = row.nom;
    i++;
    process.stdout.write(`\r${i}/${rows.length} ${nom.slice(0, 40).padEnd(40, " ")}`);
    try {
      const e = await enrichOne(nom);
      out.push({ ...row, ...e });
      if (e.found && (e.extract || e.wikipedia_url)) {
        const parcoursSql = e.extract ? sqlEsc(e.extract) : "NULL";
        const wikiSql = e.wikipedia_url ? sqlEsc(e.wikipedia_url) : "NULL";
        const notesSql = e.wikidata_id
          ? sqlEsc(`wikidata:${e.wikidata_id}`)
          : "NULL";
        sql.push(
          `UPDATE top_chef_candidats SET parcours = ${parcoursSql}, lien_wikipedia = ${wikiSql}, notes_source = ${notesSql} WHERE nom_complet = ${sqlEsc(nom)};`
        );
      }
    } catch (err) {
      out.push({
        nom,
        found: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    await sleep(450);
  }
  console.log("\n");

  const dataDir = join(root, "data");
  mkdirSync(dataDir, { recursive: true });
  const meta = {
    generated_at: new Date().toISOString(),
    source: "Wikipédia (fr) via API MediaWiki",
    license: "Textes d’intro : CC BY-SA — https://creativecommons.org/licenses/by-sa/4.0/deed.fr",
    credit: "Contributeurs des articles Wikipédia en français",
    count: out.length,
    found_wikipedia: out.filter((x) => x.found).length,
  };
  writeFileSync(
    join(dataDir, "topchef-enriched.json"),
    JSON.stringify({ meta, candidats: out }, null, 2),
    "utf8"
  );
  sql.push("COMMIT;");
  writeFileSync(join(dataDir, "topchef-enrich-wikipedia.sql"), sql.join("\n") + "\n", "utf8");
  console.log(
    "Écrit data/topchef-enriched.json et data/topchef-enrich-wikipedia.sql",
    "| pages Wikipédia:",
    out.filter((x) => x.found).length
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
