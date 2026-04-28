/**
 * UTM tracking utilities.
 *
 * Captures Meta/Google ad-attribution params from URL on first arrival and
 * persists them to sessionStorage so they survive client-side navigation
 * within the same tab. Consumers (LeadForm, LeadMagnet) read them at submit
 * time and ship them with the payload to /api/lead.
 *
 * SessionStorage (not localStorage) is intentional — UTMs should describe
 * the current visit, not leak across browser sessions.
 */

export interface UtmParams {
  source?:   string; // utm_source — e.g. 'meta', 'google'
  medium?:   string; // utm_medium — e.g. 'cpc', 'paid_social'
  campaign?: string; // utm_campaign — e.g. 'al_licensing_q2'
  content?:  string; // utm_content — e.g. 'video_intro_30s'
  term?:     string; // utm_term — e.g. 'gestao alojamento local'
  /** Facebook click id forwarded as ?fbclid= — useful for offline backfill. */
  fbclid?:   string;
  /** Google click id forwarded as ?gclid= */
  gclid?:    string;
  /** ISO timestamp of first capture — helps debug attribution. */
  capturedAt?: string;
}

const STORAGE_KEY = 'pp_utm';

const PARAM_KEYS: ReadonlyArray<keyof UtmParams> = [
  'source', 'medium', 'campaign', 'content', 'term', 'fbclid', 'gclid',
];

/**
 * Read URL search params, extract UTM/click-id keys, return a sanitized object.
 * Returns null if no relevant params are present.
 */
function parseFromUrl(search: string): UtmParams | null {
  const params = new URLSearchParams(search);
  const out: UtmParams = {};

  for (const key of PARAM_KEYS) {
    // utm_source → 'utm_source'; fbclid stays 'fbclid'.
    const urlKey = key === 'fbclid' || key === 'gclid' ? key : `utm_${key}`;
    const v = params.get(urlKey);
    if (v) out[key] = v.slice(0, 200); // cap length defensively
  }

  if (Object.keys(out).length === 0) return null;
  out.capturedAt = new Date().toISOString();
  return out;
}

/**
 * Capture UTM params from the current URL into sessionStorage.
 * Safe to call multiple times — first non-empty capture wins per session
 * (subsequent calls with empty URL params do not overwrite).
 *
 * Call once on app mount (e.g. from a small client component in the layout)
 * OR lazily from the first form that needs them.
 */
export function captureUtmFromCurrentUrl(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  // If already captured this session, keep it (don't overwrite with later
  // navigations that drop the query string).
  const existing = readUtm();
  if (existing) return existing;

  const fresh = parseFromUrl(window.location.search);
  if (!fresh) return null;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // Storage may be disabled (Safari private mode). Silent fallback.
  }
  return fresh;
}

/**
 * Read previously-captured UTM params from sessionStorage.
 * Returns null if nothing has been captured.
 */
export function readUtm(): UtmParams | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UtmParams;
  } catch {
    return null;
  }
}

/**
 * Convenience: capture then read in a single call.
 * Use inside form submit handlers — guarantees UTMs are picked up even if
 * the user landed on the page before any other component captured them.
 */
export function ensureUtm(): UtmParams | null {
  return captureUtmFromCurrentUrl() ?? readUtm();
}
