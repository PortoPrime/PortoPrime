import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Calculator } from '@/components/Calculator';
import { LeadForm } from '@/components/LeadForm';
import { Footer } from '@/components/Footer';

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

      {/* Lead Capture Form — multilingual with Telegram + email notifications */}
      <LeadForm />

      {/* Footer — legal links, trust marks, copyright */}
      <Footer />
    </main>
  );
}
