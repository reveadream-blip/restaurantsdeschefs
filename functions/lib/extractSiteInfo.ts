import { assertPublicWebUrl } from "./ssrfSafeUrl";

export type SiteExtractResult = {
  source_url: string;
  page_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  images: string[];
  text_snippet: string;
  json_ld: {
    name?: string;
    telephone?: string;
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    images: string[];
  };
};

const MAX_HTML_BYTES = 1_500_000;
const MAX_SNIPPET = 12_000;

function absolutize(href: string, base: string): string | null {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function stripTagsForSnippet(html: string): string {
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  t = t.replace(/<[^>]+>/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t.length > MAX_SNIPPET ? t.slice(0, MAX_SNIPPET) + "…" : t;
}

function extractJsonLdBlocks(html: string): unknown[] {
  const out: unknown[] = [];
  const re =
    /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      out.push(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }
  return out;
}

function processLdObject(
  o: Record<string, unknown>,
  acc: SiteExtractResult["json_ld"]
): void {
  const typesRaw = o["@type"];
  const types = Array.isArray(typesRaw)
    ? typesRaw.map((x) => String(x))
    : typesRaw != null
      ? [String(typesRaw)]
      : [];
  const isPlace = types.some((t) =>
    /Restaurant|FoodEstablishment|LocalBusiness|Hotel|LodgingBusiness/i.test(t)
  );
  if (!isPlace) return;
  if (typeof o.name === "string" && !acc.name) acc.name = o.name;
  if (typeof o.telephone === "string" && !acc.telephone)
    acc.telephone = o.telephone;
  const img = o.image;
  if (typeof img === "string") acc.images.push(img);
  else if (Array.isArray(img)) {
    for (const x of img) {
      if (typeof x === "string") acc.images.push(x);
      else if (
        x &&
        typeof x === "object" &&
        "url" in x &&
        typeof (x as { url: unknown }).url === "string"
      ) {
        acc.images.push(String((x as { url: string }).url));
      }
    }
  }
  const addr = o.address;
  if (addr && typeof addr === "object" && !Array.isArray(addr)) {
    const a = addr as Record<string, unknown>;
    if (typeof a.streetAddress === "string" && !acc.streetAddress)
      acc.streetAddress = a.streetAddress;
    if (typeof a.addressLocality === "string" && !acc.addressLocality)
      acc.addressLocality = a.addressLocality;
    if (typeof a.postalCode === "string" && !acc.postalCode)
      acc.postalCode = a.postalCode;
  }
}

function walkLd(node: unknown, acc: SiteExtractResult["json_ld"]): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    for (const x of node.slice(0, 80)) walkLd(x, acc);
    return;
  }
  if (typeof node !== "object") return;
  const o = node as Record<string, unknown>;
  processLdObject(o, acc);
  if (o["@graph"]) walkLd(o["@graph"], acc);
  if (o.mainEntity) walkLd(o.mainEntity, acc);
}

function parseJsonLdAggregate(html: string, baseUrl: string): SiteExtractResult["json_ld"] {
  const acc: SiteExtractResult["json_ld"] = { images: [] };
  for (const block of extractJsonLdBlocks(html)) {
    walkLd(block, acc);
  }
  acc.images = [
    ...new Set(
      acc.images
        .map((u) => absolutize(u, baseUrl))
        .filter((u): u is string => u != null && /^https?:\/\//iu.test(u))
    ),
  ].slice(0, 24);
  return acc;
}

export async function fetchAndExtractSite(pageUrl: string): Promise<SiteExtractResult> {
  const base = assertPublicWebUrl(pageUrl).href;

  const res = await fetch(base, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    },
  });
  if (!res.ok) {
    throw new Error(`Le site a répondu HTTP ${res.status}.`);
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!/text\/html|application\/xhtml\+xml/i.test(ct)) {
    throw new Error("La réponse n’est pas une page HTML.");
  }
  const buf = await res.arrayBuffer();
  const slice =
    buf.byteLength > MAX_HTML_BYTES
      ? buf.slice(0, MAX_HTML_BYTES)
      : buf;
  const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);

  const state = {
    title: "",
    metaDesc: "",
    ogTitle: "",
    ogDesc: "",
    images: [] as string[],
  };

  const rewriter = new HTMLRewriter()
    .on("title", {
      text(t) {
        state.title += t.text;
      },
    })
    .on("meta", {
      element(el) {
        const name = el.getAttribute("name")?.toLowerCase() ?? "";
        const prop = el.getAttribute("property")?.toLowerCase() ?? "";
        const content = el.getAttribute("content");
        if (!content?.trim()) return;
        if (name === "description") state.metaDesc = content.trim();
        if (prop === "og:title") state.ogTitle = content.trim();
        if (prop === "og:description") state.ogDesc = content.trim();
        if (
          prop === "og:image" ||
          prop === "og:image:url" ||
          prop === "og:image:secure_url"
        ) {
          const abs = absolutize(content.trim(), base);
          if (abs?.startsWith("https://") || abs?.startsWith("http://"))
            state.images.push(abs);
        }
      },
    })
    .on("link", {
      element(el) {
        const rel = el.getAttribute("rel")?.toLowerCase() ?? "";
        if (rel !== "image_src") return;
        const href = el.getAttribute("href");
        if (!href) return;
        const abs = absolutize(href.trim(), base);
        if (abs?.startsWith("https://") || abs?.startsWith("http://"))
          state.images.push(abs);
      },
    });

  const transformed = rewriter.transform(
    new Response(html, {
      headers: { "content-type": "text/html;charset=utf-8" },
    })
  );
  await transformed.text();

  const jsonLd = parseJsonLdAggregate(html, base);
  const snippet = stripTagsForSnippet(html);
  const images = [
    ...new Set([...state.images, ...jsonLd.images]),
  ].slice(0, 24);

  return {
    source_url: base,
    page_title: state.title.replace(/\s+/g, " ").trim(),
    meta_description: state.metaDesc.trim(),
    og_title: state.ogTitle.trim(),
    og_description: state.ogDesc.trim(),
    images,
    text_snippet: snippet,
    json_ld: jsonLd,
  };
}

export function buildDescriptionFromExtract(ex: SiteExtractResult): string {
  const parts: string[] = [];
  const title = ex.og_title || ex.page_title;
  if (title) parts.push(title);
  const desc = ex.og_description || ex.meta_description;
  if (desc) parts.push(desc);
  if (ex.json_ld.name && !title.includes(ex.json_ld.name)) {
    parts.push(ex.json_ld.name);
  }
  if (ex.text_snippet) parts.push(ex.text_snippet);
  parts.push(`— Source : ${ex.source_url}`);
  return parts.join("\n\n").trim();
}

export function buildContactJsonFromExtract(
  ex: SiteExtractResult
): Record<string, string> | null {
  const j = ex.json_ld;
  const out: Record<string, string> = {};
  if (j.telephone?.trim()) out.telephone = j.telephone.trim();
  const addrParts = [j.streetAddress, j.postalCode, j.addressLocality].filter(
    (x): x is string => typeof x === "string" && x.trim() !== ""
  );
  if (addrParts.length) out.adresse = addrParts.join(", ");
  if (j.addressLocality?.trim()) out.ville = j.addressLocality.trim();
  if (j.name?.trim()) out.nom_restaurant = j.name.trim();
  return Object.keys(out).length ? out : null;
}
