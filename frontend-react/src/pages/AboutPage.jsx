import { Navbar } from '../components/landing/Navbar';
import { SiteFooter } from '../components/landing/SiteFooter';
import { Award, GraduationCap, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div style={{ background: '#FAF7F2', color: '#161D2B', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <main style={{ padding: '4.5rem 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#5B6578',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.color = '#161D2B')}
            onMouseOut={(e) => (e.target.style.color = '#5B6578')}
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: '#C49746', textTransform: 'uppercase', background: 'rgba(196,151,70,0.12)', padding: '0.35rem 0.85rem', borderRadius: '999px', display: 'inline-block', marginBottom: '0.85rem' }}>
              ABOUT ORBON CONSULTANCY
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.3rem, 4vw, 3.2rem)', fontWeight: 700, color: '#161D2B', marginTop: '0.5rem', lineHeight: 1.15 }}>
              Your Trusted Pathway to German Higher Education
            </h1>
            <p style={{ color: '#5B6578', fontSize: '1.05rem', lineHeight: 1.65, marginTop: '1rem' }}>
              We assist international students in navigating accredited, tuition-free public German universities through data-driven matching, credential evaluation, and professional application management.
            </p>
          </div>

          {/* Mission & Vision Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2.25rem', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#FAF7F2', border: '1px solid rgba(196,151,70,0.3)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <GraduationCap size={22} />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.75rem 0' }}>
                Our Mission
              </h3>
              <p style={{ fontSize: '0.925rem', color: '#5B6578', lineHeight: 1.65, margin: 0 }}>
                To make world-class German university education accessible, transparent, and hassle-free for ambitious global students by matching academic backgrounds with exact ECTS, GPA, and Uni-Assist requirements.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2.25rem', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#FAF7F2', border: '1px solid rgba(196,151,70,0.3)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Award size={22} />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.75rem 0' }}>
                Public Institution Focus
              </h3>
              <p style={{ fontSize: '0.925rem', color: '#5B6578', lineHeight: 1.65, margin: 0 }}>
                We prioritize tuition-free public German institutions (such as TUM, LMU Munich, HU Berlin, and Heidelberg) that grant internationally accredited degrees without exorbitant tuition fees.
              </p>
            </div>
          </div>

          {/* Key Pillars */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '3rem 2.5rem', border: '1px solid rgba(22,29,43,0.1)', boxShadow: '0 6px 24px rgba(0,0,0,0.03)', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.85rem', fontWeight: 700, color: '#161D2B', margin: '0 0 1.5rem 0', textAlign: 'center' }}>
              Why Students Choose Orbon Consultancy
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', marginTop: '2rem' }}>
              {[
                { title: 'Academic Credential Evaluation', desc: 'We verify your bachelor degree, transcripts, and ECTS equivalency against Anabin guidelines.' },
                { title: 'Personalized Program Matching', desc: 'Find Bachelor & Master programs in Engineering, CS, AI, Business, and Natural Sciences.' },
                { title: 'End-to-End Submission Support', desc: 'Our dedicated team manages VPD verifications, Uni-Assist applications, and direct university submissions.' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} style={{ color: '#C49746', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '1rem', color: '#161D2B', display: 'block', marginBottom: '0.35rem' }}>{item.title}</strong>
                    <p style={{ fontSize: '0.875rem', color: '#5B6578', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div style={{ textAlign: 'center', background: '#161D2B', color: '#ffffff', padding: '3rem 2rem', borderRadius: '20px', boxShadow: '0 12px 32px rgba(22,29,43,0.25)' }}>
            <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.85rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.75rem 0' }}>
              Ready to Explore Your German Study Match?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.975rem', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              Get started with our intelligent recommendation engine and discover public degree programs matching your academic background.
            </p>
            <Link
              to="/register"
              style={{
                background: '#C49746',
                color: '#ffffff',
                padding: '0.8rem 1.85rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.925rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(196,151,70,0.3)',
              }}
            >
              Get Started Now <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
