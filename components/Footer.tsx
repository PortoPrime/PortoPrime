'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, MapPin, Scale } from 'lucide-react';
// Locale-aware Link — preserves `/{locale}` prefix when present so footer
// navigation (privacy, terms, legal, home) keeps the visitor in their language.
import { Link } from '@/i18n/navigation';

// ─── Footer Component ──────────────────────────────────────────────────────
export function Footer() {
  const t = useTranslations('footer');

  // Build year dynamically so it never goes stale
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{ background: '#0D1826', borderColor: 'rgba(255,255,255,0.07)' }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">

        {/* ── Main row ──────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* Brand block */}
          <div className="max-w-xs">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4 group"
              aria-label="PortoPrime — Home"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #E0C397, #C9A96E)' }}
              >
                <TrendingUp className="w-4 h-4 text-[#1B263B]" strokeWidth={2.5} />
              </div>
              <span
                className="text-xl font-bold tracking-tight text-white"
                style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.01em' }}
              >
                Porto<span className="text-gradient-gold">Prime</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-white/45 leading-relaxed mb-3">
              {t('tagline')}
            </p>

            {/* Locations */}
            <p className="flex items-center gap-1.5 text-xs text-white/30">
              <MapPin
                className="w-3 h-3 flex-shrink-0"
                style={{ color: '#C9A96E' }}
                strokeWidth={2}
              />
              {t('locations')}
            </p>
          </div>

          {/* Navigation links */}
          <nav
            className="flex flex-col sm:flex-row flex-wrap gap-y-3 gap-x-8 text-sm"
            aria-label="Footer navigation"
          >
            {/* Privacy & Terms */}
            <div className="flex flex-col gap-3">
              <Link
                href="/privacy"
                className="text-white/40 hover:text-white/75 transition-colors duration-200"
              >
                {t('privacy')}
              </Link>
              <Link
                href="/terms"
                className="text-white/40 hover:text-white/75 transition-colors duration-200"
              >
                {t('terms')}
              </Link>
            </div>

            {/* Legal Disclaimer — visually emphasised with icon */}
            <div className="flex flex-col gap-3">
              <Link
                href="/legal"
                className="
                  inline-flex items-center gap-2
                  text-white/40 hover:text-white/75
                  transition-colors duration-200
                  group
                "
              >
                <span
                  className="
                    flex-shrink-0 w-5 h-5 rounded-md
                    flex items-center justify-center
                    transition-colors duration-200
                    group-hover:bg-[#E0C397]/15
                  "
                  style={{ background: 'rgba(224,195,151,0.08)', border: '1px solid rgba(224,195,151,0.2)' }}
                >
                  <Scale
                    className="w-2.5 h-2.5"
                    style={{ color: '#C9A96E' }}
                    strokeWidth={2}
                  />
                </span>
                {t('legalDisclaimer')}
              </Link>
            </div>
          </nav>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div
          className="my-8"
          style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }}
          aria-hidden="true"
        />

        {/* ── Bottom bar ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
          {/* Copyright */}
          <p className="text-xs text-white/22 text-center sm:text-left">
            © {year} PortoPrime. {t('rights')}
          </p>

          {/* Trust marks */}
          <div className="flex items-center gap-4">
            <span
              className="text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
              style={{ color: 'rgba(224,195,151,0.4)', background: 'rgba(224,195,151,0.06)', border: '1px solid rgba(224,195,151,0.12)' }}
            >
              🇵🇹 Turismo de Portugal
            </span>
            <span
              className="text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
              style={{ color: 'rgba(224,195,151,0.4)', background: 'rgba(224,195,151,0.06)', border: '1px solid rgba(224,195,151,0.12)' }}
            >
              AIMA
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
