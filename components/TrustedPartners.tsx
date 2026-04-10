'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

// ─── Partner definition ───────────────────────────────────────────────────────
interface Partner {
  id:         string;
  name:       string;
  category:   string;   // short descriptor — displayed as a pill tag
  url:        string;
  brandColor: string;
  Logo:       React.FC<React.SVGProps<SVGSVGElement>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Logos — inline, no external assets.
// Each SVG uses currentColor so the monochrome → brand transition is a single
// CSS `color` change on the card wrapper.
// ─────────────────────────────────────────────────────────────────────────────

const AirbnbLogo: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 120 38" fill="currentColor" {...p}>
    {/* Bélo icon — simplified */}
    <path d="M18 4C15.5 4 13.3 5.7 12.5 8L7.2 20.5C6.8 21.5 6.6 22.5 6.6 23.5C6.6 27.6 9.9 31 14 31C15.7 31 17.3 30.4 18.6 29.4L18 28.8C17 29.5 15.6 30 14 30C10.5 30 7.6 27.1 7.6 23.5C7.6 22.7 7.8 21.9 8.1 21.1L13.4 8.4C14 6.9 15.4 5.8 17.1 5.8C19 5.8 20.5 7 21.1 8.7L21.9 10.8L22.7 8.7C23.3 7 24.8 5.8 26.7 5.8C28.4 5.8 29.8 6.9 30.4 8.4L35.7 21.1C36 21.9 36.2 22.7 36.2 23.5C36.2 27.1 33.3 30 29.8 30C28.2 30 26.8 29.5 25.8 28.8L25.2 29.4C26.5 30.4 28.1 31 29.8 31C33.9 31 37.2 27.6 37.2 23.5C37.2 22.5 37 21.5 36.6 20.5L31.3 8C30.5 5.7 28.3 4 25.8 4C23.9 4 22.3 4.9 21.2 6.3C20.1 5 18.5 4 16.6 4H18Z" transform="scale(0.55) translate(2,2)"/>
    <text x="26" y="24" fontSize="15" fontFamily="Arial,sans-serif" fontWeight="700" letterSpacing="-0.3">Airbnb</text>
    <text x="26" y="34" fontSize="8.5" fontFamily="Arial,sans-serif" fontWeight="600" letterSpacing="1.5">SUPERHOST</text>
  </svg>
);

const BookingLogo: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 120 38" fill="currentColor" {...p}>
    <rect x="4" y="7" width="22" height="24" rx="4"/>
    <text x="4" y="25" fontSize="16" fontFamily="Arial,sans-serif" fontWeight="900" fill="white">B.</text>
    <text x="32" y="22" fontSize="13.5" fontFamily="Arial,sans-serif" fontWeight="700">Booking</text>
    <text x="32" y="33" fontSize="11" fontFamily="Arial,sans-serif" fontWeight="400">.com</text>
  </svg>
);

const VrboLogo: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 90 38" fill="currentColor" {...p}>
    <text x="6" y="27" fontSize="24" fontFamily="Arial,sans-serif" fontWeight="900" letterSpacing="-1">vrbo</text>
    <circle cx="78" cy="19" r="8" fill="currentColor" opacity="0.12"/>
    <text x="74" y="23" fontSize="10" fontFamily="Arial,sans-serif" fontWeight="700">✓</text>
  </svg>
);

const TurismoLogo: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 120 38" fill="currentColor" {...p}>
    {/* Stylised rooster */}
    <path d="M12 28 C12 28 10 23 12 18 C14 14 17 13 18 10 C19 8 17.5 6 18 5.5 C18.5 5 20 7 19 10 C21 9 23 10 22 12 C24 11 25.5 13 23.5 14.5 C25.5 14.5 25 17 23 17 C24 19 22.5 21.5 20.5 21.5 C21.5 23.5 20 26 18.5 26 L18.5 28 Z" opacity="0.95"/>
    <text x="32" y="18" fontSize="10" fontFamily="Arial,sans-serif" fontWeight="800" letterSpacing="0.5">TURISMO</text>
    <text x="32" y="30" fontSize="9.5" fontFamily="Arial,sans-serif" fontWeight="400" letterSpacing="0.3">DE PORTUGAL</text>
  </svg>
);

const AimaLogo: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 110 38" fill="currentColor" {...p}>
    <rect x="3" y="6" width="26" height="26" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <text x="7" y="26" fontSize="14" fontFamily="Arial,sans-serif" fontWeight="900">AI</text>
    <text x="35" y="21" fontSize="16" fontFamily="Arial,sans-serif" fontWeight="800">AIMA</text>
    <text x="35" y="31" fontSize="8" fontFamily="Arial,sans-serif" fontWeight="400" letterSpacing="0.5">Portugal</text>
  </svg>
);

const AlCertLogo: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 110 38" fill="currentColor" {...p}>
    {/* Shield */}
    <path d="M14 5 L24 9 L24 20 C24 25 19 29 14 31 C9 29 4 25 4 20 L4 9 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <text x="8" y="22" fontSize="9" fontFamily="Arial,sans-serif" fontWeight="800">AL</text>
    <text x="30" y="18" fontSize="11" fontFamily="Arial,sans-serif" fontWeight="700">CERTIFIED</text>
    <text x="30" y="30" fontSize="9" fontFamily="Arial,sans-serif" fontWeight="400">OPERATOR</text>
  </svg>
);

// ── DSI Crédito — DS Intermediários de Crédito (dsicredito.pt) ───────────────
const DsiLogo: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 120 38" fill="currentColor" {...p}>
    {/* House icon */}
    <path d="M6 18 L14 9 L22 18 L22 30 L6 30 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <rect x="10" y="22" width="8" height="8" rx="1" fill="currentColor" opacity="0.25"/>
    {/* Key */}
    <circle cx="14" cy="26" r="1.5" fill="currentColor"/>
    <text x="29" y="20" fontSize="13" fontFamily="Arial,sans-serif" fontWeight="900" letterSpacing="0.3">DSI</text>
    <text x="29" y="31" fontSize="10" fontFamily="Arial,sans-serif" fontWeight="500" letterSpacing="0.2">crédito</text>
  </svg>
);

// ── Fast Approval (fastapproval.pt) ───────────────────────────────────────────
const FastApprovalLogo: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 130 38" fill="currentColor" {...p}>
    {/* Lightning bolt */}
    <path d="M10 4 L4 20 L10 18 L6 34 L20 14 L13 16 Z" strokeLinejoin="round"/>
    <text x="28" y="19" fontSize="12.5" fontFamily="Arial,sans-serif" fontWeight="900" letterSpacing="-0.2">fast</text>
    <text x="28" y="32" fontSize="11" fontFamily="Arial,sans-serif" fontWeight="500" letterSpacing="0.1">approval</text>
  </svg>
);

// ─── Partner list ─────────────────────────────────────────────────────────────
const PARTNERS: Partner[] = [
  {
    id: 'airbnb', name: 'Airbnb', category: 'Superhost Partner',
    url: 'https://airbnb.com', brandColor: '#FF5A5F', Logo: AirbnbLogo,
  },
  {
    id: 'booking', name: 'Booking.com', category: 'Preferred Partner',
    url: 'https://booking.com', brandColor: '#003580', Logo: BookingLogo,
  },
  {
    id: 'vrbo', name: 'Vrbo', category: 'Holiday Rentals',
    url: 'https://vrbo.com', brandColor: '#1B6FBA', Logo: VrboLogo,
  },
  {
    id: 'turismo', name: 'Turismo de Portugal', category: 'AL Registry',
    url: 'https://turismodeportugal.pt', brandColor: '#00788A', Logo: TurismoLogo,
  },
  {
    id: 'aima', name: 'AIMA', category: 'Regulatory Compliance',
    url: 'https://aima.gov.pt', brandColor: '#1A3A6B', Logo: AimaLogo,
  },
  {
    id: 'alcert', name: 'Certified AL Operator', category: 'AL Certification',
    url: '#', brandColor: '#C9A96E', Logo: AlCertLogo,
  },
  {
    id: 'dsi', name: 'DSI Crédito', category: 'Crédito Habitação',
    url: 'https://dsicredito.pt', brandColor: '#0052A5', Logo: DsiLogo,
  },
  {
    id: 'fastapproval', name: 'Fast Approval', category: 'Soluções Financeiras',
    url: 'https://fastapproval.pt', brandColor: '#C9A96E', Logo: FastApprovalLogo,
  },
];

// ─── Card Component ───────────────────────────────────────────────────────────
function PartnerCard({ partner }: { partner: Partner }) {
  const [hovered, setHovered] = useState(false);
  const isExternal = partner.url !== '#';

  const cardStyle: React.CSSProperties = {
    border:     hovered ? `1.5px solid ${partner.brandColor}40` : '1.5px solid #F3F4F6',
    boxShadow:  hovered
      ? `0 8px 32px rgba(0,0,0,0.10), 0 2px 8px ${partner.brandColor}20`
      : '0 1px 4px rgba(0,0,0,0.04)',
    transform:  hovered ? 'translateY(-5px)' : 'translateY(0)',
    transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
  };

  const logoWrapStyle: React.CSSProperties = {
    color:   hovered ? partner.brandColor : '#9CA3AF',
    filter:  hovered ? 'none' : 'grayscale(100%)',
    opacity: hovered ? 1 : 0.55,
    transition: 'color 0.28s ease, filter 0.28s ease, opacity 0.28s ease',
  };

  const chipStyle: React.CSSProperties = {
    color:      hovered ? partner.brandColor : '#9CA3AF',
    background: hovered ? `${partner.brandColor}12` : '#F9FAFB',
    border:     hovered ? `1px solid ${partner.brandColor}30` : '1px solid #F3F4F6',
    transition: 'all 0.28s ease',
  };

  const content = (
    <div
      className="relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-white cursor-pointer"
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* External link icon — only appears on hover */}
      {isExternal && (
        <div
          className="absolute top-3 right-3 transition-all duration-200"
          style={{ opacity: hovered ? 0.5 : 0 }}
          aria-hidden="true"
        >
          <ExternalLink className="w-3.5 h-3.5" style={{ color: partner.brandColor }} />
        </div>
      )}

      {/* Logo */}
      <div className="w-full flex items-center justify-center" style={{ height: '40px' }}>
        <div style={{ ...logoWrapStyle, width: '100%', maxWidth: '108px', height: '38px' }}>
          <partner.Logo width="100%" height="100%" />
        </div>
      </div>

      {/* Category chip */}
      <span
        className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full whitespace-nowrap"
        style={chipStyle}
      >
        {partner.category}
      </span>
    </div>
  );

  return isExternal ? (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={partner.name}>
      {content}
    </a>
  ) : (
    <div aria-label={partner.name}>{content}</div>
  );
}

// ─── TrustedPartners Section ──────────────────────────────────────────────────
export function TrustedPartners() {
  const t = useTranslations('trustedPartners');

  return (
    <section
      className="py-20 md:py-24"
      style={{ background: '#F8F6F2' }}
      aria-label="Trusted Partners"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ───────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <p
            className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color: '#C9A96E', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            {t('label')}
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3 leading-tight"
            style={{ color: '#1B263B', fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('headline')}
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            {t('subheadline')}
          </p>
        </div>

        {/* ── Divider with centre dot ──────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-12 max-w-xs mx-auto" aria-hidden="true">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #E0C397)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A96E' }} />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #E0C397)' }} />
        </div>

        {/* ── Partner cards grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
          {PARTNERS.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>

      </div>
    </section>
  );
}
