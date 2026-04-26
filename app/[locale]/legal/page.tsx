/**
 * /legal — Legal Disclaimer page (per locale).
 *
 * Discloses:
 *   - That PortoPrime provides property-management services and is NOT a
 *     financial advisor, tax advisor, or law firm.
 *   - That estimated yields shown in the calculator are projections, not
 *     guarantees.
 *   - Our role as fiscal-representation intermediary, not as the user's
 *     direct legal counsel.
 *
 * Content lives under the `legal.disclaimer` namespace in /messages/{lang}.json.
 */

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LegalPage } from '@/components/LegalPage';
import { absoluteUrl, localePath } from '@/lib/site';
import { routing } from '@/i18n/routing';

interface LegalDisclaimerPageProps {
  params: Promise<{ locale: string }>;
}

// ─── SEO Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: LegalDisclaimerPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.disclaimer' });

  // hreflang map for this exact route across all locales.
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, localePath('/legal', l)])
  );
  languages['x-default'] = localePath('/legal', routing.defaultLocale);

  return {
    title:       `${t('title')} — PortoPrime`,
    description: t('metaDescription'),
    alternates: {
      canonical: localePath('/legal', locale),
      languages,
    },
    openGraph: {
      title:       `${t('title')} — PortoPrime`,
      description: t('metaDescription'),
      url:         absoluteUrl('/legal', locale),
      type:        'article',
    },
  };
}

// Pre-render every locale at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default async function LegalDisclaimerPage({ params }: LegalDisclaimerPageProps) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-surface">
      <Navbar locale={locale} />
      <LegalPage namespace="legal.disclaimer" />
      <Footer />
    </main>
  );
}
