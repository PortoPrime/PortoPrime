/**
 * Meta Conversions API (CAPI) — server-side event sender.
 *
 * Sends deduplicated events to Meta's Graph API alongside the browser Pixel.
 * Requires the following env vars:
 *   NEXT_PUBLIC_META_PIXEL_ID   — Pixel ID (public, also used by client Pixel)
 *   META_CAPI_ACCESS_TOKEN      — long-lived dataset token (server-only, never prefix NEXT_PUBLIC_)
 *   META_TEST_EVENT_CODE        — optional, paste while debugging in Events Manager → Test Events
 *
 * Dedup contract with the browser Pixel:
 *   The client MUST generate an `event_id` (UUID) and pass it BOTH:
 *     - to `fbq('track', name, data, { eventID })`
 *     - to the server (via the POST body), which forwards it as `event_id` to Graph API.
 *   Meta merges events that share the same (event_name, event_id) pair.
 *
 * PII hashing:
 *   Graph API requires SHA-256 (hex, lowercase) for email / phone / name / city / country.
 *   IP, user-agent, fbc, fbp MUST be sent RAW (no hashing).
 */

import crypto from 'node:crypto';

// ─── Config ─────────────────────────────────────────────────────────────────
const GRAPH_API_VERSION = 'v21.0';
const PIXEL_ID          = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const ACCESS_TOKEN      = process.env.META_CAPI_ACCESS_TOKEN    || '';
const TEST_EVENT_CODE   = process.env.META_TEST_EVENT_CODE      || '';

// ─── Types ──────────────────────────────────────────────────────────────────
/** Raw PII + browser context collected from the request — BEFORE hashing. */
export interface CapiUserData {
  email?:     string;
  phone?:     string;
  firstName?: string;
  lastName?:  string;
  city?:      string;
  country?:   string; // ISO 3166-1 alpha-2, lowercase (e.g. "pt")
  /** Client IP, unhashed (raw). */
  clientIp?:  string;
  /** User-Agent header, unhashed. */
  userAgent?: string;
  /** _fbc cookie value (click ID). Unhashed. */
  fbc?:       string;
  /** _fbp cookie value (browser ID). Unhashed. */
  fbp?:       string;
}

/** Event-specific data — stays free-form per Meta's schema. */
export interface CapiCustomData {
  [key: string]: unknown;
}

export interface CapiEventInput {
  eventName:    string;         // e.g. "Contact", "CompleteRegistration", "ViewContent"
  eventId:      string;         // MUST match the fbq() eventID on the client
  eventTime?:   number;         // unix seconds; defaults to now
  actionSource?: 'website' | 'app' | 'email' | 'other';
  sourceUrl?:   string;         // full URL where the event occurred
  userData:     CapiUserData;
  customData?:  CapiCustomData;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
/** SHA-256 → lowercase hex. Returns undefined for empty input. */
function sha256(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normalize phone to digits-only before hashing (Meta recommendation).
 * Drops "+", spaces, dashes, parentheses.
 */
function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  return digits || undefined;
}

/**
 * Build the Graph API user_data object.
 * Hashes PII fields; leaves IP / UA / fbc / fbp in raw form.
 */
function buildUserData(u: CapiUserData): Record<string, string> {
  const ud: Record<string, string> = {};

  const em = sha256(u.email);
  if (em) ud.em = em;

  const ph = sha256(normalizePhone(u.phone));
  if (ph) ud.ph = ph;

  const fn = sha256(u.firstName);
  if (fn) ud.fn = fn;

  const ln = sha256(u.lastName);
  if (ln) ud.ln = ln;

  const ct = sha256(u.city);
  if (ct) ud.ct = ct;

  const co = sha256(u.country);
  if (co) ud.country = co;

  if (u.clientIp)  ud.client_ip_address = u.clientIp;
  if (u.userAgent) ud.client_user_agent = u.userAgent;
  if (u.fbc)       ud.fbc = u.fbc;
  if (u.fbp)       ud.fbp = u.fbp;

  return ud;
}

// ─── Main sender ────────────────────────────────────────────────────────────
/**
 * Send a single event to the Conversions API.
 *
 * Never throws — logs errors and returns success flag so the upstream
 * handler (lead POST) doesn't fail if Meta is temporarily unreachable.
 */
export async function sendCapiEvent(input: CapiEventInput): Promise<{ ok: boolean; error?: string }> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('[MetaCAPI] Missing NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN — skipping event');
    return { ok: false, error: 'missing_credentials' };
  }

  const event: Record<string, unknown> = {
    event_name:    input.eventName,
    event_time:    input.eventTime ?? Math.floor(Date.now() / 1000),
    event_id:      input.eventId,
    action_source: input.actionSource ?? 'website',
    user_data:     buildUserData(input.userData),
  };
  if (input.sourceUrl)  event.event_source_url = input.sourceUrl;
  if (input.customData) event.custom_data      = input.customData;

  const body: Record<string, unknown> = { data: [event] };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    const responseText = await res.text().catch(() => '');

    if (!res.ok) {
      console.error(`[MetaCAPI] ${input.eventName} failed ${res.status}: ${responseText}`);
      return { ok: false, error: `http_${res.status}` };
    }

    // Success — verbose response logging only in dev/preview so production
    // logs stay clean. Errors above are logged regardless.
    if (process.env.NODE_ENV !== 'production') {
      try {
        const parsed = JSON.parse(responseText);
        console.info(`[MetaCAPI] ${input.eventName} OK — response:`, {
          events_received: parsed.events_received,
          messages:        parsed.messages,
          fbtrace_id:      parsed.fbtrace_id,
          test_code_sent:  TEST_EVENT_CODE || '(none)',
        });
      } catch {
        console.info(`[MetaCAPI] ${input.eventName} OK — raw response: ${responseText}`);
      }
    }

    return { ok: true };
  } catch (err) {
    console.error(`[MetaCAPI] ${input.eventName} network error:`, err);
    return { ok: false, error: 'network_error' };
  }
}

// ─── Typed event builders ───────────────────────────────────────────────────
// Thin wrappers so callers don't have to remember the exact Meta event names.

export function sendContactEvent(args: {
  eventId:   string;
  userData:  CapiUserData;
  sourceUrl?: string;
  revenue?:   string; // the calculator's estimated monthly revenue, as a label
}) {
  return sendCapiEvent({
    eventName: 'Contact',
    eventId:   args.eventId,
    sourceUrl: args.sourceUrl,
    userData:  args.userData,
    customData: args.revenue ? { estimated_revenue: args.revenue } : undefined,
  });
}

export function sendCompleteRegistrationEvent(args: {
  eventId:   string;
  userData:  CapiUserData;
  sourceUrl?: string;
}) {
  return sendCapiEvent({
    eventName: 'CompleteRegistration',
    eventId:   args.eventId,
    sourceUrl: args.sourceUrl,
    userData:  args.userData,
    customData: { content_name: 'Portugal Investment Guide 2026', source: 'lead_magnet' },
  });
}

export function sendViewContentEvent(args: {
  eventId:   string;
  userData:  CapiUserData;
  sourceUrl?: string;
}) {
  return sendCapiEvent({
    eventName: 'ViewContent',
    eventId:   args.eventId,
    sourceUrl: args.sourceUrl,
    userData:  args.userData,
  });
}
