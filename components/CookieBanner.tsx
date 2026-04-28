'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { consent } from '@/lib/cookies';

// ─── Cookie Consent Banner ──────────────────────────────────────────────────
// Shown once until user clicks "Accept". Consent is stored in pp_cookie_consent.
export function CookieBanner() {
  const t = useTranslations('cookies');
  const [visible, setVisible] = useState(false);

  // Check consent on mount (client-only)
  useEffect(() => {
    if (!consent.get()) setVisible(true);
  }, []);

  const handleAccept = () => {
    consent.set();
    // Notify any consent-gated trackers (Meta Pixel, future analytics).
    // Custom event listeners pick this up on the same tick and mount.
    window.dispatchEvent(new Event('pp:consent:granted'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('ariaLabel')}
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 z-[60]
        w-[calc(100%-2rem)] max-w-xl
        flex flex-col sm:flex-row items-start sm:items-center gap-4
        px-5 py-4 rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.35)]
        border border-white/10
        animate-fade-in
      "
      style={{
        background: 'rgba(18,28,45,0.97)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Message */}
      <p className="flex-1 text-sm text-white/70 leading-relaxed">
        {t('message')}
      </p>

      {/* Accept button */}
      <button
        onClick={handleAccept}
        className="
          flex-shrink-0 h-9 px-5 rounded-full
          text-sm font-semibold text-[#1B263B]
          transition-all duration-200
          hover:scale-105 hover:shadow-[0_0_16px_rgba(224,195,151,0.4)]
          active:scale-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C397]
        "
        style={{ background: 'linear-gradient(135deg, #E0C397, #C9A96E)' }}
      >
        {t('accept')}
      </button>
    </div>
  );
}
