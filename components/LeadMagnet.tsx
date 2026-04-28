'use client';

import { useState, useId } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, BookOpen, CheckCircle2 } from 'lucide-react';
import { newEventId, setUserData, trackCompleteRegistration } from '@/lib/meta-pixel';
import { ensureUtm } from '@/lib/utm';

// ─── PDF Download utility ─────────────────────────────────────────────────────
/**
 * Programmatically triggers a browser file download.
 * Creates a temporary <a download> element, clicks it, and removes it.
 * SSR-safe: no-ops when `document` is not available.
 */
function triggerDownload(url: string, filename: string): void {
  if (typeof document === 'undefined') return;
  const link     = document.createElement('a');
  link.href      = url;
  link.download  = filename;
  link.rel       = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── LeadMagnet Component ─────────────────────────────────────────────────────
export function LeadMagnet() {
  const t   = useTranslations('leadMagnet');
  const uid = useId();

  const [email,       setEmail]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [errorMsg,    setErrorMsg]    = useState('');

  // ── Basic email validation ─────────────────────────────────────────────
  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // ── Meta Pixel + CAPI dedup id — shared between browser and server ─
      const eventId = newEventId();
      const cleanEmail = email.trim();

      // ── Advanced Matching — re-init Pixel with hashed email so the next
      // track() call carries it as user_data, raising EMQ score (lower CPL).
      setUserData({
        email:   cleanEmail,
        country: 'pt',
      });

      // ── Fire browser Pixel CompleteRegistration (deduped via eventId) ──
      trackCompleteRegistration(eventId, {
        content_name: 'Portugal Investment Guide 2026',
        source:       'lead_magnet',
      });

      // ── Trigger PDF download immediately (don't block on API) ──────────
      triggerDownload(
        '/docs/Portugal-Investment-Guide-2026.pdf',
        'Portugal-Investment-Guide-2026.pdf',
      );

      // ── Capture lead in background — non-critical, fire-and-forget ────
      // Server also fires Meta CAPI CompleteRegistration with the SAME
      // eventId for dedup. Email goes in the `email` field so CAPI can hash
      // and send it as the primary match key.
      const utm = ensureUtm();
      fetch('/api/lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     cleanEmail,
          phone:    '+000000000000', // guide requests have no phone
          email:    cleanEmail,
          location: 'Guide Request',
          revenue:  cleanEmail,      // used as email identifier in admin notification
          eventId,
          source:   'lead_magnet',
          utm,
        }),
      }).catch(() => { /* non-critical — download already started */ });

      // ── Clear field + show success banner ──────────────────────────────
      setEmail('');
      setSuccess(true);

    } finally {
      setLoading(false);
    }
  };

  // ── Badge chips (badge1 = page count removed per product decision) ────
  const badges = [t('badge2'), t('badge3')];

  return (
    <section
      id="guide"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f1e33 0%, #1B263B 50%, #0f1e33 100%)',
      }}
      aria-label="Free Investment Guide"
    >
      {/* ── Background decorative circles ──────────────────────────── */}
      <div
        className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #E0C397 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #7EC8C8 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── Left: 3D Book Mockup ──────────────────────────────────── */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto">
            {/*
              Pure CSS 3D book:
              - perspective on wrapper enables depth
              - rotateY(-20deg) + rotateX(5deg) on the book creates the angled look
              - :spine is a narrow left-edge strip
              - :cover is the main face
              - :page-stack is the subtle right edge showing page thickness
            */}
            <div
              className="relative"
              style={{
                perspective:       '1000px',
                perspectiveOrigin: '50% 50%',
                width:             '220px',
                height:            '290px',
              }}
              aria-hidden="true"
            >
              {/* Book wrapper — 3D rotated */}
              <div
                style={{
                  width:       '200px',
                  height:      '280px',
                  position:    'relative',
                  transform:   'rotateY(-20deg) rotateX(4deg)',
                  transformStyle: 'preserve-3d',
                  transition:  'transform 0.6s ease',
                  margin:      '0 auto',
                }}
              >
                {/* Front cover */}
                <div
                  style={{
                    position:     'absolute',
                    inset:        0,
                    borderRadius: '4px 10px 10px 4px',
                    background:   'linear-gradient(160deg, #1a3a5c 0%, #1B263B 60%, #0f1e33 100%)',
                    border:       '1px solid rgba(224,195,151,0.3)',
                    padding:      '28px 22px',
                    display:      'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow:    '6px 6px 20px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Top icon */}
                  <div
                    style={{
                      width:       '44px',
                      height:      '44px',
                      borderRadius: '12px',
                      background:  'rgba(201,169,110,0.15)',
                      border:      '1px solid rgba(201,169,110,0.3)',
                      display:     'flex',
                      alignItems:  'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BookOpen style={{ width: '22px', height: '22px', color: '#C9A96E' }} strokeWidth={1.5} />
                  </div>

                  {/* Title area */}
                  <div>
                    <p
                      style={{
                        color:       '#E0C397',
                        fontSize:    '18px',
                        fontWeight:  700,
                        lineHeight:  '1.2',
                        fontFamily:  'Playfair Display, Georgia, serif',
                        whiteSpace:  'pre-line',
                        marginBottom: '10px',
                      }}
                    >
                      {t('bookTitle')}
                    </p>
                    <div
                      style={{
                        height:     '2px',
                        width:      '40px',
                        background: 'linear-gradient(90deg, #C9A96E, transparent)',
                        marginBottom: '8px',
                      }}
                    />
                    <p
                      style={{
                        color:      'rgba(255,255,255,0.4)',
                        fontSize:   '12px',
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                      }}
                    >
                      {t('bookYear')}
                    </p>
                  </div>

                  {/* Bottom brand */}
                  <p
                    style={{
                      color:       '#C9A96E',
                      fontSize:    '11px',
                      fontWeight:  700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    PortoPrime
                  </p>
                </div>

                {/* Book spine (left side) */}
                <div
                  style={{
                    position:    'absolute',
                    top:         0,
                    left:        '-16px',
                    width:       '16px',
                    height:      '100%',
                    background:  'linear-gradient(to right, #0a1520, #1a2d4a)',
                    borderRadius: '4px 0 0 4px',
                    transform:   'rotateY(90deg)',
                    transformOrigin: 'right center',
                    border:      '1px solid rgba(224,195,151,0.15)',
                  }}
                />

                {/* Page stack (right side, subtle) */}
                <div
                  style={{
                    position:   'absolute',
                    top:        '2px',
                    right:      '-4px',
                    width:      '8px',
                    height:     'calc(100% - 4px)',
                    background: 'repeating-linear-gradient(to bottom, #e8dcc8 0px, #e8dcc8 1px, #f5f0e8 1px, #f5f0e8 3px)',
                    borderRadius: '0 2px 2px 0',
                    opacity:    0.6,
                  }}
                />
              </div>

              {/* Drop shadow beneath book */}
              <div
                style={{
                  position:   'absolute',
                  bottom:     '-20px',
                  left:       '50%',
                  transform:  'translateX(-50%)',
                  width:      '160px',
                  height:     '20px',
                  background: 'rgba(0,0,0,0.35)',
                  filter:     'blur(12px)',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>

          {/* ── Right: Copy + Form ────────────────────────────────────── */}
          <div className="flex-1 min-w-0 text-center lg:text-left">

            {/* Eyebrow */}
            <p
              className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{ color: '#C9A96E', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}
            >
              {t('eyebrow')}
            </p>

            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight text-white"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              {t('headline')}
            </h2>

            {/* Subheadline */}
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg">
              {t('subheadline')}
            </p>

            {/* Badge chips */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full"
                  style={{
                    color:      '#C9A96E',
                    background: 'rgba(201,169,110,0.1)',
                    border:     '1px solid rgba(201,169,110,0.2)',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Email form / success state */}
            {success ? (
              <div
                className="flex items-start gap-4 p-6 rounded-2xl max-w-md mx-auto lg:mx-0"
                style={{ background: 'rgba(126,200,200,0.1)', border: '1px solid rgba(126,200,200,0.3)' }}
              >
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#7EC8C8' }} strokeWidth={1.8} />
                <div>
                  <p className="font-semibold text-white mb-1">{t('successTitle')}</p>
                  <p className="text-sm text-white/60">
                    {t('successMessage')}{' '}
                    {/* Fallback manual download link */}
                    <a
                      href="/docs/Portugal-Investment-Guide-2026.pdf"
                      download="Portugal-Investment-Guide-2026.pdf"
                      rel="noopener"
                      className="underline underline-offset-2 transition-colors duration-150"
                      style={{ color: '#C9A96E' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E0C397')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#C9A96E')}
                    >
                      {t('successLinkText')}
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0"
                noValidate
              >
                {/* Email input */}
                <div className="relative flex-1">
                  <label htmlFor={`${uid}-email`} className="sr-only">
                    {t('emailLabel')}
                  </label>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                    <Mail className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} strokeWidth={1.8} />
                  </div>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
                    placeholder={t('emailPlaceholder')}
                    disabled={loading}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 disabled:opacity-50"
                    style={{
                      background:  'rgba(255,255,255,0.07)',
                      border:      errorMsg
                        ? '1px solid rgba(239,68,68,0.6)'
                        : '1px solid rgba(255,255,255,0.12)',
                      color:       '#fff',
                    }}
                    onFocus={e => {
                      if (!errorMsg) e.currentTarget.style.border = '1px solid rgba(201,169,110,0.5)';
                    }}
                    onBlur={e => {
                      if (!errorMsg) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)';
                    }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #C9A96E 0%, #E0C397 100%)',
                    color:      '#1B263B',
                  }}
                >
                  {loading ? t('submitting') : t('submit')}
                </button>
              </form>
            )}

            {/* Error message */}
            {errorMsg && (
              <p className="mt-2 text-xs text-red-400 max-w-md mx-auto lg:mx-0">{errorMsg}</p>
            )}

            {/* Privacy note */}
            {!success && (
              <p className="mt-3 text-xs text-white/35 max-w-md mx-auto lg:mx-0">
                {t('privacy')}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
