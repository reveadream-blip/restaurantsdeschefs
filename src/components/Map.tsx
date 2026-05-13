"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction pour les icônes Leaflet dans Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ChefMap({ restaurants }: { restaurants: any[] }) {
  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={[46.603354, 1.888334]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {restaurants.map((restau) => (
          <Marker key={restau.id} position={[restau.latitude, restau.longitude]} icon={customIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{restau.nom_restaurant}</h3>
                <p className="text-sm text-gray-600">Chef: {restau.chef_nom}</p>
                {restau.etoiles_michelin > 0 && <p className="text-yellow-500">⭐ {restau.etoiles_michelin} Étoile(s)</p>}
                <a href={`tel:${restau.telephone}`} className="text-blue-500 block mt-2 text-xs">{restau.telephone}</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}