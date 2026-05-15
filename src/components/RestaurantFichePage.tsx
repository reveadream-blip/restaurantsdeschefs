"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  FileUser,
  MapPin,
  MessageCircle,
  Pencil,
  Star,
} from "lucide-react";
import {
  googleDirectionsUrl,
  googleDirectionsUrlFromOrigin,
  googleMapsEmbedUrl,
  googleStreetViewUrl,
} from "@/lib/mapsLinks";
import { videoEmbedUrl } from "@/lib/videoEmbedUrl";
import { normalizeFichePhotoList } from "@/lib/normalizeFicheMediaUrl";
import type { Restaurant } from "@/types/restaurant";

type TabId = "apropos" | "localisation" | "evenements" | "avis";

const TABS: { id: TabId; label: string; icon: typeof FileUser }[] = [
  { id: "apropos", label: "À propos du Chef", icon: FileUser },
  { id: "localisation", label: "Localisation", icon: MapPin },
  { id: "evenements", label: "Événements", icon: Calendar },
  { id: "avis", label: "Avis", icon: MessageCircle },
];

function SectionBar({ title }: { title: string }) {
  return (
    <div className="w-full bg-[var(--rc-text)] py-2.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-white">
      {title}
    </div>
  );
}

function menusPrixFallbackText(r: Restaurant): string {
  const n = r.etoiles_michelin;
  if (n === 3) return "Gastronomique — fourchette indicative 180 € et +";
  if (n === 2) return "Haute gastronomie — fourchette indicative 95 € à 180 €";
  if (n === 1) return "Gastronomique — fourchette indicative 45 € à 95 €";
  return "Carte et menus sur demande — contactez l’établissement";
}

function FichePhotoImg({
  src,
  priority,
  className,
}: {
  src: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--rc-surface)] text-center text-xs font-light text-[var(--rc-text-muted)] ${className ?? ""}`}
      >
        Image inaccessible
        <span className="sr-only"> ({src})</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- URLs éditoriales arbitraires
    <img
      src={src}
      alt=""
      className={className}
      loading={priority ? "eager" : "lazy"}
      referrerPolicy="no-referrer-when-downgrade"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export default function RestaurantFichePage({ restaurant: r }: { restaurant: Restaurant }) {
  const [tab, setTab] = useState<TabId>("apropos");
  const [itineraireDepart, setItineraireDepart] = useState("");
  const [adminAuth, setAdminAuth] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        let authenticated = false;
        if (res.ok) {
          const data = (await res.json()) as { authenticated?: boolean };
          authenticated = Boolean(data.authenticated);
        }
        if (!cancelled) setAdminAuth(authenticated);
      } catch {
        if (!cancelled) setAdminAuth(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const c = r.fiche_contact;
  const displayChefNom = (c?.chef_nom?.trim() || r.chef_nom).trim();
  const displayNomRestaurant = (c?.nom_restaurant?.trim() || r.nom_restaurant).trim();
  const displayVille = (c?.ville?.trim() || r.ville).trim();
  const displayTelephone = (c?.telephone?.trim() || r.telephone).trim();
  const displayEmail = c?.email?.trim() || r.email;
  const displaySite = c?.site_web?.trim() || r.restaurant_site_web;

  const description = useMemo(() => {
    const f = r.fiche_description?.trim();
    if (f) return f;
    const w = r.wikipedia_intro?.trim();
    if (w) return w;
    const parcours = r.candidat_parcours?.trim();
    if (parcours) return parcours;
    return "Biographie et parcours en cours de constitution pour cette fiche.";
  }, [r.fiche_description, r.wikipedia_intro, r.candidat_parcours]);

  const adresseLigne = useMemo(() => {
    const addr = c?.adresse?.trim() || r.restaurant_adresse;
    const parts = [addr, displayVille].filter(Boolean);
    return parts.length > 0 ? parts.join(" — ") : null;
  }, [c?.adresse, r.restaurant_adresse, displayVille]);

  const photos = useMemo(
    () => normalizeFichePhotoList(r.fiche_photos),
    [r.fiche_photos]
  );
  const videoSrc = r.fiche_video_url
    ? videoEmbedUrl(r.fiche_video_url)
    : null;

  const embedSrc = googleMapsEmbedUrl(r.latitude, r.longitude);

  return (
    <div className="min-h-screen bg-[var(--rc-page-bg)] pb-16">
      <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64">
        <Image
          src="/hero-caption.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-4 pt-10 sm:px-6">
          <Link
            href="/"
            className="w-fit text-xs font-medium uppercase tracking-[0.18em] text-white/90 underline-offset-4 hover:underline"
          >
            ← Retour à l’annuaire
          </Link>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white drop-shadow-md sm:text-3xl md:text-4xl">
            {displayChefNom}
            <span className="block text-base font-normal text-white/85 sm:text-lg">
              {displayNomRestaurant}
            </span>
          </h1>
        </div>
      </div>

      {adminAuth === true ? (
        <div className="border-b border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 py-2.5 text-center sm:px-6">
          <Link
            href={`/admin/fiche?id=${r.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--rc-gold)]/50 bg-[var(--rc-page-bg)] px-4 py-2 text-sm font-medium text-[var(--rc-text)] shadow-sm transition hover:border-[var(--rc-gold)] hover:bg-[var(--rc-surface)]"
          >
            <Pencil className="h-4 w-4 shrink-0 text-[var(--rc-ruby)]" aria-hidden />
            Modifier cette fiche
          </Link>
          <span className="mt-1 block text-xs font-light text-[var(--rc-text-muted)]">
            Session administrateur — accès à l’éditeur pour cet établissement.
          </span>
        </div>
      ) : null}

      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <nav
          className="flex flex-wrap gap-1 rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-1 shadow-sm"
          aria-label="Sections de la fiche"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const actif = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`inline-flex flex-1 min-w-[7.5rem] items-center justify-center gap-2 rounded-md px-3 py-2.5 text-left text-xs font-medium uppercase tracking-[0.1em] transition sm:text-[0.8125rem] ${
                  actif
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-[var(--rc-text-muted)] hover:bg-[var(--rc-page-bg)] hover:text-[var(--rc-text)]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className="leading-tight">{label}</span>
              </button>
            );
          })}
        </nav>

        {tab === "apropos" ? (
          <div className="mt-8 space-y-10">
            <section aria-labelledby="fiche-photos">
              <h2
                id="fiche-photos"
                className="font-display text-xl font-semibold text-[var(--rc-text-muted)] sm:text-2xl"
              >
                Photos
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {photos.length > 0 ? (
                  photos.map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className={`relative overflow-hidden rounded-lg border border-[var(--rc-border)] ${
                        i === 0
                          ? "col-span-2 aspect-[16/10] sm:col-span-2 sm:row-span-2 sm:min-h-[220px]"
                          : "aspect-[4/3]"
                      }`}
                    >
                      <FichePhotoImg
                        src={src}
                        className="h-full w-full object-cover"
                        priority={i === 0}
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-lg border border-[var(--rc-border)] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[220px]">
                      <Image
                        src="/hero-caption.jpg"
                        alt={displayNomRestaurant}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 66vw"
                      />
                    </div>
                    <div
                      aria-hidden
                      className="aspect-[4/3] rounded-lg border border-[var(--rc-border)] bg-[linear-gradient(135deg,#1a1a1a_0%,#2a2418_50%,rgba(154,125,46,0.25)_100%)]"
                    />
                    <div
                      aria-hidden
                      className="aspect-[4/3] rounded-lg border border-[var(--rc-border)] bg-[linear-gradient(225deg,#121212_0%,#2a1818_45%,rgba(196,30,58,0.2)_100%)]"
                    />
                  </>
                )}
              </div>
            </section>

            <section aria-labelledby="fiche-desc-title">
              <h2
                id="fiche-desc-title"
                className="font-display text-xl font-semibold text-[var(--rc-text-muted)] sm:text-2xl"
              >
                Description
              </h2>
              <SectionBar title="Description" />
              <div className="border border-t-0 border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 py-5 sm:px-6">
                <p className="whitespace-pre-wrap font-sans text-sm font-light leading-relaxed text-[var(--rc-text-muted)] sm:text-[0.9375rem]">
                  {description}
                </p>
                {adresseLigne ? (
                  <p className="mt-5 text-sm font-medium text-[var(--rc-text)]">
                    {adresseLigne}
                  </p>
                ) : null}
              </div>
            </section>

            <section aria-labelledby="fiche-menus">
              <h2
                id="fiche-menus"
                className="flex items-baseline gap-2 font-display text-xl font-semibold text-[var(--rc-text)] sm:text-2xl"
              >
                <span className="text-[var(--rc-gold)]" aria-hidden>
                  •
                </span>
                Menus et Prix
              </h2>
              {r.fiche_menu_prix?.trim() ? (
                <div className="mt-3 rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 py-5 shadow-sm sm:px-6">
                  <div className="whitespace-pre-wrap break-words font-sans text-sm font-light leading-[1.65] text-[var(--rc-text)] sm:text-[0.9375rem]">
                    {r.fiche_menu_prix.trim()}
                  </div>
                  <p className="mt-4 border-t border-[var(--rc-border)] pt-4 text-xs font-light leading-relaxed text-[var(--rc-text-muted)]">
                    Tarifs et menus à titre indicatif — selon saison, carte et
                    disponibilités de l’établissement.
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm font-light leading-relaxed text-[var(--rc-text-muted)] sm:text-[0.9375rem]">
                  {menusPrixFallbackText(r)}
                  {" — "}
                  tarifs à titre indicatif, selon saison et carte.
                </p>
              )}
            </section>

            <section aria-labelledby="fiche-video-title">
              <h2
                id="fiche-video-title"
                className="font-display text-xl font-semibold text-[var(--rc-text-muted)] sm:text-2xl"
              >
                Vidéo
              </h2>
              <SectionBar title="Vidéo" />
              <div className="border border-t-0 border-[var(--rc-border)] bg-black/90">
                {videoSrc ? (
                  <iframe
                    title="Vidéo"
                    src={videoSrc}
                    className="aspect-video w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center px-6 text-center">
                    <p className="text-sm font-light text-white/55">
                      Espace vidéo — ajoutez une URL (YouTube ou lien https) dans
                      l’administration des fiches.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section aria-labelledby="fiche-contact-title">
              <h2
                id="fiche-contact-title"
                className="font-display text-xl font-semibold text-[var(--rc-text-muted)] sm:text-2xl"
              >
                Contact
              </h2>
              <SectionBar title="Contact" />
              <ul className="space-y-2 border border-t-0 border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 py-5 text-sm font-light text-[var(--rc-text)] sm:px-6">
                <li>
                  <span className="font-medium">Restaurant :</span>{" "}
                  {displayNomRestaurant}
                </li>
                <li>
                  <span className="font-medium">Téléphone :</span>{" "}
                  <a
                    href={`tel:${displayTelephone.replace(/\s/g, "")}`}
                    className="text-[var(--rc-ruby)] underline-offset-2 hover:underline"
                  >
                    {displayTelephone}
                  </a>
                </li>
                {displayEmail ? (
                  <li>
                    <span className="font-medium">E-mail :</span>{" "}
                    <a
                      href={`mailto:${displayEmail}`}
                      className="text-[var(--rc-ruby)] underline-offset-2 hover:underline"
                    >
                      {displayEmail}
                    </a>
                  </li>
                ) : null}
                {displaySite ? (
                  <li>
                    <span className="font-medium">Site internet :</span>{" "}
                    <a
                      href={displaySite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--rc-ruby)] underline-offset-2 hover:underline"
                    >
                      {displaySite}
                    </a>
                  </li>
                ) : null}
                <li>
                  <span className="font-medium">Chef :</span> {displayChefNom}
                </li>
                <li>
                  <span className="font-medium">Ville :</span> {displayVille}
                </li>
                {r.wikipedia_article_url ? (
                  <li>
                    <span className="font-medium">Wikipédia :</span>{" "}
                    <a
                      href={r.wikipedia_article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--rc-ruby)] underline-offset-2 hover:underline"
                    >
                      {r.wikipedia_article_title ?? "Article"}
                    </a>
                  </li>
                ) : null}
              </ul>
            </section>
          </div>
        ) : null}

        {tab === "localisation" ? (
          <div className="mt-8 space-y-6">
            <h2 className="font-display text-xl font-semibold text-[var(--rc-text-muted)] sm:text-2xl">
              Localisation
            </h2>
            <p className="text-center text-sm text-[var(--rc-text)]">
              {displayChefNom} — {displayNomRestaurant}
            </p>
            <div className="overflow-hidden rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] shadow-sm">
              <iframe
                title={`Carte — ${r.nom_restaurant}`}
                src={embedSrc}
                className="h-[min(420px,70vw)] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap items-stretch gap-2 rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-2 sm:flex-nowrap">
              <span className="flex shrink-0 items-center bg-[var(--rc-page-bg)] px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--rc-text-muted)]">
                Itinéraire
              </span>
              <input
                type="text"
                value={itineraireDepart}
                onChange={(e) => setItineraireDepart(e.target.value)}
                placeholder="Adresse de départ"
                className="min-w-0 flex-1 rounded-md border border-[var(--rc-border)] bg-[var(--rc-page-bg)] px-3 py-2 text-sm font-light text-[var(--rc-text)] outline-none placeholder:text-[var(--rc-text-muted)] focus:border-[var(--rc-gold)]"
              />
              <a
                href={
                  itineraireDepart.trim()
                    ? googleDirectionsUrlFromOrigin(
                        itineraireDepart,
                        r.latitude,
                        r.longitude
                      )
                    : googleDirectionsUrl(r.latitude, r.longitude)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[var(--rc-text)] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition hover:opacity-90"
              >
                Trouvez
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={googleDirectionsUrl(r.latitude, r.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-[var(--rc-text)] transition hover:border-[var(--rc-gold)] hover:bg-[var(--rc-gold-soft)]"
              >
                Itinéraire (Google Maps)
              </a>
              <a
                href={googleStreetViewUrl(r.latitude, r.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-[var(--rc-text)] transition hover:border-[var(--rc-gold)] hover:bg-[var(--rc-gold-soft)]"
              >
                Street View
              </a>
            </div>
          </div>
        ) : null}

        {tab === "evenements" ? (
          <div className="mt-10 rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-6 py-10 text-center">
            <Calendar
              className="mx-auto h-10 w-10 text-[var(--rc-text-muted)]"
              strokeWidth={1.25}
            />
            <p className="mt-4 text-sm font-light text-[var(--rc-text-muted)]">
              Aucun événement programmé pour le moment.
            </p>
          </div>
        ) : null}

        {tab === "avis" ? (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--rc-text)]">
                Avis
              </h2>
              <p className="mt-1 text-sm text-[var(--rc-text-muted)]">
                {displayChefNom} — {displayNomRestaurant}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-5 sm:p-6">
              <p className="text-sm font-medium text-[var(--rc-text)]">
                Avis des clients
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col items-center justify-center border-b border-[var(--rc-border)] pb-6 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
                  <div className="flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-[var(--rc-border-strong)]"
                        strokeWidth={1.25}
                      />
                    ))}
                  </div>
                  <p className="mt-3 font-display text-4xl font-semibold text-[var(--rc-text)]">
                    0
                  </p>
                  <p className="text-xs uppercase tracking-wider text-[var(--rc-text-muted)]">
                    0 avis
                  </p>
                  <p className="mt-3 max-w-xs text-center text-xs font-light text-[var(--rc-text-muted)]">
                    Les notes et commentaires seront disponibles après
                    inscription (fonctionnalité à venir).
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    "Qualité de la table",
                    "Qualité du cadre",
                    "Service",
                    "Rapport qualité / prix",
                  ].map((label) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-[var(--rc-text-muted)]">
                        <span>{label}</span>
                        <span>0 %</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--rc-page-bg)]">
                        <div
                          className="h-full w-0 rounded-full bg-[var(--rc-gold)]"
                          aria-hidden
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-[var(--rc-border)] pt-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--rc-text-muted)]">
                Avis
              </p>
              <button
                type="button"
                disabled
                className="mt-4 inline-flex rounded-md bg-[var(--rc-text)] px-8 py-2.5 text-xs font-medium uppercase tracking-wider text-white opacity-50"
              >
                Plus
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
