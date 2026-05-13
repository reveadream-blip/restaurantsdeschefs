"use client";

import dynamic from "next/dynamic";
import { Map, MapPin, Navigation, ExternalLink, Binoculars } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";
import {
  appleMapsDirectionsUrl,
  bingStreetsideEmbedUrl,
  googleDirectionsUrl,
  googleStreetViewUrl,
  wazeEmbedUrl,
} from "@/lib/mapsLinks";

const ChefMap = dynamic(() => import("@/components/Map"), { ssr: false });

export type GeoOnglet = "carte" | "itineraire" | "streetview";

const TAB_H = 520;

const tabs: { id: GeoOnglet; label: string; icon: typeof Map }[] = [
  { id: "carte", label: "Carte", icon: Map },
  { id: "itineraire", label: "Itinéraire", icon: Navigation },
  { id: "streetview", label: "Street View", icon: Binoculars },
];

type Props = {
  restaurants: Restaurant[];
  selectedId: number | null;
  onSelectId: (id: number) => void;
  onglet: GeoOnglet;
  onOnglet: (o: GeoOnglet) => void;
};

export default function RestaurantMapPanel({
  restaurants,
  selectedId,
  onSelectId,
  onglet,
  onOnglet,
}: Props) {
  const selected =
    selectedId != null
      ? restaurants.find((r) => r.id === selectedId) ?? null
      : null;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
            Restaurant pour itinéraire & Street View
          </span>
          <select
            className="w-full max-w-xl rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200"
            value={selectedId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v) onSelectId(Number(v));
            }}
            disabled={restaurants.length === 0}
          >
            {restaurants.length === 0 ? (
              <option value="">Aucun établissement</option>
            ) : (
              restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nom_restaurant} — {r.chef_nom} ({r.ville})
                </option>
              ))
            )}
          </select>
        </label>
      </div>

      <div
        className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1"
        role="tablist"
        aria-label="Vue carte, itinéraire ou street view"
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const actif = onglet === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={actif}
              onClick={() => onOnglet(t.id)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition sm:flex-none sm:px-5 ${
                actif
                  ? "bg-white text-red-700 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-inner"
        style={{ height: TAB_H }}
        role="tabpanel"
      >
        {onglet === "carte" && (
          <div className="h-full w-full">
            <ChefMap restaurants={restaurants} />
          </div>
        )}

        {onglet === "itineraire" && selected && (
          <div className="flex h-full w-full flex-col">
            <div className="flex shrink-0 flex-wrap gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
              <a
                href={googleDirectionsUrl(selected.latitude, selected.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200 hover:bg-gray-50"
              >
                Google Maps <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={appleMapsDirectionsUrl(selected.latitude, selected.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200 hover:bg-gray-50"
              >
                Plans (Apple) <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <iframe
              title={`Itinéraire Waze — ${selected.nom_restaurant}`}
              className="min-h-0 w-full flex-1 border-0"
              src={wazeEmbedUrl(selected.latitude, selected.longitude)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}

        {onglet === "itineraire" && !selected && (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
            Sélectionnez un restaurant pour afficher la carte d’itinéraire
            (Waze) et les liens vers Google / Apple Plans.
          </div>
        )}

        {onglet === "streetview" && selected && (
          <div className="flex h-full w-full flex-col">
            <div className="flex shrink-0 flex-wrap gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
              <a
                href={googleStreetViewUrl(selected.latitude, selected.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200 hover:bg-gray-50"
              >
                Google Street View (nouvel onglet) <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <iframe
              title={`Vue rapprochée Bing — ${selected.nom_restaurant}`}
              className="min-h-0 w-full flex-1 border-0"
              src={bingStreetsideEmbedUrl(selected.latitude, selected.longitude)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <p className="shrink-0 border-t border-gray-100 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-500">
              Vue intégrée : Bing Maps (Streetside si disponible). Sinon utilisez le lien Google Street View.
            </p>
          </div>
        )}

        {onglet === "streetview" && !selected && (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
            Sélectionnez un restaurant pour la vue Street View.
          </div>
        )}
      </div>
    </div>
  );
}
