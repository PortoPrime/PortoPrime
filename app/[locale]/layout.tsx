import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { MetaPixel } from '@/components/MetaPixel';
import { StructuredData } from '@/components/StructuredData';
import { SITE_URL, localePath, absoluteUrl } from '@/lib/site';
import '../globals.css';

// ─── Types ─────────────────────────────────────────────────────────────────
interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// ─── Viewport — locked to prevent per-locale zoom drift ───────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ─── SEO Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  // Build hreflang map: every locale → its localized path under the
  // as-needed prefix strategy ('/' for default, '/{locale}' for others).
  // x-default points to the default-locale homepage so Google has a
  // fallback for users from regions without an exact match.
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, localePath('/', l)])
  );
  languages['x-default'] = localePath('/', routing.defaultLocale);

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
    },
    alternates: {
      // Canonical for the current page in the current locale.
      // Default locale stays at '/', non-default at '/{locale}'.
      canonical: localePath('/', locale),
      languages,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      siteName: 'PortoPrime',
      url: absoluteUrl('/', locale),
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

// ─── Static Params ─────────────────────────────────────────────────────────
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ─── Layout Component ──────────────────────────────────────────────────────
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale — show 404 for unknown locales
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Fonts — Playfair Display (display) + Inter (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-primary antialiased">
        {/* JSON-LD structured data — rendered server-side, indexed by search
            engines for rich snippets, Knowledge Graph, and local pack. */}
        <StructuredData locale={locale} />

        {/* Meta Pixel — fires PageView automatically; custom events via lib/meta-pixel.ts */}
        <MetaPixel />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
