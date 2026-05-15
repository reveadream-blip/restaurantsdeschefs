"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PARTENARIAT_SETTINGS,
  type MarquePartenariatFiche,
  type PartnerBannerConfig,
  type PartenariatSettings,
} from "@/types/partenariat";

async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: { "content-type": "application/json", ...init?.headers },
  });
  let data: T = {} as T;
  try {
    data = (await res.json()) as T;
  } catch {
    /* */
  }
  return { ok: res.ok, status: res.status, data };
}

export default function AdminPartenariatPage() {
  const router = useRouter();
  const [me, setMe] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<PartenariatSettings>(
    DEFAULT_PARTENARIAT_SETTINGS
  );
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const setBanner = (patch: Partial<PartnerBannerConfig>) =>
    setSettings((s) => ({ ...s, banner: { ...s.banner, ...patch } }));
  const setMarque = (patch: Partial<MarquePartenariatFiche>) =>
    setSettings((s) => ({ ...s, marqueFiche: { ...s.marqueFiche, ...patch } }));

  const checkMe = useCallback(async () => {
    const { ok, data } = await fetchJson<{ authenticated?: boolean }>(
      "/api/admin/me"
    );
    setMe(Boolean(ok && data.authenticated));
  }, []);

  useEffect(() => {
    void checkMe();
  }, [checkMe]);

  useEffect(() => {
    if (me === false) {
      router.replace("/admin?next=/admin/partenariat");
    }
  }, [me, router]);

  useEffect(() => {
    if (me !== true) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      const { ok, data } = await fetchJson<
        PartenariatSettings & { error?: string }
      >("/api/admin/partenariat");
      if (!cancelled) {
        if (ok && data.banner) {
          setSettings({
            banner: data.banner,
            marqueFiche: data.marqueFiche ?? DEFAULT_PARTENARIAT_SETTINGS.marqueFiche,
          });
        } else {
          setErr(data.error ?? "Impossible de charger la configuration.");
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [me]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErr(null);
    const { ok, data } = await fetchJson<{ error?: string }>(
      "/api/admin/partenariat",
      { method: "PUT", body: JSON.stringify(settings) }
    );
    setSaving(false);
    if (!ok) {
      setErr((data as { error?: string }).error ?? "Enregistrement refusé.");
      return;
    }
    setSaved(true);
  }

  const { banner, marqueFiche } = settings;

  if (me === null || loading) {
    return (
      <p className="px-4 py-12 text-center text-sm text-[var(--rc-text-muted)]">
        Chargement…
      </p>
    );
  }

  if (me === false) {
    return (
      <p className="px-4 py-12 text-center text-sm text-[var(--rc-text-muted)]">
        Redirection…
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-[var(--rc-text)]">
          Partenariats
        </h1>
        <Link
          href="/admin"
          className="text-sm text-[var(--rc-ruby)] underline-offset-2 hover:underline"
        >
          ← Liste des fiches
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {/* ——— Bannière liste ——— */}
        <fieldset className="space-y-5 rounded-lg border border-[var(--rc-border)] p-5">
          <legend className="px-1 text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Bannière dans les listes
          </legend>
          <p className="text-xs font-light text-[var(--rc-text-muted)]">
            Affichée toutes les {banner.interval} cartes. Choisissez le type
            «&nbsp;marque&nbsp;» pour un logo cliquable.
          </p>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={banner.enabled}
              onChange={(e) => setBanner({ enabled: e.target.checked })}
              className="h-4 w-4 accent-[var(--rc-gold)]"
            />
            <span className="text-sm text-[var(--rc-text)]">Bannière activée</span>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              Type de bannière
            </span>
            <select
              value={banner.kind}
              onChange={(e) =>
                setBanner({
                  kind: e.target.value as PartnerBannerConfig["kind"],
                })
              }
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            >
              <option value="restaurants">Offre restaurateurs (texte + bouton)</option>
              <option value="marque">Partenaire marque (logo / photo + lien)</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              Intervalle (cartes)
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={banner.interval}
              onChange={(e) =>
                setBanner({
                  interval: Math.min(
                    20,
                    Math.max(1, Number(e.target.value) || 5)
                  ),
                })
              }
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
          </label>

          {banner.kind === "marque" ? (
            <>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
                  URL logo ou photo (https)
                </span>
                <input
                  type="url"
                  value={banner.marqueImageUrl ?? ""}
                  onChange={(e) =>
                    setBanner({ marqueImageUrl: e.target.value })
                  }
                  placeholder="https://…"
                  className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
                  Lien au clic
                </span>
                <input
                  type="url"
                  value={banner.marqueLinkUrl ?? ""}
                  onChange={(e) => setBanner({ marqueLinkUrl: e.target.value })}
                  placeholder="https://…"
                  className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
                  Légende courte (optionnel)
                </span>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => setBanner({ title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
                  Texte d’accompagnement (optionnel)
                </span>
                <textarea
                  value={banner.subtitle}
                  onChange={(e) => setBanner({ subtitle: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
                />
              </label>
            </>
          ) : (
            <>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
                  Titre
                </span>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => setBanner({ title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
                  Sous-titre
                </span>
                <textarea
                  value={banner.subtitle}
                  onChange={(e) => setBanner({ subtitle: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
                  Libellé du bouton
                </span>
                <input
                  type="text"
                  value={banner.ctaLabel}
                  onChange={(e) => setBanner({ ctaLabel: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
                  Lien du bouton
                </span>
                <input
                  type="text"
                  value={banner.ctaHref}
                  onChange={(e) => setBanner({ ctaHref: e.target.value })}
                  placeholder="/partenaires"
                  className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
                />
              </label>
            </>
          )}
        </fieldset>

        {/* ——— Fiche marque /partenaires ——— */}
        <fieldset className="space-y-5 rounded-lg border border-[var(--rc-gold)]/40 bg-[var(--rc-gold-soft)]/20 p-5">
          <legend className="px-1 text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Fiche partenariat de marque
          </legend>
          <p className="text-xs font-light text-[var(--rc-text-muted)]">
            Bloc affiché sur{" "}
            <Link href="/partenaires" className="text-[var(--rc-ruby)] underline">
              /partenaires
            </Link>
            .
          </p>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={marqueFiche.enabled}
              onChange={(e) => setMarque({ enabled: e.target.checked })}
              className="h-4 w-4 accent-[var(--rc-gold)]"
            />
            <span className="text-sm text-[var(--rc-text)]">Fiche visible</span>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              Nom de la marque
            </span>
            <input
              type="text"
              value={marqueFiche.brandName}
              onChange={(e) => setMarque({ brandName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              Titre de la fiche
            </span>
            <input
              type="text"
              value={marqueFiche.headline}
              onChange={(e) => setMarque({ headline: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              Description
            </span>
            <textarea
              value={marqueFiche.description}
              onChange={(e) => setMarque({ description: e.target.value })}
              rows={5}
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              URL logo (https)
            </span>
            <input
              type="url"
              value={marqueFiche.logoUrl}
              onChange={(e) => setMarque({ logoUrl: e.target.value })}
              placeholder="https://…"
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              URL photo bannière (optionnel)
            </span>
            <input
              type="url"
              value={marqueFiche.photoUrl ?? ""}
              onChange={(e) => setMarque({ photoUrl: e.target.value })}
              placeholder="https://…"
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              Lien du site / campagne
            </span>
            <input
              type="url"
              value={marqueFiche.linkUrl}
              onChange={(e) => setMarque({ linkUrl: e.target.value })}
              placeholder="https://…"
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
              Libellé du bouton
            </span>
            <input
              type="text"
              value={marqueFiche.linkLabel}
              onChange={(e) => setMarque({ linkLabel: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
          </label>
        </fieldset>

        {err ? <p className="text-sm text-[var(--rc-ruby)]">{err}</p> : null}
        {saved ? (
          <p className="text-sm text-[var(--rc-gold)]">Configuration enregistrée.</p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[var(--rc-navy)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer tout"}
        </button>
      </form>
    </div>
  );
}
