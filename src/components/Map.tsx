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
import { restaurantSponsoring } from "@/lib/restaurantEditorial";
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
  onMarkerSelect,
}: {
  restaurants: Restaurant[];
  /** Clic sur un pin : sélectionne l’établissement et fait défiler la liste. */
  onMarkerSelect?: (id: number) => void;
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
              icon={
                restaurantSponsoring(restau)
                  ? editorialMarkerIcon
                  : customIcon
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
                      Sponsoring (contenu éditorial)
                    </p>
                  ) : null}
                  {restau.saisons_top_chef &&
                  restau.saisons_top_chef.length > 0 ? (
                    <p className="mt-0.5 text-xs text-gray-500">
                      Saisons {restau.saisons_top_chef.join(", ")}
                    </p>
                  ) : null}
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
                  {restau.candidat_diplome ? (
                    <p className="mt-1 text-xs text-gray-600">
                      <span className="font-medium">Formation :</span>{" "}
                      {restau.candidat_diplome.length > 120
                        ? `${restau.candidat_diplome.slice(0, 120)}…`
                        : restau.candidat_diplome}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2 border-t border-gray-100 pt-2">
                    <a
                      href={googleDirectionsUrl(restau.latitude, restau.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-red-700 underline"
                    >
                      Itinéraire
                    </a>
                    <a
                      href={googleStreetViewUrl(restau.latitude, restau.longitude)}
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
    </div>
  );
}
