import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Stats } from '../components/landing/Stats';
import { Signals } from '../components/landing/Signals';
import { Universities } from '../components/landing/Universities';
import { ComparisonTable } from '../components/landing/ComparisonTable';
import { Process } from '../components/landing/Process';
import { Faq } from '../components/landing/Faq';
import { SiteFooter } from '../components/landing/SiteFooter';
import { Reveal } from '../components/landing/Reveal';

/**
 * Orbon Consultancy public landing page — clean reference design with accordion FAQ.
 */
export default function HomePage() {
  return (
    <div className="lp-root" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Hero />
        <Reveal><Stats /></Reveal>
        <Reveal><Signals /></Reveal>
        <Reveal><Universities /></Reveal>
        <Reveal><ComparisonTable /></Reveal>
        <Reveal><Process /></Reveal>
        <Reveal><Faq /></Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
