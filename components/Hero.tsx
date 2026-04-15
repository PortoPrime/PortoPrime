'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Shield, Award, TrendingUp, ArrowRight, Calculator } from 'lucide-react';
import { IMAGES } from '@/lib/images';

// ─── Trust Badge data (icon + translation key) ─────────────────────────────
const TRUST_BADGES = [
  { key: 'licensed' as const, tKey: 'trust.licensed' as const, Icon: Shield      },
  { key: 'aima'     as const, tKey: 'trust.aima'     as const, Icon: Award       },
  { key: 'roi'      as const, tKey: 'trust.roi'      as const, Icon: TrendingUp  },
] as const;

// ─── Hero Component ────────────────────────────────────────────────────────
export function Hero() {
  const t = useTranslations('hero');
  const img = IMAGES.hero;

  return (
    <section
      id="hero"
      className="relative min-h-screen md:h-screen flex flex-col items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background photo — LCP element, loaded with priority ────────── */}
      {/*
        16:9 hero image: "Premium Luxury Villa — Tagus River at Sunset, Lisbon"
        `fill` + `object-cover` makes it a true full-bleed background.
      */}
      <Image
        src={img.src}
        alt={img.alt}
        fill
        priority
        quality={90}
        placeholder="blur"
        blurDataURL={img.blurDataURL}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* ── Overlay stack (lowest → highest) ────────────────────────────── */}

      {/* Layer 1 — Flat dark screen: guarantees WCAG contrast ratio */}
      <div className="absolute inset-0 bg-black/52" aria-hidden="true" />

      {/* Layer 2 — Directional gradient: left side deeper for text readability,
                   right side lighter to reveal the scenic river/city view */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(108deg, rgba(13,20,32,0.90) 0%, rgba(27,38,59,0.65) 42%, rgba(38,53,84,0.28) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 3 — Bottom vignette: deepens into the trust-badge strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-72"
        style={{
          background:
            'linear-gradient(to top, rgba(13,20,32,0.97) 0%, rgba(13,20,32,0.60) 40%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 4 — Top vignette: softens the sky edge */}
      <div
        className="absolute top-0 left-0 right-0 h-28"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* Layer 5 — Warm golden orb: echoes the sunset in the photo */}
      <div
        aria-hidden="true"
        className="absolute top-[30%] right-[18%] w-[28rem] h-[28rem] rounded-full blur-[130px] opacity-[0.13] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E0C397, transparent 70%)' }}
      />

      {/* Layer 6 — Subtle gold grid texture for premium depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(224,195,151,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(224,195,151,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-28 pb-6">

        {/* Eyebrow pill */}
        <p
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase mb-5 px-4 py-2 rounded-full border border-[#E0C397]/30"
          style={{ color: '#E0C397', background: 'rgba(224,195,151,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E0C397' }} />
          {t('eyebrow')}
        </p>

        {/* Headline — Playfair Display, split to gold-highlight the second clause */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-white mb-5 leading-[1.05] tracking-tight"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          {t('headline').split('. ').map((part, i) => (
            <span key={i}>
              {i > 0 && '. '}
              {i === 1 ? <span className="text-gradient-gold">{part}</span> : part}
            </span>
          ))}
        </h1>

        {/* Bullet points — two key value props below the headline */}
        <ul className="flex flex-col items-start sm:items-center gap-3 mb-7 max-w-xl mx-auto">
          {(['bullet1', 'bullet2'] as const).map((key) => (
            <li
              key={key}
              className="flex items-center gap-3 text-base sm:text-lg text-white font-medium px-4 py-2 rounded-xl"
              style={{
                textShadow: '0 1px 6px rgba(0,0,0,0.9)',
                background: 'rgba(0,0,0,0.38)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <span
                className="flex-shrink-0 w-2 h-2 rounded-full"
                style={{ background: '#E0C397', boxShadow: '0 0 6px rgba(224,195,151,0.7)' }}
                aria-hidden="true"
              />
              {t(key)}
            </li>
          ))}
        </ul>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="#calculator"
            className="
              inline-flex items-center justify-center gap-2.5
              px-8 py-4 rounded-full
              font-semibold text-[#1B263B] text-sm sm:text-base
              transition-all duration-300
              hover:scale-105 hover:shadow-[0_0_35px_rgba(224,195,151,0.45)]
              active:scale-100
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C397]
            "
            style={{ background: 'linear-gradient(135deg, #E0C397, #C9A96E)' }}
          >
            <Calculator className="w-4 h-4 flex-shrink-0" />
            {t('ctaPrimary')}
          </a>

          <a
            href="#services"
            className="
              inline-flex items-center justify-center gap-2
              px-8 py-4 rounded-full
              font-semibold text-white text-sm sm:text-base
              border border-white/28 hover:border-white/55
              hover:bg-white/[0.08]
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
            "
          >
            {t('ctaSecondary')}
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>

        {/* Stats badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { value: '×1,5–2,5', labelKey: 'badge1' as const },
            { value: '>75%',     labelKey: 'badge2' as const },
            { value: '120+', labelKey: 'badge4' as const  },
          ].map(({ value, labelKey }) => (
            <div key={value} className="glass rounded-2xl px-6 py-3.5 text-center min-w-[108px]">
              <div
                className="text-2xl font-bold text-gradient-gold"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {value}
              </div>
              <div className="text-xs text-white/60 mt-0.5 tracking-wide">
                {t(labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust Badge Strip ─────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full border-t border-white/10 mt-auto"
        style={{ background: 'rgba(13,20,32,0.72)', backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-16">
            {TRUST_BADGES.map(({ key, tKey, Icon }) => (
              <div key={key} className="flex items-center gap-3 group">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                             transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(224,195,151,0.25), rgba(201,169,110,0.15))',
                    border: '1px solid rgba(224,195,151,0.3)',
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#E0C397' }} strokeWidth={1.8} />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                  {t(tKey)}
                </span>
                {key !== 'roi' && (
                  <span className="hidden sm:block w-px h-5 bg-white/15 ml-4" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
