/**
 * /terms — Terms of Service page (per locale).
 *
 * Required by:
 *   - Meta Ads policies — Terms must be linked from the site footer.
 *   - Portuguese consumer law (Decreto-Lei n.º 24/2014 — distance contracts).
 *
 * Content lives under the `legal.terms` namespace in /messages/{lang}.json.
 */

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LegalPage } from '@/components/LegalPage';
import { absoluteUrl, localePath } from '@/lib/site';
import { routing } from '@/i18n/routing';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

// ─── SEO Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.terms' });

  // hreflang map for this exact route across all locales.
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, localePath('/terms', l)])
  );
  languages['x-default'] = localePath('/terms', routing.defaultLocale);

  return {
    title:       `${t('title')} — PortoPrime`,
    description: t('metaDescription'),
    alternates: {
      canonical: localePath('/terms', locale),
      languages,
    },
    openGraph: {
      title:       `${t('title')} — PortoPrime`,
      description: t('metaDescription'),
      url:         absoluteUrl('/terms', locale),
      type:        'article',
    },
  };
}

// Pre-render every locale at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-surface">
      <Navbar locale={locale} />
      <LegalPage namespace="legal.terms" />
      <Footer />
    </main>
  );
}
