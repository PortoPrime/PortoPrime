'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import {
  Send,
  Loader2,
  X,
  CheckCircle2,
  MessageCircle,
  User,
  Phone,
  MapPin,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { newEventId, setUserData, trackContact } from '@/lib/meta-pixel';
import { captureUtmFromCurrentUrl, ensureUtm } from '@/lib/utm';

// ─── WhatsApp deep link ─────────────────────────────────────────────────────
const WA_HREF =
  'https://wa.me/351915481058?text=Hello!%20I%20just%20finished%20the%20calculation%20on%20PortoPrime%20and%20would%20like%20to%20discuss%20managing%20my%20property.';

// ─── Custom event name (dispatched by Calculator CTA) ──────────────────────
const REVENUE_EVENT = 'portoprime:revenue';

// ─── Small reusable input wrapper ──────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  /** If provided, renders an "(Optional)" badge next to the label */
  optionalLabel?: string;
  error?: boolean;
}
function FormInput({ label, icon, optionalLabel, error, ...props }: InputProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-gray-500 mb-2">
        {icon}
        {label}
        {optionalLabel && (
          <span
            className="ml-1 normal-case font-normal text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ color: 'rgba(201,169,110,0.8)', background: 'rgba(201,169,110,0.1)' }}
          >
            {optionalLabel}
          </span>
        )}
      </label>
      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl text-sm text-[#1B263B]
          border bg-white transition-all duration-200
          placeholder:text-gray-300
          focus:outline-none focus:ring-2 focus:ring-[#E0C397]/60 focus:border-[#E0C397]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
      />
    </div>
  );
}

// ─── Success Modal ──────────────────────────────────────────────────────────
interface SuccessModalProps {
  tModal: (key: string) => string;
  onClose: () => void;
}
function SuccessModal({ tModal, onClose }: SuccessModalProps) {
  // Trap focus inside modal & close on Escape
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,20,32,0.75)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={tModal('successTitle')}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(155deg, #1B263B 0%, #263554 100%)' }}
      >
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="
            absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
            text-white/40 hover:text-white/80 hover:bg-white/10
            transition-all duration-200
          "
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center">
          {/* Success icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(224,195,151,0.12)', border: '1px solid rgba(224,195,151,0.25)' }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: '#E0C397' }} strokeWidth={1.5} />
          </div>

          {/* Headline */}
          <h3
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {tModal('successTitle')}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed mb-7">
            {tModal('successMessage')}
          </p>

          {/* WhatsApp CTA — primary action */}
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2.5 w-full
              px-6 py-3.5 rounded-2xl mb-3
              font-bold text-sm text-white
              transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(37,211,102,0.4)]
              active:scale-100
            "
            style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
          >
            <MessageCircle className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '1.1rem', height: '1.1rem' }} />
            {tModal('modalWhatsapp')}
          </a>

          {/* Dismiss link */}
          <button
            onClick={onClose}
            className="text-xs text-white/35 hover:text-white/60 transition-colors duration-200 mt-1"
          >
            {tModal('modalClose')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LeadForm Component ─────────────────────────────────────────────────────
export function LeadForm() {
  const t = useTranslations('contact');

  // ── Form state ────────────────────────────────────────────────────────────
  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [location, setLocation] = useState('');
  /** Pre-filled from Calculator's custom event; shows as a read-only hint */
  const [revenue,  setRevenue]  = useState('');
  /** Honeypot — invisible to humans, always empty on legit submissions */
  const [honeypot, setHoneypot] = useState('');

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ── Listen for Calculator revenue event ──────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const rev = (e as CustomEvent<{ revenue: string }>).detail?.revenue;
      if (rev) setRevenue(rev);
    };
    window.addEventListener(REVENUE_EVENT, handler);
    return () => window.removeEventListener(REVENUE_EVENT, handler);
  }, []);

  // ── Capture UTM params on mount so they persist for this session ─────────
  // Idempotent — first capture wins; subsequent calls don't overwrite.
  useEffect(() => {
    captureUtmFromCurrentUrl();
  }, []);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side guard — location is optional; name + phone are required
    if (!name.trim() || !phone.trim()) {
      setError(t('form.errorRequired'));
      return;
    }

    setLoading(true);
    try {
      // ── Meta Pixel + CAPI dedup id — same id goes to both paths ─────────
      const eventId = newEventId();

      // ── UTM attribution — captured on landing, read at submit ──────────
      const utm = ensureUtm();

      const res = await fetch('/api/lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     name.trim(),
          phone:    phone.trim(),
          location: location.trim(),
          revenue:  revenue.trim() || undefined,
          eventId,
          source:   'contact',
          utm,
          _hp:      honeypot,
        }),
      });

      if (res.ok) {
        // ── Advanced Matching — re-init Pixel with user data so the next
        // track() call carries hashed PII for higher EMQ score (lower CPL).
        // Split full name into first/last on the first space.
        const trimmedName = name.trim();
        const spaceIdx    = trimmedName.indexOf(' ');
        const firstName   = spaceIdx > 0 ? trimmedName.slice(0, spaceIdx)  : trimmedName;
        const lastName    = spaceIdx > 0 ? trimmedName.slice(spaceIdx + 1) : '';

        setUserData({
          phone:     phone.trim(),
          firstName,
          lastName,
          city:      location.trim() || undefined,
          country:   'pt',
        });

        // ── Fire browser Pixel Contact event (deduped via eventId) ───────
        trackContact(eventId, {
          content_name: 'Lead Form Submission',
          ...(revenue ? { estimated_revenue: revenue } : {}),
        });

        // Reset fields and show success modal
        setName(''); setPhone(''); setLocation(''); setRevenue('');
        setShowModal(true);
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error === 'invalid_phone')  setError(t('form.errorPhone'));
        else if (data.error === 'rate_limit') setError(t('form.errorRateLimit'));
        else                                   setError(t('form.errorServer'));
      }
    } catch {
      setError(t('form.errorServer'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Contact Section ──────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-24 md:py-32 relative overflow-hidden"
        style={{ background: 'linear-gradient(175deg, #1B263B 0%, #0D1826 100%)' }}
        aria-label="Contact"
      >
        {/* Background decorative orbs */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.07]"
          style={{ background: '#E0C397', filter: 'blur(120px)', transform: 'translate(-50%, -40%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.05]"
          style={{ background: '#7EC8C8', filter: 'blur(100px)', transform: 'translate(50%, 40%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section header ──────────────────────────────────────────── */}
          <div className="text-center mb-12">
            <p
              className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{ color: '#C9A96E', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}
            >
              {t('eyebrow')}
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              {t('headline')}
            </h2>
          </div>

          {/* ── Form card ───────────────────────────────────────────────── */}
          <div
            className="rounded-3xl p-8 md:p-10"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border:     '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <form onSubmit={handleSubmit} noValidate>

              {/* ── Honeypot — hidden from real users ──────────────────── */}
              {/*
                Positioned off-screen, no label visible to assistive tech.
                Bots filling forms programmatically will populate this.
              */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
              >
                <label htmlFor="__hp">Leave this empty</label>
                <input
                  id="__hp"
                  name="__hp"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* ── Fields grid ────────────────────────────────────────── */}
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {/* Name */}
                <FormInput
                  label={t('form.name')}
                  icon={<User className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />}
                  type="text"
                  placeholder={t('form.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  disabled={loading}
                />

                {/* Phone */}
                <FormInput
                  label={t('form.phone')}
                  icon={<Phone className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />}
                  type="tel"
                  placeholder={t('form.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  disabled={loading}
                />
              </div>

              {/* Property Location — full width, OPTIONAL (future owners may not have a property yet) */}
              <div className="mb-5">
                <FormInput
                  label={t('form.location')}
                  icon={<MapPin className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />}
                  optionalLabel={t('form.optional')}
                  type="text"
                  placeholder={t('form.locationPlaceholder')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Estimated Revenue — pre-filled from Calculator, optional */}
              {revenue && (
                <div className="mb-5">
                  <label className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-gray-500 mb-2">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />
                    {t('form.revenueLabel')}
                  </label>
                  <div
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold border"
                    style={{
                      color:      '#C9A96E',
                      background: 'rgba(201,169,110,0.07)',
                      border:     '1px solid rgba(201,169,110,0.2)',
                    }}
                  >
                    {revenue}
                  </div>
                </div>
              )}

              {/* ── Error message ───────────────────────────────────────── */}
              {error && (
                <div
                  className="mb-5 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border:     '1px solid rgba(239,68,68,0.3)',
                    color:      '#FCA5A5',
                  }}
                  role="alert"
                >
                  <span className="flex-shrink-0 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* ── Submit button ───────────────────────────────────────── */}
              <button
                type="submit"
                disabled={loading}
                className="
                  flex items-center justify-center gap-2.5 w-full
                  px-6 py-4 rounded-2xl
                  font-bold text-sm text-[#1B263B]
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(224,195,151,0.4)]
                  active:scale-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C397]
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                "
                style={{ background: 'linear-gradient(135deg, #E0C397 0%, #C9A96E 100%)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    {t('form.submitting')}
                  </>
                ) : (
                  <>
                    {t('form.submit')}
                    <Send className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  </>
                )}
              </button>

              {/* Privacy note */}
              <p className="text-center text-[11px] text-white/30 mt-4 flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3 flex-shrink-0" />
                {t('form.privacy')}
              </p>

            </form>
          </div>
        </div>
      </section>

      {/* ── Success Modal ──────────────────────────────────────────────────── */}
      {showModal && (
        <SuccessModal
          tModal={(key) => t(`form.${key}`)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
