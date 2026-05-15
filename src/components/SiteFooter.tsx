import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Annuaire" },
  { href: "/partenaires", label: "Espace Restaurateurs" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Administration" },
] as const;

export default function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-white/10 bg-[var(--rc-footer)] text-white/90"
      aria-label="Pied de page"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <Link
            href="/"
            className="group shrink-0 rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rc-gold)]"
            aria-label="Restaurants des Chefs - retour a l annuaire"
          >
            <Image
              src="/logo-restaurants-des-chefs.png"
              alt=""
              width={350}
              height={67}
              className="h-8 w-auto opacity-95 transition group-hover:opacity-100 sm:h-9"
            />
          </Link>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm"
            aria-label="Liens du pied de page"
          >
            {FOOTER_LINKS.map((item, i) => (
              <span key={item.href} className="inline-flex items-center">
                {i > 0 ? (
                  <span className="mx-2 text-white/25" aria-hidden>
                    {"\u00b7"}
                  </span>
                ) : null}
                <Link
                  href={item.href}
                  className={
                    item.href === "/contact" || item.href === "/partenaires"
                      ? "font-medium text-[var(--rc-michelin)] underline-offset-2 transition hover:text-white hover:underline"
                      : "font-light text-white/70 underline-offset-2 transition hover:text-white hover:underline"
                  }
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs font-light tracking-wide text-white/55">
          &copy;2026 RestaurantsdesChefs.fr - Tous droits r&eacute;serv&eacute;s.
        </p>
      </div>
    </footer>
  );
}
