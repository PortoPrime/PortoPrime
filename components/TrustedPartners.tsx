'use client';

import { useTranslations } from 'next-intl';

// ─── Partner logo definitions ─────────────────────────────────────────────────
// All logos are inline SVG — no external assets required.
// Monochromatic (#6b7280 / gray-500) at rest; transitions to brand color on hover.

interface Partner {
  id:         string;
  label:      string;
  brandColor: string;
  Logo:       React.FC<{ style?: React.CSSProperties }>;
}

// ── Airbnb Superhost ─────────────────────────────────────────────────────────
const AirbnbLogo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 100 32" fill="currentColor" style={style} aria-hidden="true">
    <path d="M26.5 15.9c0-1.3-.3-2.5-.9-3.5l-6.7-11.6c-.4-.7-1.1-1.1-1.9-1.1-.8 0-1.5.4-1.9 1.1l-6.7 11.6C7.8 13.4 7.5 14.6 7.5 15.9c0 3.9 3.1 7 7 7s7-3.1 7-7zm-7 5c-2.8 0-5-2.2-5-5 0-.9.2-1.8.6-2.5l4.4-7.6 4.4 7.6c.4.7.6 1.6.6 2.5 0 2.8-2.2 5-5 5z"/>
    <text x="35" y="22" fontSize="14" fontFamily="Arial, sans-serif" fontWeight="600" fill="currentColor">Airbnb</text>
    <text x="35" y="30" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="500" fill="currentColor" letterSpacing="1">SUPERHOST</text>
  </svg>
);

// ── Booking.com ───────────────────────────────────────────────────────────────
const BookingLogo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 110 32" fill="currentColor" style={style} aria-hidden="true">
    <rect x="0" y="6" width="20" height="20" rx="3" fill="currentColor" opacity="0.15"/>
    <text x="2" y="20" fontSize="13" fontFamily="Arial, sans-serif" fontWeight="900" fill="currentColor">B.</text>
    <text x="26" y="21" fontSize="13" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">Booking.com</text>
  </svg>
);

// ── Turismo de Portugal ───────────────────────────────────────────────────────
const TurismoLogo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 120 32" fill="currentColor" style={style} aria-hidden="true">
    {/* Simplified rooster silhouette */}
    <path d="M10 24 C10 24 8 20 10 16 C12 12 15 11 16 8 C17 6 15 4 16 4 C17 4 19 6 18 8 C20 7 22 8 21 10 C23 9 24 11 22 12 C24 12 24 14 22 14 C23 16 22 18 20 18 C21 20 20 22 18 22 L18 24 Z" opacity="0.9"/>
    <text x="28" y="16" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">TURISMO</text>
    <text x="28" y="27" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="400" fill="currentColor">DE PORTUGAL</text>
  </svg>
);

// ── AIMA ──────────────────────────────────────────────────────────────────────
const AimaLogo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 80 32" fill="currentColor" style={style} aria-hidden="true">
    <rect x="1" y="6" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <text x="4" y="21" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="800" fill="currentColor">AI</text>
    <text x="26" y="16" fontSize="11" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">AIMA</text>
    <text x="26" y="26" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="400" fill="currentColor">Portugal</text>
  </svg>
);

// ── Vrbo ──────────────────────────────────────────────────────────────────────
const VrboLogo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 70 32" fill="currentColor" style={style} aria-hidden="true">
    <text x="4" y="22" fontSize="20" fontFamily="Arial, sans-serif" fontWeight="800" fill="currentColor">vrbo</text>
  </svg>
);

// ── Safe House (placeholder for AL Certification) ─────────────────────────────
const AlCertLogo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 100 32" fill="currentColor" style={style} aria-hidden="true">
    <path d="M10 22 L10 14 L16 8 L22 14 L22 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="16" cy="17" r="2.5" fill="currentColor" opacity="0.7"/>
    <text x="30" y="16" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="700" fill="currentColor">CERTIFIED</text>
    <text x="30" y="27" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="400" fill="currentColor">AL OPERATOR</text>
  </svg>
);

const PARTNERS: Partner[] = [
  { id: 'airbnb',   label: 'Airbnb Superhost',       brandColor: '#FF5A5F', Logo: AirbnbLogo  },
  { id: 'booking',  label: 'Booking.com',             brandColor: '#003580', Logo: BookingLogo },
  { id: 'turismo',  label: 'Turismo de Portugal',     brandColor: '#0070A0', Logo: TurismoLogo },
  { id: 'aima',     label: 'AIMA Compliant',          brandColor: '#1A5276', Logo: AimaLogo    },
  { id: 'vrbo',     label: 'Vrbo Partner',            brandColor: '#1B6FBA', Logo: VrboLogo    },
  { id: 'alcert',   label: 'Certified AL Operator',   brandColor: '#C9A96E', Logo: AlCertLogo  },
];

// ─── TrustedPartners Component ────────────────────────────────────────────────
export function TrustedPartners() {
  const t = useTranslations('trustedPartners');

  return (
    <section
      className="py-14 md:py-16"
      style={{ background: 'var(--surface)' }}
      aria-label="Trusted Partners"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <p
          className="text-center text-xs font-semibold tracking-[0.25em] uppercase mb-10 opacity-40"
          style={{ color: '#1B263B' }}
        >
          {t('label')}
        </p>

        {/* Logo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {PARTNERS.map(({ id, label, brandColor, Logo }) => (
            <div
              key={id}
              className="group flex items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 hover:shadow-sm"
              style={{
                border:  '1px solid transparent',
              }}
              title={label}
            >
              {/*
                Default: grayscale filter at 100% + opacity 45%
                Hover: grayscale 0% + opacity 85% + brand color via CSS variable
                We drive the color change with a wrapper that changes `color`.
              */}
              <div
                className="transition-all duration-400"
                style={{
                  color:  '#6b7280',   // monochrome at rest
                  width:  '100%',
                  maxWidth: '110px',
                  height: '32px',
                  filter: 'grayscale(100%)',
                  opacity: 0.45,
                  // On hover, override via CSS variable trick using group
                }}
              >
                {/* Inner element that actually transitions on group-hover */}
                <span
                  className="block w-full h-full transition-all duration-300"
                  style={{
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget.parentElement as HTMLElement;
                    el.style.color   = brandColor;
                    el.style.filter  = 'grayscale(0%)';
                    el.style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget.parentElement as HTMLElement;
                    el.style.color   = '#6b7280';
                    el.style.filter  = 'grayscale(100%)';
                    el.style.opacity = '0.45';
                  }}
                >
                  <Logo style={{ width: '100%', height: '100%' }} />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
