import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import logoMark from "@/assets/logo-mark.jpg";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-secondary px-5 py-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="group flex items-center gap-3" aria-label="RGN's Homestay home">
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-gold shadow-sm">
              <img
                src={logoMark}
                alt=""
                className="size-full object-cover"
                width={80}
                height={80}
              />
            </span>
            <span className="font-display text-lg font-semibold">RGN's Homestay</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
          >
            <ArrowLeft className="size-4" /> Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="legal-prose mt-10 space-y-8 leading-7 text-foreground">{children}</div>
      </main>

      <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground lg:px-8">
        <p>© 2026 RGN's Homestay Homestyle Living. Karur, Tamil Nadu, India.</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link to="/terms" className="hover:text-primary">
            Terms &amp; Conditions
          </Link>
          <Link to="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link to="/cancellation-policy" className="hover:text-primary">
            Cancellation Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
