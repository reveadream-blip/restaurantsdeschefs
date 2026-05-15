"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Crosshair, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { Restaurant } from "@/types/restaurant";
import { restaurantSponsoring } from "@/lib/restaurantEditorial";
import { distanceKm } from "@/lib/geoDistance";
import {
  googleDirectionsUrl,
  googleStreetViewUrl,
} from "@/lib/mapsLinks";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const editorialMarkerIcon = L.divIcon({
  className: "leaflet-div-icon !border-0 !bg-transparent",
  html: '<div style="width:26px;height:26px;border-radius:9999px;background:linear-gradient(145deg,#d4af37,#9a7d2e);border:2px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.45);"></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

export type MapFlyTarget = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

function FitBounds({
  restaurants,
  pause,
}: {
  restaurants: Restaurant[];
  pause?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (pause) return;
    if (restaurants.length === 0) {
      map.setView([46.603354, 1.888334], 5);
      return;
    }
    if (restaurants.length === 1) {
      const r = restaurants[0];
      map.setView([r.latitude, r.longitude], 12);
      return;
    }
    const bounds = L.latLngBounds(
      restaurants.map((r) => [r.latitude, r.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 });
  }, [map, restaurants, pause]);

  return null;
}

function MapFlyTo({ target }: { target: MapFlyTarget | null }) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    map.flyTo(
      [target.latitude, target.longitude],
      target.zoom ?? 14,
      { duration: 1.35, easeLinearity: 0.22 }
    );
  }, [map, target?.latitude, target?.longitude, target?.zoom]);

  return null;
}

function LocateMeControl({
  restaurants,
  onLocated,
  onError,
}: {
  restaurants: Restaurant[];
  onLocated?: (nearby: Restaurant[]) => void;
  onError?: (message: string) => void;
}) {
  const map = useMap();
  const [busy, setBusy] = useState(false);

  function locate() {
    if (!navigator.geolocation) {
      onError?.("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 11, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
        const nearby = restaurants
          .map((r) => ({
            r,
            d: distanceKm(latitude, longitude, r.latitude, r.longitude),
          }))
          .filter((x) => x.d <= 80)
          .sort((a, b) => a.d - b.d)
          .map((x) => x.r);
        onLocated?.(nearby);
      },
      () => {
        setBusy(false);
        onError?.(
          "Impossible d’obtenir votre position. Vérifiez les autorisations du navigateur."
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  return (
    <div className="leaflet-bottom leaflet-right !bottom-4 !right-4 z-[1000]">
      <button
        type="button"
        onClick={locate}
        disabled={busy}
        className="flex items-center gap-2 rounded-full border border-[var(--rc-border)] bg-[var(--rc-glass)] px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.12em] text-[var(--rc-text)] shadow-[var(--rc-shadow-soft)] backdrop-blur-xl transition hover:border-[var(--rc-gold)] hover:bg-white/90 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Crosshair className="h-4 w-4 text-[var(--rc-gold)]" strokeWidth={2} aria-hidden />
        )}
        Localisez-moi
      </button>
    </div>
  );
}

export default function ChefMap({
  restaurants,
  flyToTarget,
  pauseFitBounds = false,
  onMarkerSelect,
  onLocatedNearby,
  onLocateError,
}: {
  restaurants: Restaurant[];
  flyToTarget?: MapFlyTarget | null;
  pauseFitBounds?: boolean;
  onMarkerSelect?: (id: number) => void;
  onLocatedNearby?: (nearby: Restaurant[]) => void;
  onLocateError?: (message: string) => void;
}) {
  return (
    <div className="relative h-full min-h-0 w-full">
      <MapContainer
        center={[46.603354, 1.888334]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds restaurants={restaurants} pause={pauseFitBounds} />
        <MapFlyTo target={flyToTarget ?? null} />
        <LocateMeControl
          restaurants={restaurants}
          onLocated={onLocatedNearby}
          onError={onLocateError}
        />
        {restaurants.map((restau) => (
          <Marker
            key={restau.id}
            position={[restau.latitude, restau.longitude]}
            icon={
              restaurantSponsoring(restau) ? editorialMarkerIcon : customIcon
            }
            eventHandlers={
              onMarkerSelect
                ? {
                    click: () => {
                      onMarkerSelect(restau.id);
                    },
                  }
                : undefined
            }
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {restau.ville}
                </p>
                <h3 className="text-base font-bold">{restau.nom_restaurant}</h3>
                <p className="text-sm text-gray-700">{restau.chef_nom}</p>
                {restaurantSponsoring(restau) ? (
                  <p className="mt-1 text-xs font-semibold text-amber-700">
                    Sponsoring
                  </p>
                ) : null}
                {restau.top_chef &&
                restau.saisons_top_chef &&
                restau.saisons_top_chef.length > 0 ? (
                  <p className="mt-0.5 text-xs text-gray-500">
                    Saisons {restau.saisons_top_chef.join(", ")}
                  </p>
                ) : null}
                {restau.top_chef ? (
                  <p className="mt-1 text-xs font-semibold text-[var(--rc-navy)]">
                    Top Chef
                  </p>
                ) : null}
                {restau.etoiles_michelin > 0 && (
                  <p className="mt-1 text-sm text-[var(--rc-ruby)]">
                    {"★".repeat(restau.etoiles_michelin)} Michelin (
                    {restau.etoiles_michelin}{" "}
                    {restau.etoiles_michelin > 1 ? "étoiles" : "étoile"})
                  </p>
                )}
                {restau.telephone ? (
                  <a
                    href={`tel:${restau.telephone.replace(/\s/g, "")}`}
                    className="mt-2 block text-xs text-blue-600 underline"
                  >
                    {restau.telephone}
                  </a>
                ) : null}
                {restau.email ? (
                  <a
                    href={`mailto:${restau.email}`}
                    className="mt-1 block text-xs text-blue-600 underline"
                  >
                    {restau.email}
                  </a>
                ) : null}
                {restau.restaurant_adresse ? (
                  <p className="mt-2 text-xs leading-snug text-gray-600">
                    {restau.restaurant_adresse}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-2 border-t border-gray-100 pt-2">
                  <a
                    href={googleDirectionsUrl(
                      restau.latitude,
                      restau.longitude
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-red-700 underline"
                  >
                    Itinéraire
                  </a>
                  <a
                    href={googleStreetViewUrl(
                      restau.latitude,
                      restau.longitude
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-red-700 underline"
                  >
                    Street View
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
