import type { Metadata } from "next";
import ContactPageContent from "@/components/ContactPageContent";
import { absoluteUrl, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact — ${SITE_TITLE}`,
  description:
    "Contactez l'équipe Restaurants des Chefs : question sur l'annuaire, pack partenaire ou fiche établissement.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  openGraph: {
    title: `Contact — ${SITE_TITLE}`,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
