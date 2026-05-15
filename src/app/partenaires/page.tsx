import type { Metadata } from "next";
import PartenairesPageContent from "@/components/PartenairesPageContent";

export const metadata: Metadata = {
  title: "Espace Restaurateurs — Restaurants des Chefs",
  description:
    "Boostez la visibilité de votre table : packs Visibilité Locale (9 €/mois) et Visibilité Totale (19 €/mois).",
};

export default function PartenairesPage() {
  return <PartenairesPageContent />;
}
