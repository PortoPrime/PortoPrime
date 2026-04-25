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
