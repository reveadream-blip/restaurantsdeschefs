import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Requis pour Cloudflare Pages en mode fichiers statiques (dossier `out/`)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
