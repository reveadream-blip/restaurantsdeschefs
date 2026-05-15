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
  /** Message si /api/admin/* ne répond pas (souvent Functions ou secrets manquants en prod). */
  const [apiProblem, setApiProblem] = useState<string | null>(null);

  const checkMe = useCallback(async () => {
    setApiProblem(null);
    try {
      const res = await fetch("/api/admin/me", { credentials: "include" });
      const text = await res.text();
      let authenticated = false;
      try {
        const data = JSON.parse(text) as { authenticated?: boolean };
        authenticated = Boolean(data.authenticated);
      } catch {
        if (!res.ok && res.status !== 401) {
          setApiProblem(
            res.status === 404
              ? "L’API d’administration est introuvable (404). Ce site est peut‑être déployé sans les Cloudflare Pages Functions : vérifiez que le dossier « functions » est à la racine du dépôt et que le build Pages inclut bien les fonctions, ou déployez avec « npx wrangler pages deploy » depuis la machine de build."
              : `Le serveur a répondu ${res.status} avec une réponse non JSON. Vérifiez la configuration Cloudflare (binding D1 « DB », secrets).`
          );
        }
      }
      setAuth(res.ok && authenticated);
    } catch {
      setApiProblem(
        "Impossible de contacter /api/admin/me (réseau ou domaine incorrect)."
      );
      setAuth(false);
    }
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
          (status === 404
            ? "Route d’API introuvable : le site en ligne n’expose probablement pas les Pages Functions (dossier functions/ à la racine du dépôt)."
            : status === 503
              ? "API admin indisponible : définissez les secrets ADMIN_PASSWORD et ADMIN_SESSION_SECRET sur le projet Cloudflare Pages."
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
        {apiProblem ? (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-3 text-sm leading-relaxed text-[var(--rc-text)]"
          >
            {apiProblem}
          </p>
        ) : null}
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
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-[var(--rc-text)]">
          Fiches établissements
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/partenariat"
            className="rounded-lg border border-[var(--rc-gold)]/50 bg-[var(--rc-gold-soft)]/40 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--rc-text)] hover:border-[var(--rc-gold)]"
          >
            Bannière partenaire
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[var(--rc-border)] px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--rc-text)] hover:bg-[var(--rc-surface)]"
          >
            Déconnexion
          </button>
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
