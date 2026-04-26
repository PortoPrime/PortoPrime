# PortoPrime — Project Status & Context

> **Persistent context for Claude.** Update after every milestone so context survives compaction.
> **Owner:** Aleks (alexxistu@gmail.com)
> **Last updated:** 2026-04-26 (post-legal-pages, ready for first campaign)

---

## Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **i18n:** next-intl, 7 locales — `en` (default), `pt`, `ru`, `de`, `fr`, `it`, `es`
- **Styling:** Tailwind CSS + Lucide React
- **Hosting:** Vercel (auto-deploy from GitHub `main`)
- **Production domain:** `https://portoprime.pt` (purchased via PTisp, DNS on Vercel)
- **Legacy fallback:** `portoprime.vercel.app` (still resolves, 301 to portoprime.pt)
- **Brand colors:** primary `#1B263B` (Deep Blue), secondary `#E0C397` (Gold/Sand)

## Business

- **Niche:** premium property management, AL licensing, renovation in Lisbon, Porto, Algarve
- **Tone:** premium, trustworthy, investor-oriented
- **Office address:** Rua Fernando Farinha 25C, 1950-273 Marvila, Lisboa
- **Phone:** +351 915 481 058 (also WhatsApp)

---

## Meta Ads Integration — STATUS

### Pixel / CAPI Dataset

- **Dataset name:** "Send request конверсия"
- **Dataset/Pixel ID:** `1343984417590582`
- **Owner Business Manager:** `1119084214614566` (PortoPrime)
- **Ad Account:** PortoPrime — `942503462024609`

### Code wiring (verified working)

| File | Event | Source |
|---|---|---|
| `components/MetaPixel.tsx` | `PageView` + `ViewContent` (auto) | Browser |
| `components/LeadForm.tsx` (line ~238) | `Contact` | Browser (Pixel) + Server (CAPI) — deduplicated |
| `components/LeadMagnet.tsx` | `CompleteRegistration` | Browser (Pixel) + Server (CAPI) — deduplicated |
| `app/api/lead/route.ts` | Routes form submissions to CAPI | Server |
| `lib/meta-pixel.ts` | Client helpers: `trackContact`, `trackCompleteRegistration`, `trackViewContent`, `setUserData` | Browser |
| `lib/meta-capi.ts` | Server helpers: `sendContactEvent`, `sendCompleteRegistrationEvent`, `sendViewContentEvent` | Server |

### Env vars (Vercel Production)

- `NEXT_PUBLIC_META_PIXEL_ID` = `1343984417590582`
- `META_CAPI_ACCESS_TOKEN` = (set, server-only)
- `NEXT_PUBLIC_SITE_URL` = `https://portoprime.pt`
- `META_TEST_EVENT_CODE` = **EMPTY** in prod (was set during testing, removed after redeploy)
- SMTP creds — not configured yet

### Verification & Test Results

- **Domain verified:** `portoprime.pt` Verified ✓ via meta-tag `facebook-domain-verification` content `342pg89byakl7qkkhqc1p7wbjthyjn` (in `app/[locale]/layout.tsx`)
- **Last successful CAPI test:**
  ```
  [MetaCAPI] Contact OK — response:
    events_received: 1, messages: [], fbtrace_id: 'A5ivjZk69M1kCa7H9AwTEiw',
    test_code_sent: 'TEST94199'
  [LeadAPI] Meta CAPI event sent { source: 'contact', eventId: '50c9eaa3-04de-4004-811d-e3e34247002f' }
  ```
- **Dedup confirmed:** browser Pixel and server CAPI share same `event_id` per submission
- **EMQ payload:** sends IP + UA + fbc + fbp + hashed email/phone/firstName/lastName/city/country

---

## Roadmap — Meta Ads Launch

| Step | Status | Notes |
|---|---|---|
| **1a.** Remove TEST_EVENT_CODE from Vercel env | ✅ Done | |
| **1b.** Verify domain `portoprime.pt` | ✅ Done | Verified in Business Settings → Brand Safety → Domains |
| **1c.** Configure Aggregated Event Measurement (AEM) | ⏸ Blocked / Skip | Not visible in Meta UI yet. Likely auto-managed in 2025+ — will appear after first Conversion campaign is created. **Decision: skip and continue.** |
| **2.** Facebook Page + Ad Account + Pixel access | ✅ Done | FB Page **PortoPrime** (ID `1119067117949609`) — owned by PortoPrime business. IG linked. Card attached to Ad Account `942503462024609`. |
| **3.** Custom Audiences | ✅ Done | All 4 created in Ads Manager `942503462024609` |
| **3a.** Legal pages (Privacy, Terms, Legal Disclaimer) | ✅ Done | `/privacy`, `/terms`, `/legal` live in all 7 locales. Shared `LegalPage` component reads sections from `legal.{privacy,terms,disclaimer}` namespaces. Sitemap updated. Footer uses locale-aware `Link`. TypeScript: 0 errors. |
| **4.** First Conversion campaign | ⏳ Next | Optimize for `Contact`. Country: Portugal. Decisions pending: budget tier (€10/€20/€30 per day), target audience (RU expats / PT locals / EN expats), creatives format. |

### Custom Audiences — created 2026-04-26

| Name | Type | Definition | Status |
|---|---|---|---|
| `PortoPrime — All Visitors 180d` | Website Custom | Include: All website visitors, 180d | Active |
| `PortoPrime — Visitors NOT Converted 180d` | Website Custom | Include: All visitors 180d. Exclude: `Contact` 180d. **TODO:** add `CompleteRegistration` exclusion once event fires on prod | Active |
| `PortoPrime — Contact Converters 180d` | Website Custom | Include: `Contact` event, 180d | Source for LAL — populates as real leads come in |
| `PortoPrime — LAL Contact 1% PT` | Lookalike | Source: `Contact Converters 180d`, Country: Portugal, Size: 1% | Pending — auto-activates when source has ≥50 events |

### Legal pages — created 2026-04-26

| Route | Namespace | Sections | Notes |
|---|---|---|---|
| `/privacy` | `legal.privacy` | 11 | GDPR + Lei 58/2019 compliant. Lists Meta + Vercel as processors, EEA transfer SCCs, CNPD complaint right |
| `/terms` | `legal.terms` | 14 | Portuguese law + Lisbon district court jurisdiction. Liability cap = 12 months of fees |
| `/legal` | `legal.disclaimer` | 8 | Calculator non-binding, "no professional advice", forward-looking statements caveat |

**Files created:**
- `components/LegalPage.tsx` — shared server component, iterates `section{N}Title/Body` until missing
- `i18n/navigation.ts` — `Link`/`useRouter` from `createNavigation(routing)` for locale-aware footer links
- `app/[locale]/privacy/page.tsx`, `app/[locale]/terms/page.tsx`, `app/[locale]/legal/page.tsx`
- All 7 `messages/{lang}.json` updated with `legal.privacy`, `legal.terms`, `legal.disclaimer` (full localized content — EN/PT/RU/DE/FR/IT/ES)
- `app/sitemap.ts` ROUTES extended; legal routes set to `changeFrequency: yearly, priority: 0.3`
- `components/Footer.tsx` switched to `Link` from `@/i18n/navigation`

**Contact emails referenced (NOT yet provisioned in SMTP):**
- `privacy@portoprime.pt` — GDPR data-subject requests
- `legal@portoprime.pt` — terms/disclaimer questions

### Pending strategic decisions for Step 4 (first campaign)

When user is ready to launch:
- **Budget:** A=€10/d (slow learn), B=€20/d (recommended), C=€30+/d (fast)
- **Audience:** my recommendation = RU-speaking expats in PT. Alternatives: PT-locals, EN-expats. Different creative needed per audience
- **Creatives:** check if user has property photos / interior shots / team photos. If not — start minimal with stock + text
- **Languages on landing:** site supports 7 langs; first campaign should drop traffic to a single locale matching ad copy

---

## Known Issues / Notes

- AEM section is not visible in Events Manager UI as of 2026-04-26 despite verified domain. Meta has been moving toward auto-managed AEM/EMQ — manual configuration is no longer mandatory in many flows. Skip and revisit if Conversion campaign requires it.
- Local dev events from `localhost:3000` still appear in pixel — harmless leftover from testing.
- SMTP for lead notifications not configured (no `notifications@portoprime.pt`). Form submissions still flow through CAPI to Meta correctly; only email-to-team is missing. Same gap blocks `privacy@portoprime.pt` and `legal@portoprime.pt` aliases referenced in legal pages — provision before promoting them externally.
- `Portugal-Investment-Guide-2026.md` exists at project root — content for the lead-magnet PDF.
- **TODO:** Custom Audience `PortoPrime — Visitors NOT Converted 180d` currently excludes only `Contact`. Once `CompleteRegistration` fires on prod for the first time (someone downloads Investment Guide), edit the audience and add a second exclusion: `CompleteRegistration` → 180d.

---

## Tone for Claude in this project

- Direct, decisive. No excessive hedging.
- Russian for chat with Aleks. Code comments in English.
- Skip recapping basics already covered in this CLAUDE.md.
- Always check this file before answering "where are we?" / "what's next?".
