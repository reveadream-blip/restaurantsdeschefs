"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Restaurant } from "@/types/restaurant";
import { mapEtablissementApiRow } from "@/lib/mapEtablissementApiRow";

async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
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

function AdminHomeInner() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("reveadream@gmail.com");
  const [auth, setAuth] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Restaurant[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const checkMe = useCallback(async () => {
    const { ok, data } = await fetchJson<{ authenticated?: boolean }>(
      "/api/admin/me"
    );
    setAuth(Boolean(ok && data.authenticated));
  }, []);

  useEffect(() => {
    void checkMe();
  }, [checkMe]);

  useEffect(() => {
    if (auth !== true) return;
    let cancelled = false;
    (async () => {
      setLoadErr(null);
      const res = await fetch("/api/etablissements", { cache: "no-store" });
      if (!res.ok) {
        if (!cancelled) setLoadErr(`HTTP ${res.status}`);
        return;
      }
      const raw: unknown = await res.json();
      if (!Array.isArray(raw)) {
        if (!cancelled) setLoadErr("Réponse annuaire invalide.");
        return;
      }
      const list = raw
        .map((x) => mapEtablissementApiRow(x as Record<string, unknown>))
        .filter((x): x is Restaurant => x != null);
      if (!cancelled) setRows(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [auth]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr(null);
    setBusy(true);
    const { ok, status, data } = await fetchJson<{ error?: string }>(
      "/api/admin/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    setBusy(false);
    if (!ok) {
      setLoginErr(
        (data as { error?: string }).error ??
          (status === 503
            ? "API admin indisponible (secrets ou D1 non configurés sur cet environnement)."
            : "Échec de la connexion.")
      );
      return;
    }
    setPassword("");
    await checkMe();
    if (
      next &&
      next.startsWith("/") &&
      !next.startsWith("//")
    ) {
      router.push(next);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    setRows([]);
    setAuth(false);
  }

  if (auth === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-[var(--rc-page-bg)] px-4 text-sm text-[var(--rc-text-muted)]">
        Vérification de la session…
      </div>
    );
  }

  if (!auth) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-[var(--rc-text)]">
          Administration des fiches
        </h1>
        <p className="mt-2 text-sm font-light text-[var(--rc-text-muted)]">
          Connexion réservée. Après authentification, vous pourrez modifier les
          contenus publiés sur chaque fiche établissement.
        </p>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block text-xs font-medium uppercase tracking-wider text-[var(--rc-text-muted)]">
            E-mail administrateur
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2.5 text-sm text-[var(--rc-text)] outline-none focus:border-[var(--rc-gold)]"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-wider text-[var(--rc-text-muted)]">
            Mot de passe
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2.5 text-sm text-[var(--rc-text)] outline-none focus:border-[var(--rc-gold)]"
            />
          </label>
          {loginErr ? (
            <p className="text-sm text-[var(--rc-ruby)]">{loginErr}</p>
          ) : null}
          <button
            type="submit"
            disabled={busy || !password || !email.trim()}
            className="w-full rounded-lg bg-[var(--rc-text)] py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm">
          <Link
            href="/"
            className="text-[var(--rc-ruby)] underline-offset-2 hover:underline"
          >
            ← Retour à l’annuaire
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-[var(--rc-text)]">
          Fiches établissements
        </h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[var(--rc-border)] px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--rc-text)] hover:bg-[var(--rc-surface)]"
          >
            Déconnexion
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[var(--rc-border)] px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--rc-text)] hover:bg-[var(--rc-surface)]"
          >
            Annuaire
          </Link>
        </div>
      </div>
      <p className="mt-2 text-sm font-light text-[var(--rc-text-muted)]">
        Choisissez un établissement pour éditer description, photos (URL), menu
        et prix, vidéo et coordonnées affichées sur la fiche publique.
      </p>

      {loadErr ? (
        <p className="mt-6 text-sm text-[var(--rc-ruby)]">{loadErr}</p>
      ) : (
        <ul className="mt-8 max-h-[min(70vh,560px)] space-y-1 overflow-y-auto rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-2">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/fiche?id=${r.id}`}
                className="block rounded-md px-3 py-2 text-sm text-[var(--rc-text)] hover:bg-[var(--rc-gold-soft)]"
              >
                <span className="font-medium">{r.nom_restaurant}</span>
                <span className="text-[var(--rc-text-muted)]">
                  {" "}
                  — {r.chef_nom} ({r.ville}){" "}
                  <span className="text-xs text-[var(--rc-text-muted)]">
                    id {r.id}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default function AdminHomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-[var(--rc-page-bg)] px-4 text-sm text-[var(--rc-text-muted)]">
          Chargement…
        </div>
      }
    >
      <AdminHomeInner />
    </Suspense>
  );
}
