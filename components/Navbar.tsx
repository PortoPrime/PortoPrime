'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, ChevronDown, Menu, X, TrendingUp } from 'lucide-react';

// ─── Constants ─────────────────────────────────────────────────────────────

/** All supported locales with their human-readable labels and flag emoji */
const LOCALES = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'pt', label: 'Português',  flag: '🇵🇹' },
  { code: 'ru', label: 'Русский',    flag: '🇷🇺' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];

/** Navigation anchor links */
const NAV_LINKS = [
  { key: 'services' as const,  href: '#services' },
  { key: 'results'  as const,  href: '#results'  },
  { key: 'contact'  as const,  href: '#contact'  },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────
interface NavbarProps {
  locale: string;
}

// ─── Navbar Component ──────────────────────────────────────────────────────
export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [langOpen,       setLangOpen]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);

  // Refs for click-outside detection
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // ── Scroll handler — add glass-dark class after 60px ────────────────────
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Close language dropdown on outside click ─────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  // ── Close mobile menu on resize ──────────────────────────────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Locale switch — replace locale segment in pathname ───────────────────
  const handleLocaleChange = useCallback((newLocale: LocaleCode) => {
    setLangOpen(false);
    setMobileOpen(false);

    // Replace the current locale prefix in the pathname
    const segments = pathname.split('/').filter(Boolean);
    const isFirstSegmentLocale = LOCALES.some((l) => l.code === segments[0]);

    let newPath: string;
    if (isFirstSegmentLocale) {
      // Swap locale segment
      segments[0] = newLocale;
      newPath = '/' + segments.join('/');
    } else {
      // No locale prefix in path (default locale) — prepend new locale
      newPath = newLocale === 'en' ? pathname : `/${newLocale}${pathname}`;
    }

    router.push(newPath);
  }, [pathname, router]);

  // ── Active locale label ──────────────────────────────────────────────────
  const activeLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <>
      {/* ── Main navbar bar ─────────────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${isScrolled
            ? 'glass-dark shadow-navy py-3'
            : 'bg-transparent py-5'
          }
        `}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* ── Logo ──────────────────────────────────────────────────── */}
          <a
            href={`/${locale === 'en' ? '' : locale}`}
            className="flex items-center gap-2.5 group"
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
          </a>

          {/* ── Desktop nav links ──────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-8" role="navigation">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="
                  text-sm font-medium text-white/80
                  hover:text-white
                  relative after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-0
                  after:bg-[#E0C397] after:transition-all after:duration-300
                  hover:after:w-full
                  transition-colors duration-200
                "
              >
                {t(key)}
              </a>
            ))}
          </div>

          {/* ── Right side: Language picker + CTA ─────────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language switcher dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangOpen((prev) => !prev)}
                className="
                  flex items-center gap-1.5 px-3 py-2 rounded-full
                  text-sm font-medium text-white/80 hover:text-white
                  border border-white/20 hover:border-white/40
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C397]
                "
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t('languageLabel')}
              >
                <Globe className="w-4 h-4" />
                <span>{activeLocale.flag} {activeLocale.code.toUpperCase()}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown list */}
              {langOpen && (
                <div
                  className="
                    absolute top-full right-0 mt-2 w-44
                    glass-dark rounded-2xl overflow-hidden shadow-navy
                    border border-white/10
                    animate-fade-in
                  "
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
                          : 'text-white/80'
                        }
                      `}
                    >
                      <span className="text-base leading-none">{loc.flag}</span>
                      <span>{loc.label}</span>
                      {loc.code === locale && (
                        <span className="ml-auto text-[#E0C397]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <a
              href="#contact"
              className="
                inline-flex items-center px-5 py-2.5 rounded-full
                text-sm font-semibold text-[#1B263B]
                transition-all duration-300
                hover:scale-105 hover:shadow-gold active:scale-100
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C397]
              "
              style={{ background: 'linear-gradient(135deg, #E0C397, #C9A96E)' }}
            >
              {t('cta')}
            </a>
          </div>

          {/* ── Mobile hamburger ──────────────────────────────────────── */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen
              ? <X className="w-5 h-5" />
              : <Menu className="w-5 h-5" />
            }
          </button>
        </nav>
      </header>

      {/* ── Mobile menu overlay ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile menu panel ───────────────────────────────────────────────── */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden
          glass-dark flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-label="Mobile navigation"
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <span
            className="text-lg font-bold text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Porto<span className="text-gradient-gold">Prime</span>
          </span>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile nav links */}
        <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center px-4 py-3 rounded-xl
                text-white/80 hover:text-white hover:bg-white/10
                font-medium transition-all duration-200
              "
            >
              {t(key)}
            </a>
          ))}

          {/* Mobile language section */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="px-4 pb-2 text-xs font-semibold tracking-widest uppercase text-white/40">
              {t('languageLabel')}
            </p>
            <div className="grid grid-cols-2 gap-1">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => handleLocaleChange(loc.code as LocaleCode)}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl
                    text-sm transition-all duration-200
                    ${loc.code === locale
                      ? 'bg-white/15 text-[#E0C397] font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  aria-pressed={loc.code === locale}
                >
                  <span>{loc.flag}</span>
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
              text-sm font-semibold text-[#1B263B]
              transition-all duration-300 hover:shadow-gold active:scale-95
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
