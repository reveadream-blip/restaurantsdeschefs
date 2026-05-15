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
      aria-labelledby="site-footer-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <Link
            href="/"
            className="group flex flex-col items-center gap-3 text-center sm:items-start sm:text-left"
          >
            <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface-elevated)] p-2 shadow-[var(--rc-shadow-soft)] transition group-hover:border-[var(--rc-gold)]/40">
              <Image
                src="/logo-restaurants-des-chefs.png"
                alt="Restaurants des Chefs"
                width={56}
                height={56}
                className="h-auto w-full object-contain"
              />
            </span>
            <span>
              <span
                id="site-footer-heading"
                className="font-display text-lg font-semibold tracking-tight text-[var(--rc-text)]"
              >
                Restaurants des Chefs
              </span>
              <span className="mt-1 block text-xs font-light leading-relaxed text-[var(--rc-text-muted)]">
                L&apos;annuaire des Grands Chefs
              </span>
            </span>
          </Link>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm sm:pt-2"
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
