/**
 * Locale-aware navigation helpers for next-intl.
 *
 * Replaces direct usage of next/link's <Link> and next/navigation's <Router>
 * with versions that automatically prepend the active locale to internal
 * paths under the `as-needed` strategy:
 *   - default locale (en)  → no prefix:    /privacy
 *   - other locales        → /{locale}/...: /pt/privacy, /ru/privacy
 *
 * Usage in client components:
 *   import { Link } from '@/i18n/navigation';
 *   <Link href="/privacy">Privacy Policy</Link>
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
