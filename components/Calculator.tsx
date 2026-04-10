'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Home, Sliders, TrendingUp, ArrowRight, Sparkles, BarChart2, Info } from 'lucide-react';

// Custom event name — LeadForm listens for this to pre-fill the revenue field
const REVENUE_EVENT = 'portoprime:revenue';

// ─── Calculation constants ──────────────────────────────────────────────────

const LOCATION_MULTIPLIERS: Record<string, number> = {
  lisbon:  1.2,
  porto:   1.0,
  algarve: 1.1,
  other:   0.8,
};

const BASE_RATES: Record<string, number> = {
  studio:      80,
  oneBedroom: 110,
  twoBedroom: 160,
  villa:      300,
};

/** Condition 1 = Needs Renovation → 5 = Premium */
const CONDITION_MULTIPLIERS: Record<number, number> = {
  1: 0.70,
  2: 0.82,
  3: 0.92,
  4: 1.00,
  5: 1.10,
};

const SERVICE_FEE       = 0.30; // 30% management fee
const DAYS_PER_MONTH    = 30;
const RENOVATION_BOOST  = 0.25; // +25% with professional renovation

// ─── Core calculation function ──────────────────────────────────────────────
/**
 * Returns estimated monthly net revenue after the management fee.
 * Formula: baseRate × locationMult × conditionMult × 30 days × occupancy% × (1 − fee)
 */
function calcMonthly(
  location: string,
  propertyType: string,
  condition: number,
  occupancy: number,
): number {
  const loc  = LOCATION_MULTIPLIERS[location]   ?? 1.0;
  const base = BASE_RATES[propertyType]          ?? 110;
  const cond = CONDITION_MULTIPLIERS[condition]  ?? 1.0;
  return base * loc * cond * DAYS_PER_MONTH * (occupancy / 100) * (1 - SERVICE_FEE);
}

// ─── Animated number hook ───────────────────────────────────────────────────
/**
 * Smoothly animates a displayed number toward a target value
 * using an ease-out cubic curve. Initial value = target (no flash on mount).
 */
function useAnimatedNumber(target: number, duration = 550): number {
  // Start at target so SSR/hydration produces the correct initial HTML.
  const [displayed, setDisplayed] = useState<number>(target);
  const prevRef   = useRef<number>(target);
  const rafRef    = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = target;
    if (from === target) return;

    let startTs: number | null = null;

    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(from + (target - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return displayed;
}

// ─── Slider sub-component ───────────────────────────────────────────────────
interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}
function GoldSlider({ min, max, step, value, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full"
      style={{
        background: `linear-gradient(to right, #C9A96E 0%, #E0C397 ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
      }}
    />
  );
}

// ─── Dropdown sub-component ─────────────────────────────────────────────────
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  ariaLabel: string;
}
function GoldSelect({ value, onChange, children, ariaLabel }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className="
        w-full px-4 py-3 rounded-xl
        border border-gray-200 bg-white
        text-[#1B263B] text-sm font-medium
        focus:outline-none focus:ring-2 focus:ring-[#E0C397]/50 focus:border-[#E0C397]
        transition-all duration-200
        cursor-pointer
      "
    >
      {children}
    </select>
  );
}

// ─── Main Calculator Component ──────────────────────────────────────────────
export function Calculator() {
  const t = useTranslations('calculator');

  // ── State ────────────────────────────────────────────────────────────────
  const [selectedLocation, setSelectedLocation] = useState('lisbon');
  const [propertyType,     setPropertyType]     = useState('oneBedroom');
  const [condition,        setCondition]        = useState(3);   // 1–5
  const [occupancy,        setOccupancy]        = useState(80);  // 40–100 %

  // ── Derived values ───────────────────────────────────────────────────────
  const monthly         = calcMonthly(selectedLocation, propertyType, condition, occupancy);
  const annual          = monthly * 12;
  const renovatedMonthly = monthly * (1 + RENOVATION_BOOST);

  // ── Animated display values ──────────────────────────────────────────────
  const displayMonthly  = useAnimatedNumber(monthly);
  const displayAnnual   = useAnimatedNumber(annual);
  const displayRenovated = useAnimatedNumber(renovatedMonthly);

  const showUpsell = condition < 5;

  /**
   * Called when the "Get Detailed Report" CTA is clicked.
   * Fires a custom event so LeadForm can pre-fill the estimated revenue,
   * then smooth-scrolls to the contact section.
   */
  const handleCtaClick = useCallback(() => {
    const formatted = `€${Math.round(monthly).toLocaleString()}`;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(REVENUE_EVENT, { detail: { revenue: formatted } }),
      );
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, [monthly]);

  // Condition label keys in order (index 0 = condition 1)
  const conditionKeys = ['renovation', 'fair', 'good', 'veryGood', 'premium'] as const;

  // Occupancy fill percentage for the slider gradient
  const occupancyPct = ((occupancy - 40) / 60) * 100;

  return (
    <section
      id="calculator"
      className="py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #F8F6F2 0%, #EDEAE3 100%)' }}
      aria-label="ROI Calculator"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ────────────────────────────────────────────── */}
        <div className="text-center mb-14">
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

        {/* ── Calculator card ───────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-[0_12px_60px_rgba(27,38,59,0.12)] overflow-hidden">
          <div className="grid md:grid-cols-2">

            {/* ╔════════════════════════════════╗
                ║  LEFT PANEL — Inputs           ║
                ╚════════════════════════════════╝ */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
              <h3
                className="text-base font-bold text-[#1B263B] mb-7 flex items-center gap-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <span
                  className="inline-flex w-7 h-7 rounded-lg items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,169,110,0.12)' }}
                >
                  <BarChart2 className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />
                </span>
                {t('propertyDetails')}
              </h3>

              {/* Location ──────────────────────────────────────────────── */}
              <div className="mb-6">
                <label className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-gray-500 mb-2">
                  <MapPin className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />
                  {t('location')}
                </label>
                <GoldSelect
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  ariaLabel={t('location')}
                >
                  {(['lisbon', 'porto', 'algarve', 'other'] as const).map((loc) => (
                    <option key={loc} value={loc}>
                      {t(`locations.${loc}`)}
                    </option>
                  ))}
                </GoldSelect>
              </div>

              {/* Property type ──────────────────────────────────────────── */}
              <div className="mb-7">
                <label className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-gray-500 mb-2">
                  <Home className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />
                  {t('propertyType')}
                </label>
                {/* Visual pill selector instead of plain <select> */}
                <div className="grid grid-cols-2 gap-2">
                  {(['studio', 'oneBedroom', 'twoBedroom', 'villa'] as const).map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setPropertyType(pt)}
                      className={`
                        py-2.5 px-3 rounded-xl text-sm font-semibold text-center
                        border transition-all duration-200
                        ${propertyType === pt
                          ? 'text-[#1B263B] border-[#C9A96E] shadow-sm'
                          : 'text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'
                        }
                      `}
                      style={propertyType === pt
                        ? { background: 'linear-gradient(135deg, rgba(224,195,151,0.20), rgba(201,169,110,0.10))' }
                        : {}
                      }
                    >
                      {t(`propertyTypes.${pt}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition slider ───────────────────────────────────────── */}
              <div className="mb-7">
                <label className="flex items-center justify-between text-xs font-bold tracking-wide uppercase text-gray-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />
                    {t('condition')}
                  </span>
                  {/* Active label chip */}
                  <span
                    className="text-[10px] font-bold tracking-[0.1em] px-2.5 py-1 rounded-full normal-case"
                    style={{ color: '#C9A96E', background: 'rgba(201,169,110,0.12)' }}
                  >
                    {t(`conditionLabels.${conditionKeys[condition - 1]}`)}
                  </span>
                </label>

                <GoldSlider
                  min={1} max={5} step={1}
                  value={condition}
                  onChange={setCondition}
                />

                {/* Endpoint labels */}
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-gray-400">
                    {t('conditionLabels.renovation')}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {t('conditionLabels.premium')}
                  </span>
                </div>

                {/* Step dots */}
                <div className="flex justify-between px-[9px] -mt-1 pointer-events-none" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <span
                      key={step}
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                      style={{ background: step <= condition ? '#C9A96E' : '#D1D5DB' }}
                    />
                  ))}
                </div>
              </div>

              {/* Occupancy slider ───────────────────────────────────────── */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold tracking-wide uppercase text-gray-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />
                    {t('occupancy')}
                  </span>
                  <span
                    className="text-base font-bold tabular-nums"
                    style={{ color: '#C9A96E', fontFamily: 'Playfair Display, serif' }}
                  >
                    {occupancy}%
                  </span>
                </label>
                <GoldSlider
                  min={40} max={100} step={5}
                  value={occupancy}
                  onChange={setOccupancy}
                />
                <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
                  <span>40%</span>
                  <span>70%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* ╔════════════════════════════════╗
                ║  RIGHT PANEL — Results         ║
                ╚════════════════════════════════╝ */}
            <div
              className="p-8 md:p-10 flex flex-col"
              style={{ background: 'linear-gradient(155deg, #1B263B 0%, #263554 55%, #1e3252 100%)' }}
            >
              {/* ── "Other Region" state ────────────────────────────────────
                  When the user picks "Другой регион / Other Region" we hide
                  the numeric results and show a personalised-request message.
                  The panel keeps its height via flex-1 so layout never jumps.
              ─────────────────────────────────────────────────────────────── */}
              {selectedLocation === 'other' ? (
                <div className="flex-1 flex flex-col justify-center">
                  {/* Info card */}
                  <div
                    className="p-6 rounded-2xl"
                    style={{
                      background: 'rgba(224,195,151,0.07)',
                      border:     '1px solid rgba(224,195,151,0.22)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                        style={{ background: 'rgba(224,195,151,0.14)', border: '1px solid rgba(224,195,151,0.25)' }}
                      >
                        <Info className="w-4.5 h-4.5" style={{ color: '#E0C397' }} strokeWidth={1.8} />
                      </div>
                      <p className="text-sm text-white/75 leading-relaxed">
                        {t('otherRegionMessage')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Standard results ────────────────────────────────────── */
                <div className="flex-1">
                  <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2">
                    {t('estimatedRevenue')}
                  </p>

                  {/* Animated big number */}
                  <div className="flex items-end gap-1 mb-0.5">
                    <span
                      className="text-[3.5rem] leading-none font-bold tabular-nums"
                      style={{ color: '#E0C397', fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      €{Math.round(displayMonthly).toLocaleString()}
                    </span>
                    <span className="text-lg text-white/40 mb-2">{t('perMonth')}</span>
                  </div>
                  <p className="text-xs text-white/35 mb-6">{t('afterFees')}</p>

                  {/* Annual projection card */}
                  <div
                    className="flex items-center gap-4 p-4 rounded-2xl mb-5"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(224,195,151,0.12)' }}
                    >
                      <BarChart2 className="w-5 h-5" style={{ color: '#E0C397' }} strokeWidth={1.6} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                        {t('annualProjection')}
                      </p>
                      <p
                        className="text-2xl font-bold tabular-nums"
                        style={{ color: '#E0C397', fontFamily: 'Playfair Display, serif' }}
                      >
                        €{Math.round(displayAnnual).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Renovation upsell — hidden when condition is already Premium */}
                  {showUpsell && (
                    <div
                      className="p-4 rounded-2xl"
                      style={{
                        background: 'rgba(224,195,151,0.07)',
                        border:     '1px solid rgba(224,195,151,0.18)',
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        <Sparkles
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: '#E0C397' }}
                          strokeWidth={1.8}
                        />
                        <p className="text-xs text-white/65 leading-relaxed">
                          {t('renovationUpsell')}{' '}
                          <span className="font-black text-sm" style={{ color: '#E0C397' }}>
                            {t('renovationUpsellHighlight')}
                          </span>
                          {' '}{t('renovationUpsellSuffix')}{' '}
                          <span className="font-bold text-white/90">
                            €{Math.round(displayRenovated).toLocaleString()}{t('perMonth')}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA — text switches based on selected location ──────────── */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="
                    flex items-center justify-center gap-2.5 w-full
                    px-6 py-4 rounded-2xl
                    font-bold text-sm text-[#1B263B]
                    transition-all duration-300
                    hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(224,195,151,0.35)]
                    active:scale-100
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C397]
                  "
                  style={{ background: 'linear-gradient(135deg, #E0C397 0%, #C9A96E 100%)' }}
                >
                  {selectedLocation === 'other' ? t('ctaOtherRegion') : t('cta')}
                  <ArrowRight className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                </button>

                {/* Disclaimer */}
                <div className="mt-4 px-1 flex items-start gap-2" role="note">
                  <span
                    className="flex-shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'rgba(224,195,151,0.45)' }}
                  >
                    ⓘ
                  </span>
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.38)', fontStyle: 'italic' }}
                  >
                    {t('disclaimer')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
