import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Stats } from '../components/landing/Stats';
import { Signals } from '../components/landing/Signals';
import { Universities } from '../components/landing/Universities';
import { ComparisonTable } from '../components/landing/ComparisonTable';
import { Process } from '../components/landing/Process';
import { Faq } from '../components/landing/Faq';
import { SiteFooter } from '../components/landing/SiteFooter';

/**
 * Orbon Consultancy public landing page — clean reference design with accordion FAQ.
 */
export default function HomePage() {
  return (
    <div style={{ background: '#FAF7F2', color: '#161D2B', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Signals />
        <Universities />
        <ComparisonTable />
        <Process />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
