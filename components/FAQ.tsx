'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';

// ─── FAQ keys ────────────────────────────────────────────────────────────────
const FAQ_KEYS = ['1', '2', '3', '4', '5'] as const;
type FaqKey = typeof FAQ_KEYS[number];

// ─── FAQ Component ────────────────────────────────────────────────────────────
export function FAQ() {
  const t = useTranslations('faq');
  const [openKey, setOpenKey] = useState<FaqKey | null>(null);

  const toggle = (key: FaqKey) =>
    setOpenKey(prev => (prev === key ? null : key));

  return (
    <section
      id="faq"
      className="py-24 md:py-32"
      style={{ background: '#0D1826' }}
      aria-label="FAQ"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <p
            className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color: '#C9A96E', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            {t('eyebrow')}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight text-white"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('headline')}
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            {t('subheadline')}
          </p>
        </div>

        {/* ── Accordion items ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {FAQ_KEYS.map((key) => {
            const isOpen = openKey === key;
            return (
              <div
                key={key}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen
                    ? 'linear-gradient(145deg, #1a2d4a 0%, #1e2e42 100%)'
                    : 'rgba(255,255,255,0.04)',
                  border: isOpen
                    ? '1px solid rgba(201,169,110,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* ── Question row ─────────────────────────────────────── */}
                <button
                  className="w-full flex items-center justify-between gap-4 p-6 text-left transition-colors duration-200"
                  onClick={() => toggle(key)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${key}`}
                >
                  {/* Number badge */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: isOpen ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.07)',
                        color:      isOpen ? '#C9A96E' : 'rgba(255,255,255,0.4)',
                        border:     isOpen ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {key}
                    </span>
                    <span
                      className="text-sm sm:text-base font-semibold leading-snug"
                      style={{
                        color:        isOpen ? '#fff' : 'rgba(255,255,255,0.75)',
                        hyphens:      'auto',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {t(`q${key}`)}
                    </span>
                  </div>

                  {/* Toggle icon */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isOpen ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.07)',
                      border:     isOpen ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      transform:  isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
                    }}
                    aria-hidden="true"
                  >
                    {isOpen
                      ? <Minus className="w-4 h-4" style={{ color: '#C9A96E' }} strokeWidth={2} />
                      : <Plus  className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} strokeWidth={2} />
                    }
                  </div>
                </button>

                {/* ── Answer panel — CSS max-height transition ──────────── */}
                {/*
                  We use an inner wrapper with padding so the transition feels
                  natural. The outer div drives the max-height animation.
                  overflow:hidden on the outer div clips the content during transition.
                */}
                <div
                  id={`faq-answer-${key}`}
                  role="region"
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: isOpen ? '600px' : '0px',
                    opacity:   isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-6 pt-0">
                    {/* Divider */}
                    <div
                      className="mb-4"
                      style={{ height: '1px', background: 'rgba(201,169,110,0.15)' }}
                    />
                    <p
                      className="text-sm sm:text-base leading-relaxed"
                      style={{
                        color:        'rgba(255,255,255,0.65)',
                        hyphens:      'auto',
                        overflowWrap: 'anywhere',
                        wordBreak:    'break-word',
                      }}
                    >
                      {t(`a${key}`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
