import { Navbar }         from '@/components/Navbar';
import { Hero }           from '@/components/Hero';
import { Services }       from '@/components/Services';
import { Calculator }     from '@/components/Calculator';
import { Portfolio }      from '@/components/Portfolio';
import { TrustedPartners} from '@/components/TrustedPartners';
import { FAQ }            from '@/components/FAQ';
import { LeadMagnet }     from '@/components/LeadMagnet';
import { LeadForm }       from '@/components/LeadForm';
import { Footer }         from '@/components/Footer';

// ─── Types ─────────────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ locale: string }>;
}

// ─── Home Page ─────────────────────────────────────────────────────────────
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen">
      {/* Sticky Navigation */}
      <Navbar locale={locale} />

      {/* Hero — high-conversion section with Trust Badges */}
      <Hero />

      {/* Services — Bento Grid with 4 USP cards + supporting services */}
      <Services />

      {/* ROI Calculator — interactive property potential estimator */}
      <Calculator />

      {/* Portfolio — Before/After renovation slider with ROI stats */}
      <Portfolio />

      {/* Trusted Partners — partner and certification logos */}
      <TrustedPartners />

      {/* FAQ — investor legal & tax Q&A accordion */}
      <FAQ />

      {/* Lead Magnet — free Portugal Investment Guide 2026 */}
      <LeadMagnet />

      {/* Lead Capture Form — multilingual with Telegram + email notifications */}
      <LeadForm />

      {/* Footer — legal links, trust marks, copyright */}
      <Footer />
    </main>
  );
}
