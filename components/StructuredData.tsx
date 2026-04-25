/**
 * StructuredData — server-rendered JSON-LD for SEO and rich snippets.
 *
 * What's emitted:
 *   1. RealEstateAgent  → primary business entity (logo, contact, services).
 *   2. WebSite          → enables sitelinks-search-box rich result.
 *
 * Why server-side:
 *   Search engines parse JSON-LD from the initial HTML response. Client-side
 *   injection works in theory but is unreliable across crawlers (especially
 *   Bing, Yandex, Baidu). Rendering server-side guarantees inclusion.
 *
 * Localization:
 *   The `name` and `description` are pulled from next-intl's `metadata`
 *   namespace so each locale's schema matches its visible content. The
 *   `inLanguage` field tells crawlers which language this version is in.
 */

import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SITE_URL, absoluteUrl } from '@/lib/site';

interface StructuredDataProps {
  /** Active locale, e.g. 'en', 'pt', 'ru'. */
  locale: string;
}

// ─── Static business facts ─────────────────────────────────────────────────
// Centralized so updates (new phone, new social, new service) only edit
// these constants — schemas below pick them up automatically.
const BUSINESS = {
  legalName:  'PortoPrime',
  brandName:  'PortoPrime',
  phone:      '+351915481058',
  whatsapp:   'https://wa.me/351915481058',
  // Coverage area — used for areaServed and serviceArea.
  cities:     ['Lisbon', 'Porto'] as const,
  regions:    ['Algarve'] as const,
  country:    'PT',
  // Languages business operates in, in BCP-47 form.
  languages:  ['pt', 'en', 'ru', 'de', 'fr', 'it', 'es'] as const,
  // Add real social URLs here as they go live — Google uses these for
  // Knowledge Panel and SameAs entity disambiguation.
  socialProfiles: [
    // 'https://www.instagram.com/portoprime',
    // 'https://www.facebook.com/portoprime',
    // 'https://www.linkedin.com/company/portoprime',
  ] as readonly string[],
} as const;

// Services offered — surfaced to Google as the agency's specialties.
const SERVICES = [
  'Property Management',
  'Short-term Rental Management',
  'Alojamento Local (AL) Licensing',
  'Property Renovation',
  '24/7 Guest Support',
  'Transparent Accounting',
] as const;

// ─── Component ──────────────────────────────────────────────────────────────
export async function StructuredData({ locale }: StructuredDataProps) {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  // hreflang-style alternate URLs for the org entity (helps Google
  // identify multilingual site as a single business).
  const sameAsLocaleUrls = routing.locales
    .filter((l) => l !== locale)
    .map((l) => absoluteUrl('/', l));

  // Stable @id used as a graph anchor — keep it identical across pages
  // so Google merges signals into a single business entity.
  const orgId = `${SITE_URL}#organization`;

  // 1) RealEstateAgent — the business itself
  const realEstateAgent = {
    '@context':   'https://schema.org',
    '@type':      'RealEstateAgent',
    '@id':        orgId,
    name:         BUSINESS.brandName,
    legalName:    BUSINESS.legalName,
    url:          SITE_URL,
    logo:         `${SITE_URL}/favicon.svg`,
    image:        `${SITE_URL}/favicon.svg`,
    description:  t('description'),
    address: {
      '@type':         'PostalAddress',
      addressCountry:  BUSINESS.country,
    },
    areaServed: [
      ...BUSINESS.cities.map((city) => ({
        '@type': 'City',
        name:    city,
        containedInPlace: { '@type': 'Country', name: 'Portugal' },
      })),
      ...BUSINESS.regions.map((region) => ({
        '@type': 'AdministrativeArea',
        name:    region,
        containedInPlace: { '@type': 'Country', name: 'Portugal' },
      })),
    ],
    knowsAbout:    [...SERVICES],
    knowsLanguage: [...BUSINESS.languages],
    contactPoint: {
      '@type':            'ContactPoint',
      contactType:        'customer service',
      telephone:          BUSINESS.phone,
      availableLanguage:  [...BUSINESS.languages],
      areaServed:         BUSINESS.country,
    },
    sameAs: [
      ...BUSINESS.socialProfiles,
      // Cross-locale URLs help Google merge multilingual versions
      // into one business entity.
      ...sameAsLocaleUrls,
    ],
    inLanguage: locale,
  };

  // 2) WebSite — enables the sitelinks search box and asserts the
  // canonical website-to-business relationship.
  const website = {
    '@context':   'https://schema.org',
    '@type':      'WebSite',
    '@id':        `${SITE_URL}#website`,
    url:          SITE_URL,
    name:         BUSINESS.brandName,
    description:  t('description'),
    inLanguage:   locale,
    publisher:    { '@id': orgId },
    // No search action emitted yet — add `potentialAction` here once an
    // on-site search is implemented.
  };

  // Render both as a JSON-LD graph in a single <script> for compactness.
  const graph = {
    '@context': 'https://schema.org',
    '@graph':   [realEstateAgent, website],
  };

  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is the standard, React-recommended way
      // to emit JSON-LD; the payload is built from constants and trusted
      // translations, so XSS surface is nil.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
