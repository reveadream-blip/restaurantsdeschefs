"use client";

import dynamic from 'next/dynamic';
import { Utensils, Star, Phone, Mail } from 'lucide-react';

const ChefMap = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  // Simulation de données (à remplacer par l'appel API D1 plus tard)
  const data = [
    { id: 1, nom_restaurant: "Le Jules Verne", chef_nom: "Frédéric Anton", etoiles_michelin: 3, latitude: 48.8584, longitude: 2.2945, telephone: "01 45 55 61 44" }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          <Utensils className="text-red-600" /> L'Annuaire des Chefs
        </h1>
        <p className="text-gray-500 mt-2">Retrouvez les candidats de Top Chef et les étoilés Michelin sur une carte.</p>
      </header>

      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChefMap restaurants={data} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md overflow-y-auto max-h-[500px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-500" fill="currentColor" /> Derniers ajouts
          </h2>
          {data.map(restau => (
            <div key={restau.id} className="border-b py-4 last:border-0">
              <h3 className="font-semibold text-lg">{restau.chef_nom}</h3>
              <p className="text-sm text-gray-600 italic">{restau.nom_restaurant}</p>
              <div className="flex gap-4 mt-3">
                <a href={`tel:${restau.telephone}`} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <Phone size={18} />
                </a>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <Mail size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}