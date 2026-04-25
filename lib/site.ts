/**
 * Single source of truth for the site URL and locale-aware path builders.
 *
 * Why centralize:
 *   - Avoid hardcoding `https://portoprime.pt` across the codebase.
 *   - Switch domains (e.g. for staging) by changing one env var.
 *   - Encapsulate the `as-needed` locale prefix logic in one place so
 *     metadata, sitemap, robots, and structured data all stay consistent.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel for production / preview deploys.
 * Local development without the env var falls back to portoprime.pt.
 */

import { routing } from '@/i18n/routing';

/** Absolute base URL of the site, no trailing slash. */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portoprime.pt'
).replace(/\/+$/, '');

/**
 * Build a path under the `as-needed` locale prefix strategy.
 *
 * Rules (matches i18n/routing.ts: localePrefix: 'as-needed'):
 *   - default locale (en)  → no /en prefix:  '/'           or '/services'
 *   - other locales        → /{locale}:      '/pt'         or '/pt/services'
 *
 * @param path   page path starting with `/`, or `'/'` for home
 * @param locale target locale
 */
export function localePath(path: string, locale: string): string {
  // Normalize: ensure leading slash, strip trailing
  const clean = path.startsWith('/') ? path : `/${path}`;
  const trimmed = clean.replace(/\/+$/, '') || '/';

  if (locale === routing.defaultLocale) {
    return trimmed;
  }

  // Non-default locale gets the prefix; '/' becomes '/{locale}'
  return trimmed === '/' ? `/${locale}` : `/${locale}${trimmed}`;
}

/**
 * Full absolute URL for a localized path.
 *
 * @example
 *   absoluteUrl('/', 'en')       // 'https://portoprime.pt'
 *   absoluteUrl('/', 'pt')       // 'https://portoprime.pt/pt'
 *   absoluteUrl('/services','ru') // 'https://portoprime.pt/ru/services'
 */
export function absoluteUrl(path: string, locale: string): string {
  const localized = localePath(path, locale);
  return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`;
}
