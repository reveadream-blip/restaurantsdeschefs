import type { Restaurant } from "@/types/restaurant";
import { VILLE_NORMALISEE_VERS_DEPT } from "@/lib/villeDepartementFrance";

/** Codes officiels → libellés courts (minuscules) pour la recherche plein texte. */
const DEPT_LIBELLE: Record<string, string> = {
  "01": "ain",
  "02": "aisne",
  "03": "allier",
  "04": "alpes de haute provence alpes-de-haute-provence",
  "05": "hautes alpes hautes-alpes",
  "06": "alpes maritimes alpes-maritimes",
  "07": "ardeche",
  "08": "ardennes",
  "09": "ariege",
  "10": "aube",
  "11": "aude",
  "12": "aveyron",
  "13": "bouches du rhone bouches-du-rhone",
  "14": "calvados",
  "15": "cantal",
  "16": "charente",
  "17": "charente maritime charente-maritime",
  "18": "cher",
  "19": "correze",
  "21": "cote d or cote-d-or",
  "22": "cotes d armor cotes-d-armor",
  "23": "creuse",
  "24": "dordogne",
  "25": "doubs",
  "26": "drome",
  "27": "eure",
  "28": "eure et loir eure-et-loir",
  "29": "finistere",
  "30": "gard",
  "31": "haute garonne haute-garonne",
  "32": "gers",
  "33": "gironde",
  "34": "herault",
  "35": "ille et vilaine ille-et-vilaine",
  "36": "indre",
  "37": "indre et loire indre-et-loire",
  "38": "isere",
  "39": "jura",
  "40": "landes",
  "41": "loir et cher loir-et-cher",
  "42": "loire",
  "43": "haute loire haute-loire",
  "44": "loire atlantique loire-atlantique",
  "45": "loiret",
  "46": "lot",
  "47": "lot et garonne lot-et-garonne",
  "48": "lozere",
  "49": "maine et loire maine-et-loire",
  "50": "manche",
  "51": "marne",
  "52": "haute marne haute-marne",
  "53": "mayenne",
  "54": "meurthe et moselle meurthe-et-moselle",
  "55": "meuse",
  "56": "morbihan",
  "57": "moselle",
  "58": "nievre",
  "59": "nord",
  "60": "oise",
  "61": "orne",
  "62": "pas de calais pas-de-calais",
  "63": "puy de dome puy-de-dome",
  "64": "pyrenees atlantiques pyrenees-atlantiques",
  "65": "hautes pyrenees hautes-pyrenees",
  "66": "pyrenees orientales pyrenees-orientales",
  "67": "bas rhin bas-rhin",
  "68": "haut rhin haut-rhin",
  "69": "rhone metropole de lyon",
  "70": "haute saone haute-saone",
  "71": "saone et loire saone-et-loire",
  "72": "sarthe",
  "73": "savoie",
  "74": "haute savoie haute-savoie",
  "75": "paris",
  "76": "seine maritime seine-maritime",
  "77": "seine et marne seine-et-marne",
  "78": "yvelines",
  "79": "deux sevres deux-sevres",
  "80": "somme",
  "81": "tarn",
  "82": "tarn et garonne tarn-et-garonne",
  "83": "var",
  "84": "vaucluse",
  "85": "vendee",
  "86": "vienne",
  "87": "haute vienne haute-vienne",
  "88": "vosges",
  "89": "yonne",
  "90": "territoire de belfort",
  "91": "essonne",
  "92": "hauts de seine hauts-de-seine",
  "93": "seine saint denis seine-saint-denis",
  "94": "val de marne val-de-marne",
  "95": "val d oise val-doise",
  "2A": "corse du sud corse-du-sud",
  "2B": "haute corse haute-corse",
  "971": "guadeloupe",
  "972": "martinique",
  "973": "guyane",
  "974": "la reunion reunion",
  "976": "mayotte",
  "975": "saint pierre et miquelon saint-pierre-et-miquelon",
};

/** Département métropolitain ou DOM à partir d'un code postal français. */
export function codePostalVersDepartement(cp: string): string | null {
  if (!/^\d{5}$/.test(cp)) return null;
  if (cp.startsWith("97") || cp.startsWith("98")) {
    const trois = cp.slice(0, 3);
    if (DEPT_LIBELLE[trois]) return trois;
    return null;
  }
  if (cp.startsWith("20")) {
    const n = parseInt(cp, 10);
    if (n >= 20000 && n <= 20199) return "2A";
    return "2B";
  }
  const deux = cp.slice(0, 2);
  if (deux === "00") return null;
  if (DEPT_LIBELLE[deux]) return deux;
  return null;
}

export function stripAccentsSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function normaliseVillePourDept(v: string | undefined): string {
  return stripAccentsSearch((v ?? "").trim());
}

function collecterCodesPostaux(text: string): Set<string> {
  const cps = new Set<string>();
  const norm = text.replace(/\u00a0/g, " ");
  for (const m of norm.matchAll(/\b(\d{5})\b/g)) {
    cps.add(m[1]);
  }
  for (const m of norm.matchAll(/\b(\d{2})\s(\d{3})\b/g)) {
    cps.add(`${m[1]}${m[2]}`);
  }
  return cps;
}

function tokensPourDepartements(codes: Set<string>): string {
  const parts: string[] = [];
  for (const code of codes) {
    const lib = DEPT_LIBELLE[code];
    if (lib) {
      parts.push(
        `departement ${code} dept ${code} dpt ${code} ${lib} department ${code}`
      );
    } else {
      parts.push(`departement ${code} dept ${code} dpt ${code}`);
    }
  }
  return parts.join(" ");
}

/** Codes département (INSEE) pour un établissement : CP dans l’adresse + ville (carte Michelin / démo). */
export function restaurantDepartementCodes(r: Restaurant): Set<string> {
  const depts = new Set<string>();
  const chunks = [r.restaurant_adresse, r.ville].filter(Boolean).join(" ");
  for (const cp of collecterCodesPostaux(chunks)) {
    const d = codePostalVersDepartement(cp);
    if (d) depts.add(d);
  }
  const vk = normaliseVillePourDept(r.ville);
  if (vk && vk in VILLE_NORMALISEE_VERS_DEPT) {
    depts.add(VILLE_NORMALISEE_VERS_DEPT[vk as keyof typeof VILLE_NORMALISEE_VERS_DEPT]);
  }
  return depts;
}

/**
 * Si la requête désigne un ou plusieurs départements (n° ou libellé token à token),
 * retourne leurs codes ; sinon null (pas de filtre « département » en secours).
 */
export function parseDepartementQueryCodes(raw: string): Set<string> | null {
  const s = stripAccentsSearch(raw.trim());
  if (!s) return null;

  if (/^2a$/i.test(s)) return new Set(["2A"]);
  if (/^2b$/i.test(s)) return new Set(["2B"]);
  if (/^\d{3}$/.test(s) && DEPT_LIBELLE[s]) return new Set([s]);
  if (/^\d{2}$/.test(s) && DEPT_LIBELLE[s]) return new Set([s]);

  const queryTokens = s.split(/\s+/).filter((t) => t.length >= 2);
  if (queryTokens.length === 0) return null;

  const hits: string[] = [];
  for (const [code, lib] of Object.entries(DEPT_LIBELLE)) {
    const libTokens = lib.split(/\s+/);
    if (queryTokens.every((t) => libTokens.includes(t))) {
      hits.push(code);
    }
  }
  if (hits.length === 0) return null;
  return new Set(hits);
}

/** Texte à indexer pour retrouver un établissement par département (nom ou n°). */
export function departementSearchBlobFromRestaurant(r: Restaurant): string {
  const depts = restaurantDepartementCodes(r);
  if (depts.size === 0) return "";
  return tokensPourDepartements(depts);
}
