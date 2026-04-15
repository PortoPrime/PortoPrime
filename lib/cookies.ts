// ─── Cookie Utility ────────────────────────────────────────────────────────
// Simple native document.cookie wrappers — no external dependencies.

const COOKIE_CONSENT_KEY = 'pp_cookie_consent';
const LOCALE_KEY         = 'pp_locale';
const CALC_KEY           = 'pp_calc';

/** Set a cookie with an optional max-age in days (default: 365). */
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=/;SameSite=Lax`;
}

/** Read a cookie by name. Returns null if not found. */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

/** Remove a cookie immediately. */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;max-age=0;path=/`;
}

// ─── Typed helpers ─────────────────────────────────────────────────────────

export const consent = {
  get: ()           => getCookie(COOKIE_CONSENT_KEY) === 'true',
  set: ()           => setCookie(COOKIE_CONSENT_KEY, 'true', 365),
};

export const localeCookie = {
  get: ()           => getCookie(LOCALE_KEY),
  set: (l: string)  => setCookie(LOCALE_KEY, l, 365),
};

export interface CalcState {
  location:     string;
  propertyType: string;
  condition:    number;
  occupancy:    number;
  feeTier:      string;
}

export const calcCookie = {
  get: (): CalcState | null => {
    const raw = getCookie(CALC_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as CalcState; } catch { return null; }
  },
  set: (state: CalcState) => setCookie(CALC_KEY, JSON.stringify(state), 30),
};
