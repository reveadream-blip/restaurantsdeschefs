"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
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
import type { MenuFiltre } from "@/types/restaurant";

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

  const affiche = useMemo(
    () => filterRestaurants(sampleRestaurants, filtre, recherche),
    [filtre, recherche]
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
                    <a
                      href={`tel:${restau.telephone}`}
                      className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                      aria-label={`Appeler ${restau.chef_nom}`}
                    >
                      <Phone size={18} />
                    </a>
                    <button
                      type="button"
                      className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                      aria-label="Contact e-mail (à brancher)"
                    >
                      <Mail size={18} />
                    </button>
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
