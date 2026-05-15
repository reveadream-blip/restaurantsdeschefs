"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { MapFlyTarget } from "@/components/Map";
import type { Restaurant } from "@/types/restaurant";

const ChefMap = dynamic(() => import("@/components/Map"), { ssr: false });

type Props = {
  restaurants: Restaurant[];
  selectedId: number | null;
  flyToTarget: MapFlyTarget | null;
  onSelectId: (id: number) => void;
  onLocatedNearby?: (nearby: Restaurant[]) => void;
  onLocateError?: (message: string) => void;
  locateHint?: string | null;
};

const MAP_H = 520;

export default function RestaurantMapPanel({
  restaurants,
  selectedId,
  flyToTarget,
  onSelectId,
  onLocatedNearby,
  onLocateError,
  locateHint,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm font-light text-[var(--rc-text)]">
          <span className="flex items-center gap-1.5 tracking-wide">
            <MapPin
              className="h-4 w-4 shrink-0 text-[var(--rc-gold)]"
              strokeWidth={1.75}
              aria-hidden
            />
            Restaurant mis en avant sur la carte
          </span>
          <select
            className="w-full max-w-xl rounded-full border border-[var(--rc-border)] bg-[var(--rc-surface-elevated)] px-4 py-2.5 text-sm font-light text-[var(--rc-text)] shadow-sm outline-none transition focus:border-[var(--rc-gold)] focus:ring-2 focus:ring-[var(--rc-gold-soft)]"
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

      {locateHint ? (
        <p className="text-xs font-light text-[var(--rc-text-muted)]">
          {locateHint}
        </p>
      ) : null}

      <div
        className="overflow-hidden rounded-[var(--rc-radius-xl)] border border-[var(--rc-border)] bg-[var(--rc-surface)] shadow-[var(--rc-shadow)]"
        style={{ height: MAP_H }}
      >
        <ChefMap
          restaurants={restaurants}
          flyToTarget={flyToTarget}
          pauseFitBounds={selectedId != null}
          onMarkerSelect={onSelectId}
          onLocatedNearby={onLocatedNearby}
          onLocateError={onLocateError}
        />
      </div>
    </div>
  );
}
