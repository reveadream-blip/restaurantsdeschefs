import Link from "next/link";
import { Check, Gem } from "lucide-react";

const MARQUE_FEATURES = [
  "Bannière dans l’annuaire toutes les 5 fiches (logo ou visuel cliquable)",
  "Fiche dédiée sur la page Partenaires avec votre marque",
  "Lien vers votre site ou campagne",
  "Visibilité auprès d’une audience passionnée de gastronomie",
  "Mise en page soignée, charte luxe (Playfair Display & Inter)",
] as const;

const MAIL_SUBJECT = "Pack Partenariat de marque 19€ — Restaurants des Chefs";

export default function PartenariatMarquePackCard() {
  return (
    <article
      className="relative flex flex-col rounded-[var(--rc-radius-xl)] border border-[var(--rc-navy)]/25 bg-gradient-to-br from-[var(--rc-surface)] via-[var(--rc-page-bg)] to-[var(--rc-navy-soft)]/40 p-6 shadow-[var(--rc-shadow)] sm:p-8"
      aria-labelledby="pack-marque-titre"
    >
      <span className="mb-4 inline-flex w-fit rounded-full bg-[var(--rc-ruby)] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
        Marques & maisons
      </span>

      <div className="flex items-center gap-2">
        <Gem
          className="h-5 w-5 text-[var(--rc-gold)]"
          strokeWidth={2}
          aria-hidden
        />
        <h2
          id="pack-marque-titre"
          className="font-serif-luxe text-xl font-semibold text-[var(--rc-text)] sm:text-2xl"
        >
          Partenariat de marque
        </h2>
      </div>

      <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-[var(--rc-text-muted)]">
        Associez votre marque, produit ou maison à l’univers des grands chefs :
        visibilité discrète mais premium dans l’annuaire et sur cette page.
      </p>

      <p className="mt-6 flex items-baseline gap-1">
        <span className="font-serif-luxe text-4xl font-semibold text-[var(--rc-text)] sm:text-5xl">
          19€
        </span>
        <span className="text-sm font-light text-[var(--rc-text-muted)]">
          / mois
        </span>
      </p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {MARQUE_FEATURES.map((f) => (
          <li
            key={f}
            className="flex gap-2 text-sm font-light leading-relaxed text-[var(--rc-text)]"
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--rc-gold)]"
              strokeWidth={2.5}
              aria-hidden
            />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/contact?subject=${encodeURIComponent(MAIL_SUBJECT)}`}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--rc-navy)] px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:opacity-90"
      >
        Demander le partenariat marque
      </Link>
    </article>
  );
}
