/**
 * Meta Pixel — client-side event helpers.
 *
 * Usage:
 *   1. The base Pixel snippet is loaded in app/[locale]/layout.tsx — it exposes
 *      the global `window.fbq` function.
 *   2. Import the typed helpers below from any 'use client' component.
 *   3. For events that ALSO go through the Conversions API (Contact,
 *      CompleteRegistration), generate an `eventId` with `newEventId()` and
 *      pass the SAME id to both `trackEvent(...)` and the server endpoint.
 *
 * Dedup:
 *   Meta merges Pixel + CAPI events that share the same (event_name, event_id).
 *   Without dedup, conversions are double-counted.
 */

// ─── Global declaration ────────────────────────────────────────────────────
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown };
    _fbq?: unknown;
  }
}

// ─── Event ID generator ────────────────────────────────────────────────────
/**
 * Returns a cryptographically unique event ID.
 * Prefers the native `crypto.randomUUID` (all modern browsers); falls back
 * to a timestamp-based id for very old runtimes.
 */
export function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ─── Core tracker ──────────────────────────────────────────────────────────
/**
 * Fire a standard Meta Pixel event.
 *
 * @param eventName One of Meta's standard events (Contact, CompleteRegistration, ViewContent, etc.)
 * @param data      Event-specific custom data (content_name, value, etc.)
 * @param eventId   Optional — REQUIRED if the same event is also sent via CAPI (for dedup)
 */
export function trackEvent(
  eventName: string,
  data?: Record<string, unknown>,
  eventId?: string,
): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  if (eventId) {
    window.fbq('track', eventName, data ?? {}, { eventID: eventId });
  } else {
    window.fbq('track', eventName, data ?? {});
  }
}

// ─── Typed helpers ─────────────────────────────────────────────────────────
export function trackContact(eventId: string, data?: Record<string, unknown>): void {
  trackEvent('Contact', data, eventId);
}

export function trackCompleteRegistration(eventId: string, data?: Record<string, unknown>): void {
  trackEvent('CompleteRegistration', data, eventId);
}

export function trackViewContent(eventId?: string, data?: Record<string, unknown>): void {
  trackEvent('ViewContent', data, eventId);
}

// ─── Advanced Matching ─────────────────────────────────────────────────────
/**
 * Re-init Pixel with user data so subsequent events include hashed PII for
 * matching. Meta hashes values automatically client-side (SHA-256) — pass
 * normalized PLAIN values, not pre-hashed ones.
 *
 * Call this RIGHT BEFORE trackContact / trackCompleteRegistration, after the
 * user has filled in the form. The Pixel will re-init and the next track()
 * call inherits the user_data block, raising EMQ score and lowering CPL.
 *
 * Normalization rules (Meta requirements):
 *   - email:   lowercase, trimmed
 *   - phone:   digits only (strip "+", spaces, dashes)
 *   - names:   lowercase, trimmed
 *   - city:    lowercase, trimmed, no diacritics is ideal but not required
 *   - country: ISO 3166-1 alpha-2, lowercase (e.g. "pt")
 */
export interface PixelUserData {
  email?:     string;
  phone?:     string;
  firstName?: string;
  lastName?:  string;
  city?:      string;
  country?:   string;
}

export function setUserData(u: PixelUserData): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return;

  // Build the advanced matching object — Meta's keys are short codes (em, ph...)
  const ud: Record<string, string> = {};

  if (u.email) {
    const em = u.email.trim().toLowerCase();
    if (em) ud.em = em;
  }
  if (u.phone) {
    const ph = u.phone.replace(/\D/g, '');
    if (ph) ud.ph = ph;
  }
  if (u.firstName) {
    const fn = u.firstName.trim().toLowerCase();
    if (fn) ud.fn = fn;
  }
  if (u.lastName) {
    const ln = u.lastName.trim().toLowerCase();
    if (ln) ud.ln = ln;
  }
  if (u.city) {
    const ct = u.city.trim().toLowerCase();
    if (ct) ud.ct = ct;
  }
  if (u.country) {
    const co = u.country.trim().toLowerCase();
    if (co) ud.country = co;
  }

  if (Object.keys(ud).length === 0) return;

  // Re-init Pixel with advanced matching data — fbq merges this into all
  // subsequent track() calls until the page is reloaded.
  window.fbq('init', pixelId, ud);
}
