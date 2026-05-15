"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Star, ChefHat, Sparkles, ChevronUp } from "lucide-react";
import { filterRestaurants } from "@/lib/filterRestaurants";
import { fetchRestaurantsForApp } from "@/lib/fetchRestaurantsForApp";
import { restaurantSponsoring } from "@/lib/restaurantEditorial";
import RestaurantFicheDetails from "@/components/RestaurantFicheDetails";
import RestaurantMapPanel from "@/components/RestaurantMapPanel";
import SiteHeader from "@/components/SiteHeader";
import ChefCard from "@/components/ChefCard";
import { googleDirectionsUrl, googleStreetViewUrl } from "@/lib/mapsLinks";
import type { MenuFiltre, Restaurant } from "@/types/restaurant";

const MENU: { id: MenuFiltre; label: string; icon?: typeof Star }[] = [
  { id: "tous", label: "Tout voir", icon: Sparkles },
  { id: "top-chef", label: "Top Chef", icon: ChefHat },
  { id: "3", label: "3 étoiles", icon: Star },
  { id: "2", label: "2 étoiles", icon: Star },
  { id: "1", label: "1 étoile", icon: Star },
];

const listContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

const listItemReduced = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

/** Jusqu’à `n` établissements : sponsoring en priorité, puis tirage au sort. */
function pickRandomRestaurants(list: Restaurant[], n: number): Restaurant[] {
  if (list.length === 0) return [];
  const enriched = list.filter(restaurantSponsoring);
  const others = list.filter((r) => !restaurantSponsoring(r));
  const shuffle = (a: Restaurant[]) => {
    const copy = [...a];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const merged = [...shuffle(enriched), ...shuffle(others)];
  if (merged.length <= n) return merged;
  return merged.slice(0, n);
}

export default function Home() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const itemVariants = reduceMotion ? listItemReduced : listItem;

  const [filtre, setFiltre] = useState<MenuFiltre>("tous");
  const [topChefSaison, setTopChefSaison] = useState<number | null>(null);
  const [recherche, setRecherche] = useState("");
  const [rows, setRows] = useState<Restaurant[]>([]);
  const [source, setSource] = useState<"d1" | "demo" | "local-dev">("demo");
  const [fetchDone, setFetchDone] = useState(false);
  const [apiHint, setApiHint] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  /** La carte et la liste complète ne s’affichent qu’après « Carte des Chefs ». */
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (filtre !== "top-chef") setTopChefSaison(null);
  }, [filtre]);

  const skipFiltreMapScroll = useRef(true);
  useEffect(() => {
    if (!showMap) return;
    if (skipFiltreMapScroll.current) {
      skipFiltreMapScroll.current = false;
      return;
    }
    setSelectedId(null);
    requestAnimationFrame(() => {
      document.getElementById("carte-etablissements")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [filtre, topChefSaison, showMap]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { rows: list, source: src, apiHint: hint } =
        await fetchRestaurantsForApp();
      if (cancelled) return;
      setRows(list);
      setSource(src);
      setApiHint(hint);
      setFetchDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rechercheDeferred = useDeferredValue(recherche);
  const affiche = useMemo(() => {
    const f = filterRestaurants(rows, filtre, rechercheDeferred, topChefSaison);
    const enriched = f.filter(restaurantSponsoring);
    const others = f.filter((r) => !restaurantSponsoring(r));
    return [...enriched, ...others];
  }, [rows, filtre, rechercheDeferred, topChefSaison]);

  const dixAleatoires = useMemo(
    () => pickRandomRestaurants(affiche, 10),
    [affiche]
  );

  const scrollToCarte = () => {
    setShowMap(true);
    requestAnimationFrame(() => {
      document.getElementById("carte-etablissements")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  /** Sélection affichée : garde l’intention utilisateur si l’id est encore dans la liste, sinon première fiche. */
  const effectiveSelectedId = useMemo(() => {
    if (affiche.length === 0) return null;
    if (selectedId != null && affiche.some((r) => r.id === selectedId)) {
      return selectedId;
    }
    return affiche[0].id;
  }, [affiche, selectedId]);

  const afficheRef = useRef(affiche);
  useEffect(() => {
    afficheRef.current = affiche;
  }, [affiche]);

  /** Défile la liste seulement après un choix explicite (fiche ou liste déroulante), pas au changement de filtre. */
  useEffect(() => {
    if (selectedId == null) return;
    if (!afficheRef.current.some((r) => r.id === selectedId)) return;
    const el = document.getElementById(`liste-fiche-${selectedId}`);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    });
  }, [selectedId]);

  const listAnimKey = `${filtre}-${rechercheDeferred}-${
    filtre === "top-chef" ? String(topChefSaison ?? "all") : ""
  }`;

  return (
    <>
      <section aria-label="Paris la nuit" className="relative w-full">
        <div className="relative min-h-[100svh] w-full bg-black">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/hero-caption.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55"
          />

          <SiteHeader
            position="absolute"
            overPhoto
            value={recherche}
            onChange={setRecherche}
            filtre={filtre}
            onFiltre={setFiltre}
            topChefSaison={topChefSaison}
            onTopChefSaison={setTopChefSaison}
            onCarte={scrollToCarte}
          />

          <div className="pointer-events-none absolute inset-0 z-[1] flex min-h-[100svh] flex-col pt-[min(30vh,14rem)] sm:pt-[min(26vh,12rem)] md:pt-[min(24vh,11rem)]">
            <div className="flex flex-1 flex-col items-center justify-center px-5 pb-16 text-center sm:px-8 sm:pb-24">
              <h1 className="max-w-5xl font-sans text-[2rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl [text-shadow:0_2px_32px_rgba(0,0,0,0.88)]">
                L&apos;annuaire des Grands Chefs
              </h1>
              <p className="mt-5 max-w-3xl font-sans text-base font-light leading-relaxed text-white/95 sm:mt-6 sm:text-xl md:text-2xl [text-shadow:0_1px_16px_rgba(0,0,0,0.8)]">
                Trouvez facilement les restaurants des chefs étoilés Michelin,
                des candidats Top Chef et explorez la carte des tables.
              </p>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rc-glass-border)] bg-[var(--rc-glass)] text-[var(--rc-gold)] shadow-[var(--rc-shadow)] backdrop-blur-xl backdrop-saturate-150 transition hover:border-[var(--rc-gold)] hover:bg-[var(--rc-gold-soft)] active:scale-95 lg:hidden"
        aria-label={
          showMap ? "Remonter à la carte" : "Afficher la carte des chefs"
        }
        onClick={() => {
          if (showMap) {
            document.getElementById("carte-etablissements")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            scrollToCarte();
          }
        }}
      >
        <ChevronUp
          className="h-6 w-6 text-[var(--rc-gold)]"
          strokeWidth={2}
          aria-hidden
        />
      </button>

      <main className="min-h-screen bg-rc-page pb-12 max-lg:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 border-b border-[var(--rc-border)] pb-8 pt-8 sm:mb-10 sm:pb-10 sm:pt-10">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--rc-text-muted)]">
              Sélection
            </p>
            <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[var(--rc-text)] sm:text-[2.35rem] sm:leading-[1.12]">
              L&apos;annuaire des Grands Chefs
            </h1>
            <p className="mt-3 max-w-2xl font-light leading-relaxed text-[var(--rc-text-muted)] sm:text-[1.0625rem]">
              Tables Michelin et maisons Top Chef : explorez la carte, affinez
              par étoiles ou recherchez par ville, département ou chef.
            </p>

            {!fetchDone ? (
              <p className="mt-4 text-xs font-light text-[var(--rc-gold)]">
                Chargement des données…
              </p>
            ) : source === "d1" ? null : (
              <p
                className={`mt-4 text-xs font-light leading-relaxed ${
                  source === "local-dev"
                    ? "text-[var(--rc-text-muted)]"
                    : "text-[var(--rc-ruby)]"
                }`}
              >
                {source === "local-dev"
                  ? "Développement local : l’API Cloudflare n’est pas servie ici — données de référence du dépôt. Pour D1 : npm run pages:dev."
                  : "Mode démonstration : l’API n’a pas renvoyé d’établissements exploitables. Pour un jeu de démo : npm run db:seed:demo."}
              </p>
            )}
            {fetchDone && apiHint != null && source !== "local-dev" ? (
              <p className="mt-2 max-w-2xl text-xs font-light leading-relaxed text-[var(--rc-ruby)]">
                {apiHint}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {!showMap && fetchDone && rows.length > 0 ? (
                <button
                  type="button"
                  onClick={scrollToCarte}
                  className="inline-flex items-center rounded-full border border-[var(--rc-gold)] bg-[var(--rc-gold-soft)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--rc-text)] transition hover:bg-[var(--rc-gold)] hover:text-white sm:text-[0.8125rem]"
                >
                  Carte des chefs
                </button>
              ) : null}
            </div>

            <nav
              className="mt-8 flex flex-wrap gap-2"
              aria-label="Filtrer par catégorie"
            >
              {MENU.map((item) => {
                const Icon = item.icon ?? Star;
                const actif = filtre === item.id;
                const isTopChef = item.id === "top-chef";
                const isStar =
                  item.id === "1" || item.id === "2" || item.id === "3";
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFiltre(item.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.14em] transition sm:text-[0.8125rem] ${
                      actif
                        ? `font-medium ${
                            isTopChef
                              ? "border-[var(--rc-ruby)] bg-[var(--rc-ruby)] text-white shadow-md"
                              : isStar
                                ? "border-[var(--rc-gold)] bg-[var(--rc-gold)] text-white shadow-md"
                                : "border-[var(--rc-text)] bg-[var(--rc-text)] text-[var(--rc-page-bg)] shadow-md"
                          }`
                        : "font-light border-[var(--rc-border)] bg-[var(--rc-surface)] text-[var(--rc-text-muted)] hover:border-[var(--rc-border-strong)] hover:text-[var(--rc-text)]"
                    }`}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0"
                      fill={item.id !== "tous" && actif ? "currentColor" : "none"}
                      strokeWidth={1.75}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div
              className="relative mt-6 w-full max-w-2xl sm:mt-8"
              role="search"
              aria-label="Affiner la recherche"
            >
              <Image
                src="/top-chef-icon.png"
                alt=""
                width={192}
                height={192}
                className="pointer-events-none absolute left-2.5 top-1/2 z-[1] h-7 w-7 -translate-y-1/2 rounded-md object-contain sm:left-3 sm:h-8 sm:w-8"
                aria-hidden
              />
              <input
                type="search"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Ville, département, chef, restaurant…"
                className="w-full rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface-elevated)] py-2.5 pl-11 pr-3 text-sm font-light text-[var(--rc-text)] outline-none transition placeholder:text-[var(--rc-text-muted)] focus:border-[var(--rc-gold)] focus:ring-2 focus:ring-[var(--rc-gold-soft)] sm:py-3 sm:pl-[3.25rem] sm:text-[0.9375rem] md:pl-14"
                aria-label="Rechercher près de la carte"
              />
            </div>
          </header>

          <section className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            {!showMap ? (
              <div
                id="selection-aleatoire"
                className="scroll-mt-6 space-y-6 lg:col-span-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-[var(--rc-text)] sm:text-2xl">
                    <Sparkles
                      className="h-5 w-5 text-[var(--rc-gold)]"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    10 tables au hasard
                  </h2>
                  <p className="max-w-xl text-sm font-light text-[var(--rc-text-muted)]">
                    Un aperçu de l’annuaire. Utilisez les filtres puis{" "}
                    <button
                      type="button"
                      onClick={scrollToCarte}
                      className="font-medium text-[var(--rc-ruby)] underline-offset-2 hover:underline"
                    >
                      Carte des chefs
                    </button>{" "}
                    pour afficher la carte et toute la liste.
                  </p>
                  <p className="flex items-start gap-2 text-xs font-light text-[var(--rc-text-muted)] sm:max-w-xl">
                    <Sparkles
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rc-gold)]"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span>
                      Les cartes au contour doré et le libellé « Sponsoring »
                      indiquent un établissement mis en avant (case cochée
                      dans l’administration).
                    </span>
                  </p>
                </div>

                {!fetchDone ? (
                  <p className="text-sm font-light text-[var(--rc-gold)]">
                    Chargement des fiches…
                  </p>
                ) : affiche.length === 0 ? (
                  <p className="text-sm font-light text-[var(--rc-text-muted)]">
                    Aucun résultat avec ces critères. Ajustez la recherche ou les
                    filtres pour afficher des fiches, puis ouvrez la carte des
                    chefs.
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 gap-5 pb-8 sm:grid-cols-2 xl:grid-cols-2">
                    {dixAleatoires.map((restau) => {
                      const editorial = restaurantSponsoring(restau);
                      return (
                      <li key={restau.id} className="scroll-mt-6">
                        <div
                          className={`overflow-hidden rounded-[var(--rc-radius-xl)] bg-[var(--rc-surface)] shadow-[var(--rc-shadow)] transition-[box-shadow,border-color] duration-300 ${
                            editorial
                              ? "border border-[var(--rc-gold)]/80 ring-1 ring-[var(--rc-gold)]/30 shadow-md"
                              : "border border-[var(--rc-border)] hover:border-[var(--rc-border-strong)]"
                          }`}
                        >
                          <ChefCard
                            restaurant={restau}
                            onSelect={() =>
                              router.push(`/restaurant?id=${restau.id}`)
                            }
                          />
                          <RestaurantFicheDetails restaurant={restau} />
                          <div
                            className="flex gap-1 border-t border-[var(--rc-border)] bg-[var(--rc-surface)] p-1"
                            role="tablist"
                            aria-label={`Plans — ${restau.nom_restaurant}`}
                          >
                            <a
                              href={googleDirectionsUrl(
                                restau.latitude,
                                restau.longitude
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--rc-page-bg)] px-2 py-2.5 text-center text-xs font-light uppercase tracking-[0.12em] text-[var(--rc-text)] transition hover:bg-[var(--rc-gold-soft)]"
                            >
                              Itinéraire
                            </a>
                            <a
                              href={googleStreetViewUrl(
                                restau.latitude,
                                restau.longitude
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--rc-page-bg)] px-2 py-2.5 text-center text-xs font-light uppercase tracking-[0.12em] text-[var(--rc-text)] transition hover:bg-[var(--rc-gold-soft)]"
                            >
                              Street View
                            </a>
                          </div>
                        </div>
                      </li>
                    );
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <>
                <div
                  id="carte-etablissements"
                  className="flex min-w-0 scroll-mt-6 flex-col gap-6 lg:col-span-2"
                >
                  <RestaurantMapPanel
                    restaurants={affiche}
                    selectedId={effectiveSelectedId}
                    onSelectId={setSelectedId}
                  />

                  <p className="text-center text-sm font-light text-[var(--rc-text-muted)]">
                    {affiche.length === 0
                      ? "Aucun établissement ne correspond aux critères."
                      : `${affiche.length} établissement${affiche.length > 1 ? "s" : ""} affiché${affiche.length > 1 ? "s" : ""}`}
                    {recherche.trim() || filtre !== "tous"
                      ? " — filtre ou recherche actif."
                      : ""}
                  </p>
                </div>

                <aside
                  id="liste-tables"
                  className="min-h-0 scroll-mt-6 lg:max-h-[min(85vh,920px)] lg:overflow-y-auto"
                >
                  <div className="sticky top-24 space-y-5">
                    <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-[var(--rc-text)] sm:text-2xl">
                      <Star
                        className="h-5 w-5 text-[var(--rc-gold)]"
                        fill="currentColor"
                        strokeWidth={0}
                        aria-hidden
                      />
                      Tables
                    </h2>

                    {affiche.length === 0 ? (
                      <p className="text-sm font-light leading-relaxed text-[var(--rc-text-muted)]">
                        Aucun résultat. Essayez un autre filtre ou une autre
                        recherche.
                      </p>
                    ) : (
                      <motion.ul
                        key={listAnimKey}
                        className="flex flex-col gap-5 pb-8"
                        variants={listContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {affiche.map((restau) => {
                          const highlighted = selectedId === restau.id;
                          const editorial = restaurantSponsoring(restau);
                          return (
                            <motion.li
                              id={`liste-fiche-${restau.id}`}
                              key={restau.id}
                              className="scroll-mt-6"
                              variants={itemVariants}
                            >
                              <div
                                className={`overflow-hidden rounded-[var(--rc-radius-xl)] bg-[var(--rc-surface)] shadow-[var(--rc-shadow)] transition-[box-shadow,border-color] duration-300 ${
                                  highlighted
                                    ? "border border-[var(--rc-gold)] ring-2 ring-[var(--rc-gold-soft)] ring-offset-2 ring-offset-[var(--rc-page-bg)]"
                                    : editorial
                                      ? "border border-[var(--rc-gold)]/80 ring-1 ring-[var(--rc-gold)]/30 shadow-md"
                                      : "border border-[var(--rc-border)] hover:border-[var(--rc-border-strong)]"
                                }`}
                              >
                                <ChefCard
                                  restaurant={restau}
                                  onSelect={() =>
                                    router.push(`/restaurant?id=${restau.id}`)
                                  }
                                />
                                <RestaurantFicheDetails restaurant={restau} />
                                <div
                                  className="flex gap-1 border-t border-[var(--rc-border)] bg-[var(--rc-surface)] p-1"
                                  role="tablist"
                                  aria-label={`Plans — ${restau.nom_restaurant}`}
                                >
                                  <a
                                    href={googleDirectionsUrl(
                                      restau.latitude,
                                      restau.longitude
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--rc-page-bg)] px-2 py-2.5 text-center text-xs font-light uppercase tracking-[0.12em] text-[var(--rc-text)] transition hover:bg-[var(--rc-gold-soft)]"
                                  >
                                    Itinéraire
                                  </a>
                                  <a
                                    href={googleStreetViewUrl(
                                      restau.latitude,
                                      restau.longitude
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--rc-page-bg)] px-2 py-2.5 text-center text-xs font-light uppercase tracking-[0.12em] text-[var(--rc-text)] transition hover:bg-[var(--rc-gold-soft)]"
                                  >
                                    Street View
                                  </a>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </div>
                </aside>
              </>
            )}
          </section>
        </div>
        <p className="mt-10 border-t border-[var(--rc-border)] pt-8 text-center text-xs font-light text-[var(--rc-text-muted)]">
          <Link
            href="/admin"
            className="text-[var(--rc-text-muted)] underline-offset-2 hover:text-[var(--rc-text)] hover:underline"
          >
            Administration des fiches
          </Link>
        </p>
      </main>
    </>
  );
}
