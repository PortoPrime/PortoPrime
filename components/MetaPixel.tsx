'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { consent } from '@/lib/cookies';

/**
 * Meta Pixel — GDPR-gated.
 *
 * Pixel script & PageView/ViewContent fire ONLY after the user grants cookie
 * consent (CookieBanner → `consent.set()` → window event `pp:consent:granted`).
 *
 * Behaviour:
 *   - On mount: check consent cookie. If already granted → mount Pixel.
 *   - Otherwise: listen for `pp:consent:granted` and mount Pixel then.
 *
 * Custom events (Contact, CompleteRegistration, etc.) fire from individual
 * components via the helpers in `lib/meta-pixel.ts` — using the SAME event_id
 * that's sent to /api/lead for Conversions API dedup.
 *
 * No-ops if NEXT_PUBLIC_META_PIXEL_ID is not set (e.g. local dev without a
 * pixel) so nothing breaks.
 */
export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    // Cookie check is client-only — must run after mount.
    if (consent.get()) {
      setConsentGranted(true);
      return;
    }
    // Otherwise wait for the banner to dispatch consent.
    const onGranted = () => setConsentGranted(true);
    window.addEventListener('pp:consent:granted', onGranted);
    return () => window.removeEventListener('pp:consent:granted', onGranted);
  }, []);

  if (!pixelId || !consentGranted) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
          // ViewContent fires alongside PageView — matches the CAPI event
          // configured in Events Manager. On a single-page site the two are
          // near-equivalent, but tracking both gives Meta extra signal.
          fbq('track', 'ViewContent');
        `}
      </Script>
      {/* noscript fallback — image beacon for users with JS disabled */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
