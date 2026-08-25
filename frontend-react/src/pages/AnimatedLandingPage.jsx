import { Navbar } from '../components/landing/Navbar';
import { AnimatedHero } from '../components/landing/AnimatedHero';
import { Stats } from '../components/landing/Stats';
import { Signals } from '../components/landing/Signals';
import { Universities } from '../components/landing/Universities';
import { ComparisonTable } from '../components/landing/ComparisonTable';
import { Process } from '../components/landing/Process';
import { Faq } from '../components/landing/Faq';
import { SiteFooter } from '../components/landing/SiteFooter';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight, Compass, Search, FileCheck } from 'lucide-react';

export default function AnimatedLandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0F172A', color: '#FFFFFF', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main>
        {/* 3D Animated Hero */}
        <AnimatedHero />

        {/* Live System Stats */}
        <Stats />

        {/* 3D Workflow: How We Apply On Your Behalf */}
        <section style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #0F172A 0%, #070D1B 100%)', position: 'relative' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#34D399',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                <Zap size={14} />
                <span>UNLIMITED ADMISSION PROCESS</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginTop: '0.25rem',
                }}
              >
                How We Apply For You — Step by Step
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
                Sit back while our consultancy team searches, evaluates eligibility, and submits your applications to public German universities.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.75rem' }}>
              {[
                {
                  step: '01',
                  title: 'Academic Profiling',
                  desc: 'We analyze your GPA, ECTS credits, language certs (IELTS/TOEFL/German) & target preferences.',
                  icon: Compass,
                  color: '#38BDF8',
                },
                {
                  step: '02',
                  title: 'AI University Matching',
                  desc: 'Our engine filters 2,000+ German public programs matching your exact ECTS & subject requirements.',
                  icon: Search,
                  color: '#FCD34D',
                },
                {
                  step: '03',
                  title: 'Document & VPD Audit',
                  desc: 'Our experts audit your certificates, Motivational Letter, and verify Uni-Assist VPD prerequisites.',
                  icon: FileCheck,
                  color: '#34D399',
                },
                {
                  step: '04',
                  title: 'Direct Application Submit',
                  desc: 'We submit unlimited applications on your behalf & track live status until your offer letter arrives!',
                  icon: ShieldCheck,
                  color: '#C49746',
                },
              ].map((item, idx) => {
                const StepIcon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      padding: '2rem 1.5rem',
                      position: 'relative',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                      transition: 'transform 250ms ease, border-color 250ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: item.color, opacity: 0.8 }}>
                        {item.step}
                      </span>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: `${item.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <StepIcon size={20} style={{ color: item.color }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Signals / Recommender Strengths */}
        <Signals />

        {/* German Universities Showcase */}
        <Universities />

        {/* 3D Pricing & Subscription Section */}
        <ComparisonTable darkTheme={true} />

        {/* FAQ Section */}
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
