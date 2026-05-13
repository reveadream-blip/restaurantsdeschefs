"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Utensils,
  Star,
  Phone,
  Mail,
  Search,
  ChefHat,
  Sparkles,
} from "lucide-react";
import { sampleRestaurants } from "@/data/sampleRestaurants";
import { filterRestaurants } from "@/lib/filterRestaurants";
import { mapEtablissementApiRow } from "@/lib/mapEtablissementApiRow";
import type { MenuFiltre, Restaurant } from "@/types/restaurant";

const ChefMap = dynamic(() => import("@/components/Map"), { ssr: false });

const MENU: { id: MenuFiltre; label: string; icon?: typeof Star }[] = [
  { id: "tous", label: "Tout voir", icon: Sparkles },
  { id: "top-chef", label: "Top Chef", icon: ChefHat },
  { id: "3", label: "3 étoiles", icon: Star },
  { id: "2", label: "2 étoiles", icon: Star },
  { id: "1", label: "1 étoile", icon: Star },
];

export default function Home() {
  const [filtre, setFiltre] = useState<MenuFiltre>("tous");
  const [recherche, setRecherche] = useState("");
  const [rows, setRows] = useState<Restaurant[]>(sampleRestaurants);
  const [source, setSource] = useState<"d1" | "demo">("demo");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/etablissements", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data: unknown = await res.json();
        if (!Array.isArray(data)) throw new Error("bad json");
        const mapped = data
          .map((x) =>
            mapEtablissementApiRow(x as Record<string, unknown>)
          )
          .filter((x): x is Restaurant => x != null);
        if (cancelled) return;
        if (mapped.length > 0) {
          setRows(mapped);
          setSource("d1");
        } else {
          setRows(sampleRestaurants);
          setSource("demo");
        }
      } catch {
        if (!cancelled) {
          setRows(sampleRestaurants);
          setSource("demo");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const affiche = useMemo(
    () => filterRestaurants(rows, filtre, recherche),
    [rows, filtre, recherche]
  );

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mx-auto mb-8 max-w-6xl">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          <Utensils className="shrink-0 text-red-600" /> L&apos;Annuaire des
          Chefs
        </h1>
        <p className="mt-2 text-gray-500">
          Top Chef et tables Michelin : filtrez par étoiles ou recherchez une
          ville, un chef ou un restaurant.
        </p>
        <p
          className={`mt-1 text-xs ${source === "d1" ? "text-emerald-700" : "text-amber-800"}`}
        >
          {source === "d1"
            ? "Données chargées depuis la base D1 (établissements)."
            : "Données de démonstration : l’API /api/etablissements est indisponible, vide, ou vous êtes en next dev sans Pages Functions."}
        </p>

        <nav
          className="mt-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4"
          aria-label="Filtrer par catégorie"
        >
          {MENU.map((item) => {
            const Icon = item.icon ?? Star;
            const actif = filtre === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFiltre(item.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  actif
                    ? "bg-red-600 text-white shadow-md ring-2 ring-red-600 ring-offset-2"
                    : "bg-white text-gray-700 shadow hover:bg-gray-50"
                }`}
              >
                <Icon
                  className="h-4 w-4 shrink-0"
                  fill={item.id !== "tous" && actif ? "currentColor" : "none"}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Ville, chef, restaurant, « Top Chef », « 3 étoiles »…"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-gray-900 shadow-sm outline-none ring-red-200 transition placeholder:text-gray-400 focus:border-red-300 focus:ring-2"
              aria-label="Rechercher sur la carte"
            />
          </div>

          <ChefMap restaurants={affiche} />

          <p className="text-center text-sm text-gray-500">
            {affiche.length === 0
              ? "Aucun établissement ne correspond aux critères."
              : `${affiche.length} établissement${affiche.length > 1 ? "s" : ""} affiché${affiche.length > 1 ? "s" : ""}`}
            {recherche.trim() || filtre !== "tous"
              ? " — filtre ou recherche actif."
              : ""}
          </p>
        </div>

        <aside className="max-h-[640px] overflow-y-auto rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Star className="text-yellow-500" fill="currentColor" /> Liste
          </h2>
          {affiche.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun résultat. Essayez un autre filtre ou une autre recherche.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {affiche.map((restau) => (
                <li key={restau.id} className="py-4 first:pt-0">
                  <p className="text-xs font-medium uppercase text-gray-400">
                    {restau.ville}
                    {restau.top_chef && (
                      <span className="ml-2 rounded bg-orange-100 px-1.5 py-0.5 text-orange-800">
                        Top Chef
                      </span>
                    )}
                  </p>
                  <h3 className="font-semibold text-gray-900">
                    {restau.chef_nom}
                  </h3>
                  <p className="text-sm italic text-gray-600">
                    {restau.nom_restaurant}
                  </p>
                  {restau.etoiles_michelin > 0 && (
                    <p className="mt-1 text-xs text-amber-700">
                      {restau.etoiles_michelin}{" "}
                      {restau.etoiles_michelin > 1 ? "étoiles" : "étoile"}{" "}
                      Michelin
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    {restau.telephone ? (
                      <a
                        href={`tel:${restau.telephone.replace(/\s/g, "")}`}
                        className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                        aria-label={`Téléphone du restaurant ${restau.nom_restaurant}`}
                      >
                        <Phone size={18} />
                      </a>
                    ) : null}
                    {restau.email ? (
                      <a
                        href={`mailto:${restau.email}`}
                        className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                        aria-label={`E-mail du restaurant ${restau.nom_restaurant}`}
                      >
                        <Mail size={18} />
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </main>
  );
}
