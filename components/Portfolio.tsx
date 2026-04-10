'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, TrendingUp, Banknote, DollarSign } from 'lucide-react';
import { IMAGES } from '@/lib/images';

// ─── Clamp helper ────────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// ─── Portfolio Component ──────────────────────────────────────────────────────
export function Portfolio() {
  const t = useTranslations('portfolio');

  // Slider position: 0–100 (percent of image revealed for "before")
  const [pos, setPos]         = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef           = useRef<HTMLDivElement>(null);

  // ── Compute new position from a client X coordinate ─────────────────────
  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(clamp(((clientX - left) / width) * 100, 2, 98));
  }, []);

  // ── Mouse events ─────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    updatePos(e.clientX);
  }, [updatePos]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updatePos(e.clientX);
    const onUp   = ()              => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [dragging, updatePos]);

  // ── Touch events ─────────────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    updatePos(e.touches[0].clientX);
  }, [updatePos]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    updatePos(e.touches[0].clientX);
  }, [updatePos]);

  // ── ROI stats ─────────────────────────────────────────────────────────────
  const stats = [
    { icon: Banknote,   label: t('statInvestment'), value: t('statInvestmentValue'), color: '#E0C397' },
    { icon: TrendingUp, label: t('statValueLabel'),  value: t('statValueValue'),      color: '#7EC8C8' },
    { icon: DollarSign, label: t('statYieldLabel'),  value: t('statYieldValue'),      color: '#C9A96E' },
  ];

  return (
    <section
      id="portfolio"
      className="py-24 md:py-32 overflow-hidden"
      style={{ background: 'var(--bg)' }}
      aria-label="Portfolio"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="text-center mb-16">
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

        {/* ── Two-column layout: slider + stats ──────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          {/* ── Before/After slider ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/*
              Container: relative + rounded + overflow-hidden clips image corners.
              aspect-[4/3] keeps the 1200×900 images at correct ratio.
              touch-none prevents default touch scroll so the slider works on mobile.
            */}
            <div
              ref={containerRef}
              className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-ew-resize select-none touch-none shadow-2xl"
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              style={{ WebkitUserSelect: 'none' }}
              role="img"
              aria-label={`${t('beforeLabel')} / ${t('afterLabel')} comparison slider`}
            >
              {/* ── AFTER image (full width, behind) ──────────────────── */}
              <Image
                src={IMAGES.renovation.src}
                alt={IMAGES.renovation.alt}
                fill
                placeholder="blur"
                blurDataURL={IMAGES.renovation.blurDataURL}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />

              {/* "After" label */}
              <span
                className="absolute top-4 right-4 z-10 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                style={{
                  color:          '#fff',
                  background:     'rgba(13,20,32,0.65)',
                  border:         '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {t('afterLabel')}
              </span>

              {/* ── BEFORE image (clipped, on top) ─────────────────────── */}
              {/*
                clipPath: inset(0 X% 0 0) reveals the left (pos%) of the before
                image, hiding the right portion. This creates the sliding reveal.
              */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                aria-hidden="true"
              >
                <Image
                  src={IMAGES.beforeReno.src}
                  alt={IMAGES.beforeReno.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={IMAGES.beforeReno.blurDataURL}
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {/* "Before" label */}
                <span
                  className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                  style={{
                    color:          '#fff',
                    background:     'rgba(13,20,32,0.65)',
                    border:         '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {t('beforeLabel')}
                </span>
              </div>

              {/* ── Divider line ─────────────────────────────────────────── */}
              <div
                className="absolute top-0 bottom-0 w-0.5 z-20 pointer-events-none"
                style={{ left: `${pos}%`, background: 'rgba(255,255,255,0.85)' }}
                aria-hidden="true"
              />

              {/* ── Drag handle ──────────────────────────────────────────── */}
              <div
                className="absolute top-1/2 z-30 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
                style={{ left: `${pos}%` }}
                aria-hidden="true"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-transform duration-150"
                  style={{
                    background:   '#fff',
                    border:       '2px solid rgba(27,38,59,0.15)',
                    transform:    dragging ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  {/* Double chevron icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 5l-4 5 4 5" stroke="#1B263B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 5l4 5-4 5" stroke="#1B263B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* ── Drag hint (fades out after interaction) ─────────────── */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300"
                style={{ opacity: dragging ? 0 : 0.85 }}
                aria-hidden="true"
              >
                <span
                  className="text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1 rounded-full"
                  style={{
                    color:          '#fff',
                    background:     'rgba(13,20,32,0.55)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {t('dragHint')}
                </span>
              </div>
            </div>
          </div>

          {/* ── ROI stats panel ──────────────────────────────────────────── */}
          <div
            className="w-full lg:w-72 xl:w-80 flex flex-col justify-between rounded-3xl p-8"
            style={{
              background: 'linear-gradient(160deg, #1a2d4a 0%, #1B263B 100%)',
              border:     '1px solid rgba(224,195,151,0.15)',
            }}
          >
            {/* Location chip */}
            <div className="flex items-center gap-2 mb-8">
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A96E' }} strokeWidth={1.8} />
              <span className="text-sm font-medium" style={{ color: '#C9A96E' }}>
                {t('location')}
              </span>
            </div>

            {/* Headline */}
            <h3
              className="text-2xl font-bold text-white mb-8 leading-snug"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              {t('statsHeadline')}
            </h3>

            {/* Stats */}
            <div className="flex flex-col gap-5 flex-1">
              {stats.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">{label}</p>
                    <p className="text-lg font-bold" style={{ color }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <button
              className="mt-8 w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #C9A96E 0%, #E0C397 100%)',
                color:      '#1B263B',
              }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('cta')}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
