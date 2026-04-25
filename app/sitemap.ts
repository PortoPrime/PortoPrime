/**
 * sitemap.xml — auto-generated for every locale × route combination.
 *
 * Next.js App Router auto-routes this file to /sitemap.xml at the site root.
 *
 * SEO rationale:
 *   - Lists every (route, locale) URL so Google discovers all 7 language
 *     versions instead of relying on internal linking alone.
 *   - Each entry exposes `alternates.languages` (hreflang) so Google
 *     knows the same content exists in other locales and serves the
 *     right one to each user.
 *   - `x-default` is added per-route as Google's fallback for regions
 *     without an exact language match.
 *
 * To add new pages: append paths to ROUTES below. Sitemap will fan
 * out across all 7 locales automatically.
 */

import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { absoluteUrl, localePath, SITE_URL } from '@/lib/site';

// ─── Route registry ─────────────────────────────────────────────────────────
/**
 * All public, indexable routes. Add new pages here as they are created.
 * Keep paths in app-router shape: '/', '/services', '/services/al-licensing'…
 *
 * The home page is always priority 1.0; deeper pages get 0.8 by default,
 * override per-route in the priority map below if needed.
 */
const ROUTES: readonly string[] = ['/'];

// Optional per-route overrides (lastModified, changeFrequency, priority).
const ROUTE_META: Record<
  string,
  {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
  }
> = {
  '/': { changeFrequency: 'weekly', priority: 1.0 },
};

// ─── Sitemap generator ──────────────────────────────────────────────────────
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.flatMap((path) => {
    const meta = ROUTE_META[path] ?? {};

    // Pre-compute the hreflang map for this route — same for every locale.
    const languages: Record<string, string> = Object.fromEntries(
      routing.locales.map((l) => [l, absoluteUrl(path, l)])
    );
    // x-default → default-locale URL (English root for PortoPrime).
    languages['x-default'] = absoluteUrl(path, routing.defaultLocale);

    return routing.locales.map((locale) => ({
      url:            absoluteUrl(path, locale),
      lastModified:   meta.lastModified ?? now,
      changeFrequency: meta.changeFrequency ?? 'weekly',
      priority:       meta.priority ?? 0.8,
      alternates:     { languages },
    }));
  });
}

// Re-export SITE_URL so the build can warn if it's misconfigured during
// `next build` — silent fallback to portoprime.pt is fine in production.
export { SITE_URL };
// Re-export the helper so consumers don't need a second import for tests.
export { localePath };
