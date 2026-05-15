/** URLs d’images pour fiches (http/https, //, domaine sans schéma) — aligné sur functions/lib/normalizePhotoUrl.ts */

const MAX_URL = 2048;
const MAX_FICHE_PHOTOS = 24;

export function normalizeFichePhotoUrl(raw: string): string | null {
  let u = String(raw).trim();
  if (!u) return null;
  u = u.replace(/^[\s"'<(]+|[\s"'>)]+$/g, "");
  if (!u) return null;
  if (/^(javascript|data|vbscript):/i.test(u)) return null;
  if (u.startsWith("//")) u = `https:${u}`;
  else if (!/^https?:\/\//i.test(u)) {
    if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/|$)/i.test(u)) u = `https://${u}`;
    else return null;
  }
  if (u.length > MAX_URL) return null;
  try {
    const url = new URL(u);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

export function normalizeFichePhotoList(
  urls: string[] | undefined | null
): string[] {
  if (!urls?.length) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const n = normalizeFichePhotoUrl(String(raw));
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
      if (out.length >= MAX_FICHE_PHOTOS) break;
    }
  }
  return out;
}

/** Parse le champ « une URL par ligne » comme dans l’admin (plusieurs https sur une ligne possibles). */
export function parseFichePhotoLines(text: string): string[] {
  const re = /\bhttps?:\/\/[^\s<>"'`]+/gi;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const matches = t.match(re);
    if (matches && matches.length > 0) {
      for (let m of matches) {
        m = m.replace(/[),.;:!?\]}>'"`]+$/u, "");
        const n = normalizeFichePhotoUrl(m);
        if (n && !seen.has(n)) {
          seen.add(n);
          out.push(n);
          if (out.length >= MAX_FICHE_PHOTOS) return out;
        }
      }
    } else {
      const n = normalizeFichePhotoUrl(t);
      if (n && !seen.has(n)) {
        seen.add(n);
        out.push(n);
        if (out.length >= MAX_FICHE_PHOTOS) return out;
      }
    }
  }
  return out;
}
