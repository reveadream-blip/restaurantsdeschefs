import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Annuaire" },
  { href: "/partenaires", label: "Espace Restaurateurs" },
  { href: "/admin", label: "Administration" },
] as const;

export default function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-[var(--rc-border)] bg-gradient-to-b from-[var(--rc-surface)] via-[var(--rc-page-bg)] to-[var(--rc-navy-soft)]/50"
      aria-label="Pied de page"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <Link
            href="/"
            className="group shrink-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rc-gold)]"
            aria-label="Restaurants des Chefs - retour a l annuaire"
          >
            <span className="block overflow-hidden rounded-xl bg-black px-4 py-2.5 shadow-[var(--rc-shadow-soft)] ring-1 ring-black/10 transition group-hover:ring-[var(--rc-gold)]/50">
              <Image
                src="/logo-restaurants-des-chefs.png"
                alt=""
                width={350}
                height={67}
                className="h-7 w-auto sm:h-8"
              />
            </span>
          </Link>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm"
            aria-label="Liens du pied de page"
          >
            {FOOTER_LINKS.map((item, i) => (
              <span key={item.href} className="inline-flex items-center">
                {i > 0 ? (
                  <span
                    className="mx-2 text-[var(--rc-border-strong)]"
                    aria-hidden
                  >
                    {"\u00b7"}
                  </span>
                ) : null}
                <Link
                  href={item.href}
                  className={
                    item.href === "/partenaires"
                      ? "font-medium text-[var(--rc-gold)] underline-offset-2 transition hover:underline"
                      : "font-light text-[var(--rc-text-muted)] underline-offset-2 transition hover:text-[var(--rc-text)] hover:underline"
                  }
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <p className="mt-8 border-t border-[var(--rc-border)] pt-6 text-center text-xs font-light tracking-wide text-[var(--rc-text-muted)]">
          &copy;2026 RestaurantsdesChefs.fr - Tous droits r&eacute;serv&eacute;s.
        </p>
      </div>
    </footer>
  );
}
