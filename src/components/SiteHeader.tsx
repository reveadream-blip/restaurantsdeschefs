"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { MenuFiltre } from "@/types/restaurant";

const SAISONS_TOP_CHEF = Array.from({ length: 17 }, (_, i) => i + 1);

export type SiteHeaderProps = {
  value: string;
  onChange: (value: string) => void;
  filtre: MenuFiltre;
  onFiltre: (f: MenuFiltre) => void;
  topChefSaison: number | null;
  onTopChefSaison: (n: number | null) => void;
  onCarte: () => void;
  /** Barre fusionnée sur une photo (texte clair, fond transparent). */
  overPhoto?: boolean;
  /** `absolute` = dans un bloc hero `relative` ; `fixed` = au-dessus de toute la page. */
  position?: "fixed" | "absolute";
};

export default function SiteHeader({
  value,
  onChange,
  filtre,
  onFiltre,
  topChefSaison,
  onTopChefSaison,
  onCarte,
  overPhoto = false,
  position = "fixed",
}: SiteHeaderProps) {
  const [ddTop, setDdTop] = useState(false);
  const [ddEtoiles, setDdEtoiles] = useState(false);
  const wrapTop = useRef<HTMLDivElement>(null);
  const wrapEtoiles = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      const t = e.target as Node;
      if (wrapTop.current?.contains(t)) return;
      if (wrapEtoiles.current?.contains(t)) return;
      setDdTop(false);
      setDdEtoiles(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const topChefActif = filtre === "top-chef";
  const etoilesActif =
    filtre === "etoiles" || filtre === "3" || filtre === "2" || filtre === "1";

  const posClass = position === "absolute" ? "absolute" : "fixed";
  const shellPhoto =
    overPhoto &&
    "border-0 bg-transparent shadow-none backdrop-blur-0";
  const shellPage =
    !overPhoto &&
    "border-b border-[var(--rc-border)] bg-[var(--rc-page-bg)]/92 backdrop-blur-md";

  const navBtnBase =
    "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-base";
  const navBtnPhotoInactive = `${navBtnBase} text-white/90 hover:bg-white/10 hover:text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.65)]`;
  const navBtnPhotoActive = `${navBtnBase} bg-white/18 text-white ring-1 ring-white/35 [text-shadow:0_1px_8px_rgba(0,0,0,0.65)]`;
  const navBtnPageInactive = `${navBtnBase} text-[var(--rc-text-muted)] hover:bg-[var(--rc-surface)] hover:text-[var(--rc-text)]`;
  const navBtnPageActive = `${navBtnBase} bg-[var(--rc-gold-soft)] text-[var(--rc-text)] ring-1 ring-[var(--rc-gold)]/40`;

  const carteBtnPhoto =
    "rounded-xl px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.65)] sm:px-4 sm:py-2.5 sm:text-base";
  const carteBtnPage =
    "rounded-xl px-3 py-2 text-sm font-medium text-[var(--rc-text-muted)] transition hover:bg-[var(--rc-surface)] hover:text-[var(--rc-text)] sm:px-4 sm:py-2.5 sm:text-base";

  const menuPanel =
    overPhoto
      ? "rounded-2xl border border-white/15 bg-zinc-950/92 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-md"
      : "rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface-elevated)] py-1.5 shadow-[var(--rc-shadow)]";

  const menuItem =
    overPhoto
      ? "text-white/95 hover:bg-white/10"
      : "text-[var(--rc-text)] hover:bg-[var(--rc-gold-soft)]";

  const menuItemMuted =
    overPhoto
      ? "text-white/75 hover:bg-white/10"
      : "text-[var(--rc-text-muted)]";

  const menuItemActive =
    overPhoto ? "bg-white/15 text-white" : "bg-[var(--rc-gold-soft)] text-[var(--rc-text)]";

  return (
    <header
      className={`${posClass} inset-x-0 top-0 z-50 overflow-visible ${shellPhoto || shellPage}`}
      role="banner"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[1600px] flex-col items-center gap-y-3 overflow-visible px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-3 sm:px-6 sm:py-4 md:px-8">
        <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-start">
          <Image
            src="/logo-restaurants-des-chefs.png"
            alt="Restaurants des Chefs"
            width={400}
            height={108}
            className={`h-9 w-auto max-w-[min(52vw,280px)] sm:h-11 sm:max-w-[320px] md:h-12 md:max-w-[380px] lg:h-[3.35rem] lg:max-w-[420px] ${
              overPhoto
                ? "drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
                : ""
            }`}
            priority
          />
        </div>

        <div
          className="relative w-full min-w-0 max-w-lg shrink-0 sm:max-w-none sm:flex-1 sm:basis-72 md:basis-96 lg:basis-[30rem]"
          role="search"
        >
          <Search
            className={`pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 sm:left-3.5 sm:h-5 sm:w-5 md:left-4 md:h-6 md:w-6 ${
              overPhoto ? "text-white/65" : "text-[var(--rc-text-muted)]"
            }`}
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ville, département, chef, restaurant…"
            className={
              overPhoto
                ? "w-full rounded-2xl border border-white/30 bg-black/25 py-3 pl-11 pr-3 text-sm font-light text-white outline-none ring-0 backdrop-blur-sm transition placeholder:text-white/55 focus:border-white/55 focus:ring-2 focus:ring-white/20 sm:py-3.5 sm:pl-12 sm:text-base md:py-4 md:pl-14 md:text-[1.0625rem] [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
                : "w-full rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-surface-elevated)] py-3 pl-11 pr-3 text-sm font-light text-[var(--rc-text)] outline-none ring-0 transition placeholder:text-[var(--rc-text-muted)] focus:border-[var(--rc-gold)] focus:ring-2 focus:ring-[var(--rc-gold-soft)] sm:py-3.5 sm:pl-12 sm:text-base md:py-4 md:pl-14 md:text-[1.0625rem]"
            }
            aria-label="Rechercher des établissements"
          />
        </div>

        <nav
          aria-label="Navigation principale"
          className="flex w-full shrink-0 flex-wrap items-center justify-center gap-2 overflow-visible sm:w-auto sm:justify-end sm:gap-3 md:gap-4"
        >
          <div className="relative z-[55] overflow-visible" ref={wrapTop}>
            <button
              type="button"
              onClick={() => {
                setDdEtoiles(false);
                setDdTop((v) => !v);
              }}
              className={
                topChefActif
                  ? overPhoto
                    ? navBtnPhotoActive
                    : navBtnPageActive
                  : overPhoto
                    ? navBtnPhotoInactive
                    : navBtnPageInactive
              }
              aria-expanded={ddTop}
              aria-haspopup="true"
            >
              Top Chef
              {topChefActif && topChefSaison != null ? (
                <span
                  className={`hidden font-light sm:inline ${
                    overPhoto ? "text-white/70" : "text-[var(--rc-text-muted)]"
                  }`}
                >
                  {" "}
                  · S.{topChefSaison}
                </span>
              ) : null}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[var(--rc-gold)] transition sm:h-5 sm:w-5 ${ddTop ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {ddTop ? (
              <div
                className={`absolute left-0 top-[calc(100%+6px)] z-[60] max-h-[min(70vh,420px)] w-[min(calc(100vw-2rem),300px)] overflow-y-auto overscroll-contain sm:left-auto sm:right-0 sm:w-60 ${menuPanel}`}
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  className={`block w-full px-4 py-2.5 text-left text-sm font-medium sm:text-base ${menuItem}`}
                  onClick={() => {
                    onTopChefSaison(null);
                    onFiltre("top-chef");
                    setDdTop(false);
                  }}
                >
                  Toutes saisons
                </button>
                <div
                  className={`my-1 border-t ${overPhoto ? "border-white/15" : "border-[var(--rc-border)]"}`}
                  aria-hidden
                />
                {SAISONS_TOP_CHEF.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="menuitem"
                    className={`block w-full px-4 py-2 text-left text-sm font-light sm:text-base ${
                      topChefActif && topChefSaison === s
                        ? menuItemActive
                        : menuItemMuted
                    }`}
                    onClick={() => {
                      onTopChefSaison(s);
                      onFiltre("top-chef");
                      setDdTop(false);
                    }}
                  >
                    Saison {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative z-[55] overflow-visible" ref={wrapEtoiles}>
            <button
              type="button"
              onClick={() => {
                setDdTop(false);
                setDdEtoiles((v) => !v);
              }}
              className={
                etoilesActif
                  ? overPhoto
                    ? navBtnPhotoActive
                    : navBtnPageActive
                  : overPhoto
                    ? navBtnPhotoInactive
                    : navBtnPageInactive
              }
              aria-expanded={ddEtoiles}
              aria-haspopup="true"
            >
              Chefs étoilés
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[var(--rc-gold)] transition sm:h-5 sm:w-5 ${ddEtoiles ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {ddEtoiles ? (
              <div
                className={`absolute left-0 top-[calc(100%+6px)] z-[60] w-[min(calc(100vw-2rem),16rem)] sm:left-auto sm:right-0 sm:w-56 ${menuPanel}`}
                role="menu"
              >
                {(
                  [
                    { id: "3" as const, label: "3 étoiles" },
                    { id: "2" as const, label: "2 étoiles" },
                    { id: "1" as const, label: "1 étoile" },
                  ] as const
                ).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    role="menuitem"
                    className={`block w-full px-4 py-2.5 text-left text-sm font-light sm:text-base ${
                      filtre === id
                        ? `${menuItemActive} font-medium`
                        : overPhoto
                          ? menuItemMuted
                          : "text-[var(--rc-text)] hover:bg-[var(--rc-gold-soft)]"
                    }`}
                    onClick={() => {
                      onFiltre(id);
                      setDdEtoiles(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onCarte}
            className={overPhoto ? carteBtnPhoto : carteBtnPage}
          >
            Carte des Chefs
          </button>
        </nav>
      </div>
    </header>
  );
}
