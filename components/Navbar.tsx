'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, ChevronDown, Menu, X, TrendingUp } from 'lucide-react';

// ─── Supported locales ─────────────────────────────────────────────────────
const LOCALES = [
  { code: 'en', label: 'English',   flag: '🇬🇧' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ru', label: 'Русский',   flag: '🇷🇺' },
  { code: 'de', label: 'Deutsch',   flag: '🇩🇪' },
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'it', label: 'Italiano',  flag: '🇮🇹' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];

// ─── Nav links — anchors must match component IDs in page.tsx ─────────────
const NAV_LINKS = [
  { key: 'services'   as const, href: '#services'   },
  { key: 'calculator' as const, href: '#calculator' },
  { key: 'portfolio'  as const, href: '#portfolio'  },
  { key: 'partners'   as const, href: '#partners'   },
  { key: 'faq'        as const, href: '#faq'        },
  { key: 'guide'      as const, href: '#guide'      },
  { key: 'contact'    as const, href: '#contact'    },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────
interface NavbarProps {
  locale: string;
}

// ─── Navbar ────────────────────────────────────────────────────────────────
export function Navbar({ locale }: NavbarProps) {
  const t        = useTranslations('nav');
  const router   = useRouter();
  const pathname = usePathname();

  const [isScrolled,  setIsScrolled]  = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const langRef = useRef<HTMLDivElement>(null);

  // ── Scroll: tighten the bar after 40px ──────────────────────────────────
  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 40);
    fn(); // run once on mount
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // ── Close lang dropdown on outside click ─────────────────────────────────
  useEffect(() => {
    if (!langOpen) return;
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [langOpen]);

  // ── Close mobile menu on wide viewport ───────────────────────────────────
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // ── Locale switch ────────────────────────────────────────────────────────
  const handleLocaleChange = useCallback((code: LocaleCode) => {
    setLangOpen(false);
    setMobileOpen(false);
    const segs    = pathname.split('/').filter(Boolean);
    const hasLocale = LOCALES.some((l) => l.code === segs[0]);
    let newPath: string;
    if (hasLocale) {
      segs[0] = code;
      newPath  = '/' + segs.join('/');
    } else {
      newPath = code === 'en' ? pathname : `/${code}${pathname}`;
    }
    router.push(newPath);
  }, [pathname, router]);

  const activeLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  // ── Header style ─────────────────────────────────────────────────────────
  // Always show backdrop-blur so the nav "floats" over the hero image from
  // the very first pixel. When scrolled the background darkens and a shadow
  // appears, giving visual separation from the page content below.
  const headerBg = isScrolled
    ? 'bg-[#1B263B]/80 shadow-[0_2px_24px_rgba(0,0,0,0.35)] border-b border-white/10'
    : 'bg-[#1B263B]/30 border-b border-white/5';

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HEADER BAR
        ══════════════════════════════════════════════════════════════════════ */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          backdrop-blur-md
          transition-all duration-400 ease-in-out
          ${headerBg}
          ${isScrolled ? 'py-3' : 'py-4'}
        `}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6"
          aria-label="Main navigation"
        >

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <a
            href={`/${locale === 'en' ? '' : locale}`}
            className="flex items-center gap-2.5 group flex-shrink-0"
            aria-label="PortoPrime — Home"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                         transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #E0C397, #C9A96E)' }}
            >
              <TrendingUp className="w-4.5 h-4.5 text-[#1B263B]" strokeWidth={2.5} />
            </div>
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.01em' }}
            >
              Porto<span className="text-gradient-gold">Prime</span>
            </span>
          </a>

          {/* ── Desktop nav links ──────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-5 flex-1 justify-center" role="navigation">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="
                  text-sm font-medium text-white/75 hover:text-white
                  relative
                  after:absolute after:bottom-[-4px] after:left-0
                  after:h-[2px] after:w-0 after:rounded-full
                  after:bg-gradient-to-r after:from-[#E0C397] after:to-[#C9A96E]
                  after:transition-all after:duration-300
                  hover:after:w-full
                  transition-colors duration-200
                "
              >
                {t(key)}
              </a>
            ))}
          </div>

          {/* ── Right side: Language picker + CTA ─────────────────────── */}
          {/*
            Both controls share h-10 (40px) so they sit on the same baseline
            as the w-9 h-9 logo icon when the flex container uses items-center.
          */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">

            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="
                  h-10 flex items-center gap-1.5 px-3.5 rounded-full
                  text-sm font-medium text-white/80 hover:text-white
                  border border-white/20 hover:border-white/40
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C397]/60
                "
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t('languageLabel')}
              >
                <Globe className="w-3.5 h-3.5 opacity-70" />
                <span>{activeLocale.flag} {activeLocale.code.toUpperCase()}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {langOpen && (
                <div
                  className="
                    absolute top-full right-0 mt-2 w-44
                    rounded-2xl overflow-hidden
                    shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                    border border-white/10
                    animate-fade-in
                  "
                  style={{ background: 'rgba(18,28,45,0.95)', backdropFilter: 'blur(16px)' }}
                  role="listbox"
                  aria-label={t('languageLabel')}
                >
                  {LOCALES.map((loc) => (
                    <button
                      key={loc.code}
                      role="option"
                      aria-selected={loc.code === locale}
                      onClick={() => handleLocaleChange(loc.code as LocaleCode)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3
                        text-sm transition-colors duration-150
                        hover:bg-white/10
                        ${loc.code === locale
                          ? 'text-[#E0C397] font-semibold bg-white/5'
                          : 'text-white/75'
                        }
                      `}
                    >
                      <span className="text-base leading-none">{loc.flag}</span>
                      <span>{loc.label}</span>
                      {loc.code === locale && (
                        <span className="ml-auto text-[#E0C397] text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className="
                h-10 inline-flex items-center justify-center px-5 rounded-full
                text-sm font-semibold text-[#1B263B]
                min-w-[130px]
                transition-all duration-300
                hover:scale-105 hover:shadow-[0_0_20px_rgba(224,195,151,0.4)]
                active:scale-100
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C397]
              "
              style={{ background: 'linear-gradient(135deg, #E0C397, #C9A96E)' }}
            >
              {t('cta')}
            </a>
          </div>

          {/* ── Mobile hamburger ──────────────────────────────────────── */}
          <button
            className="
              md:hidden w-10 h-10 flex items-center justify-center
              rounded-full border border-white/20 text-white
              hover:bg-white/10 transition-all duration-200
            "
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen
              ? <X    className="w-5 h-5" />
              : <Menu className="w-5 h-5" />
            }
          </button>

        </nav>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE OVERLAY
        ══════════════════════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE PANEL — slides in from the right
        ══════════════════════════════════════════════════════════════════════ */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ background: 'rgba(18,28,45,0.97)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        aria-label="Mobile navigation"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <span
            className="text-lg font-bold text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Porto<span className="text-gradient-gold">Prime</span>
          </span>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile links */}
        <nav className="flex flex-col gap-1 px-4 py-6 flex-1" role="navigation">
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center px-4 py-3.5 rounded-xl
                text-white/80 hover:text-white hover:bg-white/8
                font-medium transition-all duration-200 text-sm
              "
            >
              {t(key)}
            </a>
          ))}

          {/* Language section */}
          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="px-4 pb-3 text-[10px] font-bold tracking-[0.25em] uppercase text-white/35">
              {t('languageLabel')}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => handleLocaleChange(loc.code as LocaleCode)}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl
                    text-sm transition-all duration-200
                    ${loc.code === locale
                      ? 'bg-white/12 text-[#E0C397] font-semibold'
                      : 'text-white/65 hover:bg-white/8 hover:text-white'
                    }
                  `}
                  aria-pressed={loc.code === locale}
                >
                  <span className="text-base leading-none">{loc.flag}</span>
                  <span>{loc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile CTA */}
        <div className="px-6 pb-8">
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="
              flex items-center justify-center w-full px-6 py-4 rounded-full
              text-sm font-bold text-[#1B263B]
              transition-all duration-300 hover:shadow-[0_0_20px_rgba(224,195,151,0.35)] active:scale-95
            "
            style={{ background: 'linear-gradient(135deg, #E0C397, #C9A96E)' }}
          >
            {t('cta')}
          </a>
        </div>
      </div>
    </>
  );
}
