"use client";

import Image from "next/image";
import { Search } from "lucide-react";

export type FloatingSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Barre de recherche « flottante » en tête de page (glassmorphism),
 * mobile first — reste accessible au scroll (position fixe).
 */
export default function FloatingSearchBar({
  value,
  onChange,
}: FloatingSearchBarProps) {
  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2"
      role="search"
    >
      <div className="pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-[var(--rc-radius-xl)] border border-[var(--rc-glass-border)] bg-[var(--rc-glass)] px-3 py-2.5 shadow-[var(--rc-shadow)] backdrop-blur-xl backdrop-saturate-150 sm:gap-4 sm:px-4 sm:py-3">
        <Image
          src="/android-chrome-192x192.png"
          alt=""
          width={36}
          height={36}
          className="hidden h-9 w-9 shrink-0 rounded-lg object-contain opacity-95 sm:block"
        />
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-[var(--rc-text-muted)]"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ville, département, chef, restaurant…"
            className="w-full rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface-elevated)]/95 py-2.5 pl-10 pr-3 text-sm font-light text-[var(--rc-text)] outline-none ring-0 transition placeholder:text-[var(--rc-text-muted)] placeholder:font-light focus:border-[var(--rc-gold)] focus:bg-[var(--rc-surface-elevated)] focus:ring-2 focus:ring-[var(--rc-gold-soft)] sm:py-3 sm:pl-11 sm:text-[0.9375rem]"
            aria-label="Rechercher des établissements"
          />
        </div>
      </div>
    </header>
  );
}
