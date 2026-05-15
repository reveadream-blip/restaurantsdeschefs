/** Vérifie une URL http(s) « publique » (réduit les risques SSRF côté Worker). */

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

function isPrivateIpv4(a: number, b: number, _c: number, _d: number): boolean {
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

export function assertPublicWebUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new UnsafeUrlError("URL invalide.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new UnsafeUrlError("Seules les URL http:// ou https:// sont acceptées.");
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) {
    throw new UnsafeUrlError("Hôte interdit.");
  }
  if (host.endsWith(".local") || host.endsWith(".internal")) {
    throw new UnsafeUrlError("Hôte interdit.");
  }
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    const c = Number(ipv4[3]);
    const d = Number(ipv4[4]);
    if ([a, b, c, d].some((n) => n > 255)) {
      throw new UnsafeUrlError("Adresse IP invalide.");
    }
    if (isPrivateIpv4(a, b, c, d)) {
      throw new UnsafeUrlError("Adresse IP privée interdite.");
    }
  }
  if (host === "metadata.google.internal" || host.includes("169.254.169.254")) {
    throw new UnsafeUrlError("Hôte interdit.");
  }
  return url;
}
