import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'pt', 'ru', 'de', 'fr', 'it', 'es'],

  // Default locale (English)
  defaultLocale: 'en',

  // Prefix strategy: always show locale in URL except for default
  localePrefix: 'as-needed',

  // Persist the chosen locale in a cookie so returning visitors land on the
  // correct language without needing the URL prefix.
  localeCookie: { name: 'pp_locale', maxAge: 365 * 24 * 60 * 60 },
});
