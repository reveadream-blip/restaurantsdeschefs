"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PARTNER_BANNER,
  type PartnerBannerConfig,
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
  const [banner, setBanner] = useState<PartnerBannerConfig>(DEFAULT_PARTNER_BANNER);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      const { ok, data } = await fetchJson<{
        banner?: PartnerBannerConfig;
        error?: string;
      }>("/api/admin/partenariat");
      if (!cancelled) {
        if (ok && data.banner) setBanner(data.banner);
        else setErr(data.error ?? "Impossible de charger la configuration.");
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
      { method: "PUT", body: JSON.stringify({ banner }) }
    );
    setSaving(false);
    if (!ok) {
      setErr((data as { error?: string }).error ?? "Enregistrement refusé.");
      return;
    }
    setSaved(true);
  }

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
          Bannière partenaire
        </h1>
        <Link
          href="/admin"
          className="text-sm text-[var(--rc-ruby)] underline-offset-2 hover:underline"
        >
          ← Liste des fiches
        </Link>
      </div>

      <p className="mb-6 text-sm font-light leading-relaxed text-[var(--rc-text-muted)]">
        Cette bannière s’affiche discrètement toutes les{" "}
        <strong className="font-medium text-[var(--rc-text)]">
          {banner.interval} cartes
        </strong>{" "}
        dans les listes. Le lien mène vers la page{" "}
        <Link href="/partenaires" className="text-[var(--rc-ruby)] underline">
          /partenaires
        </Link>
        .
      </p>

      <form onSubmit={handleSave} className="space-y-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={banner.enabled}
            onChange={(e) =>
              setBanner((b) => ({ ...b, enabled: e.target.checked }))
            }
            className="h-4 w-4 accent-[var(--rc-gold)]"
          />
          <span className="text-sm font-medium text-[var(--rc-text)]">
            Bannière activée
          </span>
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
              setBanner((b) => ({
                ...b,
                interval: Math.min(20, Math.max(1, Number(e.target.value) || 5)),
              }))
            }
            className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Titre
          </span>
          <input
            type="text"
            value={banner.title}
            onChange={(e) => setBanner((b) => ({ ...b, title: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Sous-titre
          </span>
          <textarea
            value={banner.subtitle}
            onChange={(e) =>
              setBanner((b) => ({ ...b, subtitle: e.target.value }))
            }
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
            onChange={(e) =>
              setBanner((b) => ({ ...b, ctaLabel: e.target.value }))
            }
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
            onChange={(e) =>
              setBanner((b) => ({ ...b, ctaHref: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            placeholder="/partenaires"
          />
        </label>

        {err ? <p className="text-sm text-[var(--rc-ruby)]">{err}</p> : null}
        {saved ? (
          <p className="text-sm text-[var(--rc-gold)]">Configuration enregistrée.</p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[var(--rc-navy)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
