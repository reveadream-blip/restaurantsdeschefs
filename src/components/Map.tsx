"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Restaurant } from "@/types/restaurant";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ restaurants }: { restaurants: Restaurant[] }) {
  const map = useMap();

  useEffect(() => {
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
  }, [map, restaurants]);

  return null;
}

export default function ChefMap({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  return (
    <div className="flex h-[520px] w-full flex-col gap-3">
      <div className="h-full min-h-0 w-full flex-1 overflow-hidden rounded-lg shadow-lg">
        <MapContainer
          center={[46.603354, 1.888334]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitBounds restaurants={restaurants} />
          {restaurants.map((restau) => (
            <Marker
              key={restau.id}
              position={[restau.latitude, restau.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className="min-w-[200px] p-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {restau.ville}
                  </p>
                  <h3 className="text-base font-bold">{restau.nom_restaurant}</h3>
                  <p className="text-sm text-gray-700">{restau.chef_nom}</p>
                  {restau.top_chef && (
                    <p className="mt-1 text-xs font-semibold text-orange-600">
                      Top Chef
                    </p>
                  )}
                  {restau.etoiles_michelin > 0 && (
                    <p className="mt-1 text-sm text-amber-600">
                      {"⭐".repeat(restau.etoiles_michelin)} Michelin (
                      {restau.etoiles_michelin}{" "}
                      {restau.etoiles_michelin > 1 ? "étoiles" : "étoile"})
                    </p>
                  )}
                  <a
                    href={`tel:${restau.telephone}`}
                    className="mt-2 block text-xs text-blue-600 underline"
                  >
                    {restau.telephone}
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
