import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--rc-page-bg)]">
      <header className="sticky top-0 z-10 border-b border-[var(--rc-border)] bg-[var(--rc-surface)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--rc-ruby)] underline-offset-2 hover:underline"
          >
            ← Page d’accueil
          </Link>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--rc-text-muted)]">
            Administration
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}
