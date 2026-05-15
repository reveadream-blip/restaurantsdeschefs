import Link from "next/link";
import { Check, MapPin, Sparkles, Star } from "lucide-react";

const PACKS = [
  {
    id: "local",
    name: "Visibilité Locale",
    price: "9",
    highlight: false,
    features: [
      "Priorité en tête des résultats lors d’une recherche dans votre ville",
      "Badge « Sponsorisé » sur la carte et la fiche publique",
      "Contour doré dans l’annuaire",
      "Idéal pour capter une clientèle de proximité",
    ],
  },
  {
    id: "total",
    name: "Visibilité Totale",
    price: "19",
    highlight: true,
    features: [
      "Tout le pack Visibilité Locale",
      "Mise en avant ville et département dans les recherches",
      "Éligibilité aux 10 tables mises en avant sur la page d’accueil",
      "Fiche complète : description, photos, vidéo, menu et couverture",
      "Priorité maximale dans les listes",
    ],
  },
] as const;

export default function PartenairesPageContent() {
  return (
    <div className="min-h-screen bg-[var(--rc-page-bg)]">
      <header className="border-b border-[var(--rc-border)] bg-[var(--rc-surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-serif-luxe text-lg font-semibold tracking-tight text-[var(--rc-text)]"
          >
            Restaurants des Chefs
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--rc-ruby)] underline-offset-2 hover:underline"
          >
            ← Retour à l’annuaire
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rc-gold)]">
          Espace restaurateurs
        </p>
        <h1 className="font-serif-luxe mt-3 text-center text-3xl font-semibold tracking-tight text-[var(--rc-text)] sm:text-4xl md:text-5xl">
          Faites briller votre table
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base font-light leading-relaxed text-[var(--rc-text-muted)] sm:text-lg">
          Rejoignez l’annuaire des chefs étoilés et Top Chef. Choisissez un pack
          mensuel sans engagement technique : nous activons votre visibilité après
          validation de votre fiche.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PACKS.map((pack) => (
            <article
              key={pack.id}
              className={`relative flex flex-col rounded-[var(--rc-radius-xl)] border p-6 shadow-[var(--rc-shadow-soft)] sm:p-8 ${
                pack.highlight
                  ? "border-[var(--rc-gold)]/60 bg-gradient-to-b from-[var(--rc-surface)] to-[var(--rc-gold-soft)]/30 ring-1 ring-[var(--rc-gold)]/25"
                  : "border-[var(--rc-border)] bg-[var(--rc-surface)]"
              }`}
            >
              {pack.highlight ? (
                <span className="absolute -top-3 left-6 rounded-full bg-[var(--rc-navy)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
                  Recommandé
                </span>
              ) : null}
              <div className="flex items-center gap-2">
                {pack.id === "total" ? (
                  <Sparkles
                    className="h-5 w-5 text-[var(--rc-gold)]"
                    strokeWidth={2}
                    aria-hidden
                  />
                ) : (
                  <MapPin
                    className="h-5 w-5 text-[var(--rc-ruby)]"
                    strokeWidth={2}
                    aria-hidden
                  />
                )}
                <h2 className="font-serif-luxe text-xl font-semibold text-[var(--rc-text)]">
                  {pack.name}
                </h2>
              </div>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-serif-luxe text-4xl font-semibold text-[var(--rc-text)]">
                  {pack.price}€
                </span>
                <span className="text-sm font-light text-[var(--rc-text-muted)]">
                  / mois
                </span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {pack.features.map((f) => (
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
              <a
                href={`mailto:reveadream@gmail.com?subject=${encodeURIComponent(`Pack ${pack.name} — Restaurants des Chefs`)}`}
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  pack.highlight
                    ? "bg-[var(--rc-navy)] text-white hover:opacity-90"
                    : "border border-[var(--rc-border-strong)] bg-[var(--rc-page-bg)] text-[var(--rc-text)] hover:border-[var(--rc-gold)]"
                }`}
              >
                Demander ce pack
              </a>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-[var(--rc-radius-xl)] border border-[var(--rc-border)] bg-[var(--rc-surface)] p-6 sm:p-8">
          <h2 className="font-serif-luxe flex items-center gap-2 text-xl font-semibold text-[var(--rc-text)]">
            <Star
              className="h-5 w-5 text-[var(--rc-gold)]"
              fill="currentColor"
              strokeWidth={0}
              aria-hidden
            />
            Comment ça marche ?
          </h2>
          <ol className="mt-5 space-y-4 text-sm font-light leading-relaxed text-[var(--rc-text-muted)]">
            <li>
              <strong className="font-medium text-[var(--rc-text)]">1.</strong>{" "}
              Vous nous contactez par e-mail avec le nom de votre établissement.
            </li>
            <li>
              <strong className="font-medium text-[var(--rc-text)]">2.</strong>{" "}
              Nous créons ou enrichissons votre fiche (texte, photos, vidéo, menu).
            </li>
            <li>
              <strong className="font-medium text-[var(--rc-text)]">3.</strong>{" "}
              Votre pack est activé dans l’administration : visibilité immédiate
              dans l’annuaire.
            </li>
          </ol>
          <p className="mt-6 text-xs text-[var(--rc-text-muted)]">
            Paiement et facturation : à convenir par e-mail. Les tarifs indiqués
            sont des abonnements mensuels indicatifs.
          </p>
        </section>
      </main>
    </div>
  );
}
