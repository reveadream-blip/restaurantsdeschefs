/** Liens externes (pas de clé API requise pour l’utilisateur). */

export function googleDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** Ouvre l’app Maps avec destination (mobile / bureau). */
export function appleMapsDirectionsUrl(lat: number, lng: number): string {
  return `https://maps.apple.com/?daddr=${lat},${lng}`;
}

/** Street View dans Google Maps (nouvel onglet). */
export function googleStreetViewUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
}

/** Carte Waze centrée sur le restaurant (iframe). */
export function wazeEmbedUrl(lat: number, lng: number): string {
  return `https://embed.waze.com/iframe?zoom=16&lat=${lat}&lon=${lng}&pin=1`;
}

/**
 * Bing Maps — vue « Streetside » quand disponible (iframe).
 * Peut être indisponible selon les lieux.
 */
export function bingStreetsideEmbedUrl(lat: number, lng: number): string {
  const w = 800;
  const h = 520;
  return `https://www.bing.com/maps/embed?h=${h}&w=${w}&cp=${lat}~${lng}&lvl=18&sty=s`;
}
