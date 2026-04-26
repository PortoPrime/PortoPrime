/**
 * /privacy — Privacy Policy page (per locale).
 *
 * Required by:
 *   - Meta Ads policies — ad accounts must link to a privacy policy.
 *   - GDPR (EU 2016/679) and Portuguese Data Protection Law (Lei n.º 58/2019).
 *   - Lei de Proteção de Dados (CNPD oversight).
 *
 * Content lives under the `legal.privacy` namespace in /messages/{lang}.json.
 */

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LegalPage } from '@/components/LegalPage';
import { absoluteUrl, localePath } from '@/lib/site';
import { routing } from '@/i18n/routing';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

// ─── SEO Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });

  // hreflang map for this exact route across all locales.
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, localePath('/privacy', l)])
  );
  languages['x-default'] = localePath('/privacy', routing.defaultLocale);

  return {
    title:       `${t('title')} — PortoPrime`,
    description: t('metaDescription'),
    alternates: {
      canonical: localePath('/privacy', locale),
      languages,
    },
    openGraph: {
      title:       `${t('title')} — PortoPrime`,
      description: t('metaDescription'),
      url:         absoluteUrl('/privacy', locale),
      type:        'article',
    },
  };
}

// Pre-render every locale at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-surface">
      <Navbar locale={locale} />
      <LegalPage namespace="legal.privacy" />
      <Footer />
    </main>
  );
}
