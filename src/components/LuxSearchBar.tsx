"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export type LuxSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Variante sur photo hero (texte clair). */
  overPhoto?: boolean;
  className?: string;
  inputClassName?: string;
  "aria-label"?: string;
};

export default function LuxSearchBar({
  value,
  onChange,
  placeholder = "Ville, département, chef, restaurant…",
  overPhoto = false,
  className = "",
  inputClassName = "",
  "aria-label": ariaLabel = "Rechercher des établissements",
}: LuxSearchBarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glass = scrolled && !overPhoto;
  const glassHero = scrolled && overPhoto;

  return (
    <div className={`relative w-full ${className}`} role="search">
      <Search
        className={`pointer-events-none absolute left-4 top-1/2 z-[1] h-5 w-5 -translate-y-1/2 sm:h-[1.15rem] sm:w-[1.15rem] ${
          overPhoto
            ? glassHero
              ? "text-[var(--rc-text-muted)]"
              : "text-white/70"
            : "text-[var(--rc-text-muted)]"
        }`}
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`w-full rounded-full border py-3 pl-12 pr-4 text-sm font-light outline-none transition-all duration-300 sm:py-3.5 sm:pl-[3.25rem] sm:text-base ${
          overPhoto
            ? glassHero
              ? "border-[var(--rc-glass-border)] bg-[var(--rc-glass)] text-[var(--rc-text)] shadow-[var(--rc-shadow)] backdrop-blur-xl placeholder:text-[var(--rc-text-muted)] focus:border-[var(--rc-gold)] focus:ring-2 focus:ring-[var(--rc-gold-soft)]"
              : "border-white/30 bg-black/25 text-white backdrop-blur-md placeholder:text-white/55 focus:border-white/55 focus:ring-2 focus:ring-white/20 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]"
            : glass
              ? "border-[var(--rc-glass-border)] bg-[var(--rc-glass)] text-[var(--rc-text)] shadow-[var(--rc-shadow-soft)] backdrop-blur-xl placeholder:text-[var(--rc-text-muted)] focus:border-[var(--rc-gold)] focus:ring-2 focus:ring-[var(--rc-gold-soft)]"
              : "border-[var(--rc-border)] bg-[var(--rc-surface-elevated)] text-[var(--rc-text)] placeholder:text-[var(--rc-text-muted)] focus:border-[var(--rc-gold)] focus:ring-2 focus:ring-[var(--rc-gold-soft)]"
        } ${inputClassName}`}
      />
    </div>
  );
}
