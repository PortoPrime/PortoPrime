'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  Hammer,
  LayoutDashboard,
  Globe2,
  Clock,
  Wrench,
  BarChart3,
  Users,
  BookOpen,
  Building2,
} from 'lucide-react';
import { IMAGES } from '@/lib/images';
import type { ImageKey } from '@/lib/images';

// ─── Shared text-break style ────────────────────────────────────────────────
// Applied to every description/title that can receive long words in DE/RU/IT.
// `hyphens: auto` requires the `lang` attribute on <html> (set by next-intl).
const BREAK_STYLE: React.CSSProperties = {
  hyphens:      'auto',
  overflowWrap: 'anywhere',
  wordBreak:    'break-word',
};

// ─── Bento card config ─────────────────────────────────────────────────────
interface BentoCard {
  key:       string;
  Icon:      React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>;
  accent:    string;
  bg:        string;
  /** Dominant solid colour used for the photo→card gradient fade */
  bgSolid:   string;
  border:    string;
  colSpan:   string;
  featured:  boolean;
  imageKey:  ImageKey;
  /** Fixed height for the photo strip — never changes with content */
  imgHeight: string;
  imgSizes:  string;
}

const BENTO_CARDS: BentoCard[] = [
  {
    key:       'alCompliance',
    Icon:      ShieldCheck,
    accent:    '#E0C397',
    bg:        'linear-gradient(145deg, #1a2d4a 0%, #1B263B 100%)',
    bgSolid:   '#1a2d4a',
    border:    'rgba(224,195,151,0.25)',
    colSpan:   'lg:col-span-2',
    featured:  true,
    imageKey:  'azulejos',
    imgHeight: 'h-[200px] md:h-[220px]',
    imgSizes:  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw',
  },
  {
    key:       'renovation',
    Icon:      Hammer,
    accent:    '#C9A96E',
    bg:        'linear-gradient(145deg, #1e2e42 0%, #1B263B 100%)',
    bgSolid:   '#1e2e42',
    border:    'rgba(201,169,110,0.2)',
    colSpan:   'lg:col-span-1',
    featured:  false,
    imageKey:  'renovation',
    imgHeight: 'h-[220px] md:h-[260px]',
    imgSizes:  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  {
    key:       'dashboard',
    Icon:      LayoutDashboard,
    accent:    '#7EC8C8',
    bg:        'linear-gradient(145deg, #152535 0%, #1B263B 100%)',
    bgSolid:   '#152535',
    border:    'rgba(126,200,200,0.2)',
    colSpan:   'lg:col-span-1',
    featured:  false,
    imageKey:  'dashboard',
    imgHeight: 'h-[220px] md:h-[260px]',
    imgSizes:  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  {
    key:       'guestNetwork',
    Icon:      Globe2,
    accent:    '#E0C397',
    bg:        'linear-gradient(145deg, #1a2d4a 0%, #263554 100%)',
    bgSolid:   '#1a2d4a',
    border:    'rgba(224,195,151,0.2)',
    colSpan:   'lg:col-span-2',
    featured:  false,
    imageKey:  'checkIn',
    imgHeight: 'h-[200px] md:h-[220px]',
    imgSizes:  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw',
  },
];

// ─── Supporting service cards ───────────────────────────────────────────────
const SUPPORT_CARDS = [
  { key: 'renovation',   Icon: Wrench    },
  { key: 'management',   Icon: Clock     },
  { key: 'accounting',   Icon: BarChart3 },
  { key: 'guestNetwork', Icon: Users     },
  { key: 'legal',        Icon: BookOpen  },
  { key: 'realEstate',   Icon: Building2 },
] as const;

// ─── Services Component ────────────────────────────────────────────────────
export function Services() {
  const t = useTranslations('services');

  return (
    <section
      id="services"
      className="py-24 md:py-32"
      style={{ background: 'var(--surface)' }}
      aria-label="Services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="text-center mb-16 md:mb-20">
          <p
            className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color: '#C9A96E', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            {t('eyebrow')}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ color: '#1B263B', fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('headline')}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            {t('subheadline')}
          </p>
        </div>

        {/* ── Bento Grid ── 3-column asymmetric layout ─────────────────── */}
        {/*
          Row 1: [AL Compliance — 2 cols] [Renovation — 1 col]
          Row 2: [Dashboard — 1 col]      [Guest Network — 2 cols]

          Each card is `flex flex-col` so the image strip stays at its fixed
          height while the content area grows freely with text.
          CSS Grid auto-rows gives all cells in a row the same height.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-16">
          {BENTO_CARDS.map(({
            key, Icon, accent, bg, bgSolid, border,
            colSpan, featured, imageKey, imgHeight, imgSizes,
          }) => {
            const img = IMAGES[imageKey];
            return (
              <div
                key={key}
                className={[
                  // flex-col: image strip stays fixed, content grows freely
                  'flex flex-col',
                  // overflow-hidden clips the photo corners; rounded-3xl shapes the card
                  'relative overflow-hidden rounded-3xl',
                  'group cursor-default',
                  'transition-all duration-500 ease-out',
                  'hover:-translate-y-1 hover:shadow-2xl',
                  colSpan,
                ].join(' ')}
                style={{
                  background:        bg,
                  border:            `1px solid ${border}`,
                  // ─── Sub-pixel seam fix ────────────────────────────────
                  // 1. Force GPU compositing layer → eliminates sub-pixel
                  //    rounding gaps between image strip and content during
                  //    scroll / resize on Chromium and Safari.
                  transform:         'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  // 2. Blocks a Chromium stacking-boundary artifact where a
                  //    1 px crack appears along adjacent composited elements.
                  outline:           '1px solid transparent',
                }}
              >
                {/* ── Image strip — fixed height, never compressed ──────── */}
                <div className={`relative ${imgHeight} flex-shrink-0 overflow-hidden`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    placeholder="blur"
                    blurDataURL={img.blurDataURL}
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes={imgSizes}
                  />

                  {/* Photo → card background seamless gradient fade */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(
                        to bottom,
                        rgba(0,0,0,0.12) 0%,
                        transparent 35%,
                        ${bgSolid}CC 80%,
                        ${bgSolid} 100%
                      )`,
                    }}
                    aria-hidden="true"
                  />

                  {/* Tag chip — over the photo, frosted glass pill */}
                  <span
                    className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      color:           accent,
                      background:      'rgba(13,20,32,0.65)',
                      border:          `1px solid ${accent}40`,
                      backdropFilter:  'blur(8px)',
                      // Long tag words (DE/RU) must not break the chip shape
                      whiteSpace:      'nowrap',
                    }}
                  >
                    {t(`bento.${key}.tag`)}
                  </span>
                </div>

                {/* ── Card content — grows to fill remaining card height ─── */}
                {/*
                  flex-1 + flex flex-col: the content area expands as text grows.
                  p-7/p-8 gives generous breathing room so text never touches borders.
                  marginTop: -2px physically overlaps the image strip bottom edge
                  by 2 px — a belt-and-suspenders guard against any remaining
                  sub-pixel gap that GPU compositing alone might not catch.
                  pt-5 (20 px) already gives enough room so no content is hidden.
                */}
                <div
                  className="relative flex flex-col flex-1 p-7 md:p-8 pt-5"
                  style={{ marginTop: '-2px' }}
                >

                  {/* Inner glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 60%, ${accent}12, transparent 60%)` }}
                  />

                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={1.8} />
                  </div>

                  {/* Title — hyphens-auto handles German/Russian compound words */}
                  <h3
                    className="text-xl md:text-2xl font-bold text-white mb-3 leading-snug"
                    style={{
                      fontFamily: featured ? 'Playfair Display, Georgia, serif' : 'inherit',
                      ...BREAK_STYLE,
                    }}
                  >
                    {t(`bento.${key}.title`)}
                  </h3>

                  {/* Description — text-sm for compact fit; no line-clamp, no truncation */}
                  <p
                    className="text-sm leading-relaxed text-white/65"
                    style={BREAK_STYLE}
                  >
                    {t(`bento.${key}.description`)}
                  </p>

                  {/* Decorative corner accent for featured card */}
                  {featured && (
                    <div
                      className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full opacity-[0.06] pointer-events-none"
                      style={{ background: accent }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Supporting services ── compact horizontal cards ───────────── */}
        {/*
          `items-stretch` (CSS Grid default) makes all cells in a row the same
          height. Each card uses `h-full flex` so it fills that cell height.
          The icon stays top-aligned; the text area grows below it.
        */}
        <div>
          <p
            className="text-center text-xs font-semibold tracking-[0.25em] uppercase mb-8 opacity-50"
            style={{ color: '#1B263B' }}
          >
            {t('alsoIncluded')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPPORT_CARDS.map(({ key, Icon }) => (
              <div
                key={key}
                className="
                  h-full flex items-start gap-4
                  p-5 md:p-6 rounded-2xl
                  bg-white border border-gray-100
                  hover:border-[#E0C397]/40 hover:shadow-md
                  transition-all duration-300 group
                "
              >
                {/* Icon — fixed size, never compressed */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(201,169,110,0.1)' }}
                >
                  <Icon
                    className="transition-transform duration-300 group-hover:scale-110"
                    style={{ color: '#C9A96E', width: '1.1rem', height: '1.1rem' }}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Text block — grows to fill; no line-clamp ever */}
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-semibold mb-1.5 leading-snug"
                    style={{
                      color:      '#1B263B',
                      fontFamily: 'Playfair Display, serif',
                      ...BREAK_STYLE,
                    }}
                  >
                    {t(`${key}.title`)}
                  </h4>
                  {/*
                    line-clamp removed — descriptions must be fully visible in
                    all 7 languages, including verbose DE/RU translations.
                  */}
                  <p
                    className="text-xs leading-relaxed text-gray-500"
                    style={BREAK_STYLE}
                  >
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
