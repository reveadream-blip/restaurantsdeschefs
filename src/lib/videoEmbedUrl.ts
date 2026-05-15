/** URL utilisable en `src` d’iframe pour YouTube / lien direct https. */
export function videoEmbedUrl(input: string): string | null {
  const u = input.trim();
  if (!u) return null;
  if (u.includes("youtube.com/embed/")) return u;
  const watch = u.match(
    /[?&]v=([a-zA-Z0-9_-]{6,})/u
  );
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/u);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  if (/^https:\/\//iu.test(u)) return u;
  return null;
}
