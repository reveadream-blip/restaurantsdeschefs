"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Restaurant } from "@/types/restaurant";
import { parseFichePhotoLines } from "@/lib/normalizeFicheMediaUrl";
import { mapEtablissementApiRow } from "@/lib/mapEtablissementApiRow";

type FicheApi = {
  etablissement_id: number;
  description_text: string | null;
  photos_json: string | null;
  menu_prix: string | null;
  video_url: string | null;
  contact_json: string | null;
  card_cover_url?: string | null;
};

async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  let data: T = {} as T;
  try {
    data = (await res.json()) as T;
  } catch {
    /* */
  }
  return { ok: res.ok, status: res.status, data };
}

function AdminFicheEditor() {
  const router = useRouter();
  const sp = useSearchParams();
  const idRaw = sp.get("id");
  const id = idRaw != null ? Number(idRaw) : NaN;

  const [me, setMe] = useState<boolean | null>(null);
  const [base, setBase] = useState<Restaurant | null>(null);
  const [description, setDescription] = useState("");
  const [photosLines, setPhotosLines] = useState("");
  const [menuPrix, setMenuPrix] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [cardCoverUrl, setCardCoverUrl] = useState("");
  const [ctTel, setCtTel] = useState("");
  const [ctEmail, setCtEmail] = useState("");
  const [ctSite, setCtSite] = useState("");
  const [ctAdr, setCtAdr] = useState("");
  const [ctVille, setCtVille] = useState("");
  const [ctChef, setCtChef] = useState("");
  const [ctNom, setCtNom] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importErr, setImportErr] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<unknown>(null);

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
    if (base?.restaurant_site_web) {
      setImportUrl((prev) =>
        prev.trim() === "" ? base.restaurant_site_web! : prev
      );
    }
  }, [base?.restaurant_site_web]);

  useEffect(() => {
    if (me !== false || !Number.isFinite(id)) return;
    router.replace(
      `/admin?next=${encodeURIComponent(`/admin/fiche?id=${id}`)}`
    );
  }, [me, id, router]);

  useEffect(() => {
    if (me !== true || !Number.isFinite(id)) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      setSaved(false);
      const listRes = await fetch("/api/etablissements", { cache: "no-store" });
      if (!listRes.ok) {
        if (!cancelled) setErr(`Annuaire HTTP ${listRes.status}`);
        setLoading(false);
        return;
      }
      const raw: unknown = await listRes.json();
      const list = Array.isArray(raw)
        ? raw
            .map((x) => mapEtablissementApiRow(x as Record<string, unknown>))
            .filter((x): x is Restaurant => x != null)
        : [];
      const b = list.find((r) => r.id === id) ?? null;
      if (!cancelled) setBase(b);

      const { ok, status, data } = await fetchJson<FicheApi & { error?: string }>(
        `/api/admin/fiche?id=${id}`
      );
      if (!ok) {
        if (status === 401) {
          if (!cancelled) {
            setMe(false);
          }
        } else {
          if (!cancelled)
            setErr((data as { error?: string }).error ?? `Erreur ${status}`);
        }
        setLoading(false);
        return;
      }
      const f = data as FicheApi;
      if (!cancelled) {
        setDescription(f.description_text ?? "");
        let lines = "";
        if (f.photos_json) {
          try {
            const p: unknown = JSON.parse(f.photos_json);
            if (Array.isArray(p))
              lines = p.filter((x) => typeof x === "string").join("\n");
          } catch {
            lines = "";
          }
        }
        setPhotosLines(lines);
        setMenuPrix(f.menu_prix ?? "");
        setVideoUrl(f.video_url ?? "");
        setCardCoverUrl(f.card_cover_url ?? "");
        if (f.contact_json) {
          try {
            const c = JSON.parse(f.contact_json) as Record<string, string>;
            setCtTel(c.telephone ?? "");
            setCtEmail(c.email ?? "");
            setCtSite(c.site_web ?? "");
            setCtAdr(c.adresse ?? "");
            setCtVille(c.ville ?? "");
            setCtChef(c.chef_nom ?? "");
            setCtNom(c.nom_restaurant ?? "");
          } catch {
            /* */
          }
        } else {
          setCtTel("");
          setCtEmail("");
          setCtSite("");
          setCtAdr("");
          setCtVille("");
          setCtChef("");
          setCtNom("");
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [me, id, router]);

  async function handleImportPreview() {
    if (!Number.isFinite(id)) return;
    setImportBusy(true);
    setImportErr(null);
    setImportPreview(null);
    const payload: Record<string, unknown> = {
      etablissement_id: id,
      apply: false,
    };
    const u = importUrl.trim();
    if (u) payload.url = u;
    const { ok, status, data } = await fetchJson<{ preview?: unknown; error?: string }>(
      "/api/admin/import-site",
      { method: "POST", body: JSON.stringify(payload) }
    );
    setImportBusy(false);
    if (!ok) {
      setImportErr(
        (data as { error?: string }).error ?? `Erreur ${status}`
      );
      return;
    }
    setImportPreview((data as { preview?: unknown }).preview ?? null);
  }

  async function handleImportApply() {
    if (!Number.isFinite(id)) return;
    setImportBusy(true);
    setImportErr(null);
    const payload: Record<string, unknown> = {
      etablissement_id: id,
      apply: true,
    };
    const u = importUrl.trim();
    if (u) payload.url = u;
    const { ok, data } = await fetchJson<{ error?: string }>(
      "/api/admin/import-site",
      { method: "POST", body: JSON.stringify(payload) }
    );
    setImportBusy(false);
    if (!ok) {
      setImportErr(
        (data as { error?: string }).error ?? "Import impossible."
      );
      return;
    }
    globalThis.location.reload();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!Number.isFinite(id)) return;
    setSaving(true);
    setErr(null);
    setSaved(false);
    const photos = parseFichePhotoLines(photosLines);
    const contact: Record<string, string> = {};
    if (ctTel.trim()) contact.telephone = ctTel.trim();
    if (ctEmail.trim()) contact.email = ctEmail.trim();
    if (ctSite.trim()) contact.site_web = ctSite.trim();
    if (ctAdr.trim()) contact.adresse = ctAdr.trim();
    if (ctVille.trim()) contact.ville = ctVille.trim();
    if (ctChef.trim()) contact.chef_nom = ctChef.trim();
    if (ctNom.trim()) contact.nom_restaurant = ctNom.trim();

    const { ok, data } = await fetchJson<{ error?: string }>(
      `/api/admin/fiche?id=${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          etablissement_id: id,
          description_text: description.trim() || null,
          photos: photos.length ? photos : null,
          menu_prix: menuPrix.trim() || null,
          video_url: videoUrl.trim() || null,
          card_cover_url: cardCoverUrl.trim() || null,
          contact_json: Object.keys(contact).length ? contact : null,
        }),
      }
    );
    setSaving(false);
    if (!ok) {
      setErr((data as { error?: string }).error ?? "Enregistrement refusé.");
      return;
    }
    setSaved(true);
  }

  if (me === false) {
    return (
      <p className="px-4 py-12 text-center text-sm text-[var(--rc-text-muted)]">
        Redirection vers la page de connexion…
      </p>
    );
  }

  if (!Number.isFinite(id)) {
    return (
      <p className="px-4 py-12 text-center text-sm">
        <Link href="/admin" className="text-[var(--rc-ruby)] underline">
          Retour à la liste
        </Link>{" "}
        — paramètre id manquant.
      </p>
    );
  }

  if (loading || me === null) {
    return (
      <p className="px-4 py-12 text-center text-sm text-[var(--rc-text-muted)]">
        Chargement…
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm">
        <Link
          href="/admin"
          className="text-[var(--rc-ruby)] underline-offset-2 hover:underline"
        >
          ← Liste des fiches
        </Link>
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--rc-text)]">
        Éditer la fiche
      </h1>
      {base ? (
        <p className="mt-1 text-sm text-[var(--rc-text-muted)]">
          {base.nom_restaurant} — {base.chef_nom} ({base.ville}) · id {id}
        </p>
      ) : (
        <p className="mt-1 text-sm text-[var(--rc-ruby)]">
          Cet id n’est pas dans l’annuaire actuel ; vous pouvez tout de même
          enregistrer des surcharges si la ligne existe en base.
        </p>
      )}

      <section className="mt-8 rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
          Importer depuis le site web
        </h2>
        <p className="mt-1 text-xs font-light leading-relaxed text-[var(--rc-text-muted)]">
          Récupère titres, descriptions (meta / Open Graph), images, extrait de
          texte et données structurées JSON-LD (téléphone, adresse) lorsque le
          site les expose. Sans URL saisie, l’adresse enregistrée dans l’annuaire
          est utilisée si elle existe.
        </p>
        <input
          type="url"
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          className="mt-3 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-page-bg)] px-3 py-2 text-sm text-[var(--rc-text)] outline-none focus:border-[var(--rc-gold)]"
          placeholder="https://…"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleImportPreview}
            disabled={importBusy}
            className="rounded-lg border border-[var(--rc-border)] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--rc-text)] hover:bg-[var(--rc-gold-soft)] disabled:opacity-50"
          >
            {importBusy ? "Traitement…" : "Prévisualiser"}
          </button>
          <button
            type="button"
            onClick={handleImportApply}
            disabled={importBusy}
            className="rounded-lg bg-[var(--rc-text)] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-50"
          >
            Importer et enregistrer
          </button>
        </div>
        {importErr ? (
          <p className="mt-2 text-sm text-[var(--rc-ruby)]">{importErr}</p>
        ) : null}
        {importPreview ? (
          <details className="mt-3 text-xs text-[var(--rc-text-muted)]">
            <summary className="cursor-pointer font-medium text-[var(--rc-text)]">
              Aperçu des données extraites
            </summary>
            <pre className="mt-2 max-h-56 overflow-auto rounded-md border border-[var(--rc-border)] bg-[var(--rc-page-bg)] p-3 font-mono text-[0.65rem] leading-relaxed text-[var(--rc-text)]">
              {JSON.stringify(importPreview, null, 2)}
            </pre>
          </details>
        ) : null}
      </section>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Description
          </h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={12}
            className="mt-2 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-3 text-sm font-light leading-relaxed text-[var(--rc-text)] outline-none focus:border-[var(--rc-gold)] whitespace-pre-wrap"
            placeholder={"Texte affiché sur la fiche publique (remplace Wikipédia / parcours si renseigné).\nAppuyez sur Entrée pour des retours à la ligne."}
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Photos (URL)
          </h2>
          <p className="mt-1 text-xs text-[var(--rc-text-muted)]">
            Liens <strong>https://</strong> vers les images (une par ligne, ou
            plusieurs sur la même ligne séparées par des espaces ou des
            virgules). Un domaine sans <code className="rounded bg-black/5 px-0.5">https://</code> est complété automatiquement. Remplace la galerie par défaut si au moins une URL valide est fournie.
          </p>
          <textarea
            value={photosLines}
            onChange={(e) => setPhotosLines(e.target.value)}
            rows={6}
            className="mt-2 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-3 font-mono text-xs text-[var(--rc-text)] outline-none focus:border-[var(--rc-gold)]"
            placeholder={"https://…\nhttps://…"}
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Image de couverture (liste + bandeau fiche)
          </h2>
          <p className="mt-1 text-xs text-[var(--rc-text-muted)]">
            Une seule URL d’image <strong>https://</strong>. Elle remplace le fond doré sur la carte de l’annuaire et le bandeau photo en haut de la fiche publique. Laissez vide pour revenir au visuel par défaut.
          </p>
          <input
            type="url"
            value={cardCoverUrl}
            onChange={(e) => setCardCoverUrl(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 font-mono text-xs text-[var(--rc-text)] outline-none focus:border-[var(--rc-gold)]"
            placeholder="https://exemple.com/photo-restaurant.jpg"
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Menu et prix
          </h2>
          <p className="mt-1 text-xs text-[var(--rc-text-muted)]">
            Utilisez <strong>Entrée</strong> pour des retours à la ligne : ils
            seront conservés sur la fiche publique (paragraphes, listes de
            formules, etc.).
          </p>
          <textarea
            value={menuPrix}
            onChange={(e) => setMenuPrix(e.target.value)}
            rows={8}
            className="mt-2 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-3 text-sm font-light leading-relaxed text-[var(--rc-text)] outline-none focus:border-[var(--rc-gold)] whitespace-pre-wrap"
            placeholder={"Texte libre (ex. formules, fourchettes de prix…).\nAppuyez sur Entrée pour passer à la ligne."}
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Vidéo
          </h2>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm text-[var(--rc-text)] outline-none focus:border-[var(--rc-gold)]"
            placeholder="https://www.youtube.com/watch?v=… ou lien embed"
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--rc-text)]">
            Contact affiché (surcharges optionnelles)
          </h2>
          <p className="mt-1 text-xs text-[var(--rc-text-muted)]">
            Laissez vide pour conserver les données de l’annuaire pour ce champ.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Téléphone"
              value={ctTel}
              onChange={(e) => setCtTel(e.target.value)}
              className="rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
            <input
              placeholder="E-mail"
              value={ctEmail}
              onChange={(e) => setCtEmail(e.target.value)}
              className="rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
            <input
              placeholder="Site web"
              value={ctSite}
              onChange={(e) => setCtSite(e.target.value)}
              className="rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm sm:col-span-2"
            />
            <textarea
              placeholder="Adresse (plusieurs lignes possibles)"
              value={ctAdr}
              onChange={(e) => setCtAdr(e.target.value)}
              rows={3}
              className="rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm whitespace-pre-wrap sm:col-span-2"
            />
            <input
              placeholder="Ville"
              value={ctVille}
              onChange={(e) => setCtVille(e.target.value)}
              className="rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
            <input
              placeholder="Nom du chef (affiché)"
              value={ctChef}
              onChange={(e) => setCtChef(e.target.value)}
              className="rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm"
            />
            <input
              placeholder="Nom du restaurant (affiché)"
              value={ctNom}
              onChange={(e) => setCtNom(e.target.value)}
              className="rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2 text-sm sm:col-span-2"
            />
          </div>
        </section>

        {err ? <p className="text-sm text-[var(--rc-ruby)]">{err}</p> : null}
        {saved ? (
          <p className="text-sm text-green-700 dark:text-green-400">
            Modifications enregistrées. Le site public reflète les changements
            après rechargement (cache ~1 min sur la liste).
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[var(--rc-text)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </main>
  );
}

export default function AdminFichePage() {
  return (
    <Suspense
      fallback={
        <p className="px-4 py-12 text-center text-sm text-[var(--rc-text-muted)]">
          Chargement…
        </p>
      }
    >
      <AdminFicheEditor />
    </Suspense>
  );
}
