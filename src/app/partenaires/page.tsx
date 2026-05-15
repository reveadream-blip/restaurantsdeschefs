import type { Metadata } from "next";
import PartenairesPageContent from "@/components/PartenairesPageContent";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Espace Restaurateurs — Restaurants des Chefs",
  description:
    "Boostez la visibilité de votre table : packs Visibilité Locale (9 €/mois) et Visibilité Totale (19 €/mois).",
  alternates: {
    canonical: absoluteUrl("/partenaires"),
  },
  openGraph: {
    url: absoluteUrl("/partenaires"),
  },
};

export default function PartenairesPage() {
  return <PartenairesPageContent />;
}
