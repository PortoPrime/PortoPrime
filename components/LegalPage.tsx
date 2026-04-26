/**
 * LegalPage — shared layout for /privacy, /terms, /legal pages.
 *
 * Renders a long-form legal document from a flat translation namespace:
 *
 *   <namespace>.title          — page H1
 *   <namespace>.lastUpdated    — date stamp shown under H1
 *   <namespace>.intro          — opening paragraph
 *   <namespace>.section{N}Title — H2 for section N
 *   <namespace>.section{N}Body  — paragraph body for section N
 *                                 (use \n\n to split into multiple <p>)
 *
 * The component reads sections sequentially (1, 2, 3, ...) and stops on
 * the first missing key — translators just append more sections to extend.
 *
 * Why one component for three pages:
 *   - DRY: identical layout, only the namespace differs.
 *   - Single place to tweak typography, max-width, anchor links.
 *
 * Server component — no client-side interactivity needed.
 */

import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

interface LegalPageProps {
  /** Translation namespace, e.g. 'legal.privacy', 'legal.terms', 'legal.disclaimer'. */
  namespace: string;
  /** Hard upper bound on sections we will probe for. Increase if a doc grows beyond. */
  maxSections?: number;
}

export async function LegalPage({ namespace, maxSections = 20 }: LegalPageProps) {
  const t = await getTranslations(namespace);

  // Probe sequentially — `t.has` keeps us from rendering empty sections that
  // happen to still have a translation key in another locale's file but blank
  // text in this one.
  const sections: Array<{ title: string; body: string }> = [];
  for (let i = 1; i <= maxSections; i++) {
    const titleKey = `section${i}Title`;
    const bodyKey  = `section${i}Body`;
    if (!t.has(titleKey)) break;
    sections.push({
      title: t(titleKey),
      body:  t(bodyKey),
    });
  }

  return (
    <article className="legal-page max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-primary">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="mb-10 md:mb-14">
        <h1
          className="text-3xl md:text-5xl font-bold tracking-tight mb-3"
          style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}
        >
          {t('title')}
        </h1>
        <p className="text-sm text-primary/55">
          {t('lastUpdated')}
        </p>
      </header>

      {/* ── Intro ───────────────────────────────────────────────────────── */}
      {t.has('intro') && (
        <p className="text-base md:text-lg leading-relaxed mb-10 text-primary/85">
          {t('intro')}
        </p>
      )}

      {/* ── Sections ────────────────────────────────────────────────────── */}
      {sections.map((s, idx) => (
        <section key={idx} className="mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-primary">
            {idx + 1}. {s.title}
          </h2>
          {/* Split body by blank lines so translators can author multiple
              paragraphs naturally with \n\n in JSON.  */}
          {renderParagraphs(s.body)}
        </section>
      ))}
    </article>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function renderParagraphs(body: string): ReactNode {
  // Split on blank lines to support multi-paragraph translations stored as
  // a single JSON string.  Trim per-paragraph whitespace.
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => (
      <p
        key={i}
        className="text-base leading-relaxed mb-4 text-primary/80 whitespace-pre-line"
      >
        {p}
      </p>
    ));
}
