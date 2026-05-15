"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Ancienne URL — redirection vers /partenaires */
export default function PartenariatRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/partenaires");
  }, [router]);
  return (
    <p className="px-4 py-16 text-center text-sm text-[var(--rc-text-muted)]">
      Redirection vers l’espace restaurateurs…
    </p>
  );
}
