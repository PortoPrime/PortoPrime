/**
 * PortoPrime — Image asset catalogue
 * ─────────────────────────────────────────────────────────────────────────────
 * All next/image sources and blurDataURLs live here so components stay lean.
 * Swap the `src` strings for real production photos without touching any TSX.
 *
 * BlurDataURLs are tiny 8×6 SVGs whose fill matches the dominant image tone.
 * They are pre-computed to avoid any runtime Buffer calls in the browser.
 */

// ─── Blur placeholder constants ────────────────────────────────────────────
// Dominant tone: deep navy (hero, dark bento cards)
export const BLUR_DARK =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzYnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzYnIGZpbGw9JyMxQjI2M0InLz48L3N2Zz4=';

// Dominant tone: very dark navy (footer)
export const BLUR_NAVY =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzYnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzYnIGZpbGw9JyMwRDE4MjYnLz48L3N2Zz4=';

// Dominant tone: warm dark brown (wine / interiors)
export const BLUR_WARM =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzYnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzYnIGZpbGw9JyMyQzIwMTUnLz48L3N2Zz4=';

// Dominant tone: neutral dark (iPad, tech)
export const BLUR_STONE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzYnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzYnIGZpbGw9JyMxQTFBMUEnLz48L3N2Zz4=';

// ─── Image catalogue ────────────────────────────────────────────────────────
// All src URLs point to Unsplash CDN (already in next.config remotePatterns).
// ?auto=format&fit=crop ensures smart-cropping and format negotiation (WebP/AVIF).

export const IMAGES = {

  /**
   * Hero section
   * "Premium Luxury Villa — Tagus River, Lisbon at Sunset"
   * Aspect ratio: 16:9 | Full-bleed background
   */
  hero: {
    src: '/images/hero.jpg',
    alt: 'Premium luxury property overlooking the Tagus River in Lisbon at sunset',
    blurDataURL: BLUR_DARK,
    width: 1920,
    height: 1080,
  },

  /**
   * Bento card — Renovation
   * "Before & After: minimalist, designer-renovated interior"
   * Aspect ratio: 4:5 (portrait — single-column bento card)
   */
  renovation: {
    src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80',
    alt: 'Designer-renovated minimalist apartment interior — PortoPrime renovation service',
    blurDataURL: BLUR_STONE,
    width: 800,
    height: 1000,
  },

  /**
   * Bento card — Guest Check-in
   * "Smiling guest arriving at a clean, bright property"
   * Aspect ratio: 4:5 (portrait — single-column bento card)
   */
  checkIn: {
    src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    alt: 'Guest checking in to a professionally managed PortoPrime property',
    blurDataURL: BLUR_WARM,
    width: 800,
    height: 1000,
  },

  /**
   * Bento card — Owner Dashboard
   * "Real-time accounting dashboard on an iPad"
   * Aspect ratio: 16:9 (landscape — wide AL Compliance card)
   */
  dashboard: {
    src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    alt: 'PortoPrime owner dashboard showing real-time earnings on an iPad',
    blurDataURL: BLUR_STONE,
    width: 1200,
    height: 675,
  },

  /**
   * Bento card — Local Experience / Guest Network
   * "Portuguese azulejos tile wall and a glass of local wine"
   * Aspect ratio: 16:9 (landscape — wide Guest Network card)
   */
  azulejos: {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    alt: 'Traditional Portuguese azulejo tiles and a glass of local wine — local experience',
    blurDataURL: BLUR_WARM,
    width: 1200,
    height: 675,
  },

  /**
   * Portfolio — Before renovation
   * Local asset: /public/images/portfolio-before.jpg
   * Shows the apartment in its original, pre-renovation state.
   * Aspect ratio: 4:3
   */
  beforeReno: {
    src: '/images/portfolio-before.jpg',
    alt: 'Apartment before renovation — original state with untapped potential',
    blurDataURL: BLUR_WARM,
    width: 1200,
    height: 900,
  },

  /**
   * Portfolio — After renovation
   * Local asset: /public/images/portfolio-after.jpg
   * Shows the same apartment after PortoPrime renovation.
   * Aspect ratio: 4:3
   */
  portfolioAfter: {
    src: '/images/portfolio-after.jpg',
    alt: 'Modern renovated apartment — PortoPrime transformation result',
    blurDataURL: BLUR_STONE,
    width: 1200,
    height: 900,
  },
} as const;

export type ImageKey = keyof typeof IMAGES;
