"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RestaurantFichePage from "@/components/RestaurantFichePage";
import { fetchRestaurantsForApp } from "@/lib/fetchRestaurantsForApp";
import type { Restaurant } from "@/types/restaurant";

function RestaurantPageInner() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("id");
  const id = raw != null && raw !== "" ? Number(raw) : NaN;

  const [rows, setRows] = useState<Restaurant[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { rows: list } = await fetchRestaurantsForApp();
      if (!cancelled) {
        setRows(list);
        setDone(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const r = rows.find((x) => x.id === id);
    if (r) {
      document.title = `${r.chef_nom} — ${r.nom_restaurant} | Grands Chefs`;
    } else {
      document.title = "Fiche introuvable | Grands Chefs";
    }
  }, [done, id, rows]);

  if (!done) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--rc-page-bg)] px-4 text-sm text-[var(--rc-text-muted)]">
        Chargement de la fiche…
      </div>
    );
  }

  if (!Number.isFinite(id)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-[var(--rc-text)]">Identifiant de fiche manquant.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-[var(--rc-ruby)] underline-offset-2 hover:underline"
        >
          Retour à l’annuaire
        </Link>
      </div>
    );
  }

  const restaurant = rows.find((x) => x.id === id);
  if (!restaurant) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-[var(--rc-text)]">
          Cette fiche n’existe pas ou n’est plus dans la liste affichée.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-[var(--rc-ruby)] underline-offset-2 hover:underline"
        >
          Retour à l’annuaire
        </Link>
      </div>
    );
  }

  return <RestaurantFichePage restaurant={restaurant} />;
}

export default function RestaurantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-[var(--rc-page-bg)] px-4 text-sm text-[var(--rc-text-muted)]">
          Chargement…
        </div>
      }
    >
      <RestaurantPageInner />
    </Suspense>
  );
}
