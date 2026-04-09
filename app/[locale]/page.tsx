import { Navbar } from '@/components/Navbar';

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

      {/* Hero placeholder — Phase 2 */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B263B 0%, #263554 60%, #1B263B 100%)' }}
      >
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase mb-6 text-gradient-gold">
            Portugal&#39;s Premier Property Partner
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Maximize Your Property Yield{' '}
            <span className="text-gradient-gold">in Portugal</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            From sub-renting and 24/7 guest management to full renovation and AL licensing — we turn your property into a high-performing asset.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-primary transition-all duration-300 hover:scale-105 hover:shadow-gold"
              style={{ background: 'linear-gradient(135deg, #E0C397, #C9A96E)' }}
            >
              Get Free Consultation
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all duration-300"
            >
              Explore Services →
            </a>
          </div>

          {/* Stats badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-14">
            {[
              { value: '15%', label: 'Avg. Yield' },
              { value: '90%', label: 'Occupancy' },
              { value: '120+', label: 'Properties' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="glass rounded-2xl px-6 py-3 text-center"
              >
                <div className="text-2xl font-bold text-gradient-gold">{value}</div>
                <div className="text-xs text-white/70 mt-0.5 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative gradient orb */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E0C397, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E0C397, transparent)' }}
        />
      </section>

      {/* Services placeholder */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C9A96E' }}>
            Our Services
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: '#1B263B', fontFamily: 'Playfair Display, serif' }}>
            Everything Your Property Needs
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Bento Grid — Phase 2
          </p>
        </div>
      </section>

      {/* Contact placeholder */}
      <section id="contact" className="py-24" style={{ background: '#1B263B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Lead Capture Form — Phase 2
          </h2>
        </div>
      </section>
    </main>
  );
}
