import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { SiteFooter } from '../components/landing/SiteFooter';
import { Link } from 'react-router-dom';
import { Compass, Search, FileCheck, ShieldCheck, MailOpen, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      id: "step-1",
      number: "01",
      title: "Create Your Profile",
      description: "Start by registering an account. Fill in your academic background, GPA, ECTS credits, and language proficiencies (IELTS/TOEFL or German). This helps our system understand exactly what you're qualified for.",
      icon: UserPlus,
      color: "var(--lp-gold)",
      features: ["Quick 2-minute registration", "Secure data handling", "Personalized dashboard"],
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "step-2",
      number: "02",
      title: "Smart Program Matching",
      description: "Use our intelligent search tool to explore thousands of public university programs in Germany. Our eligibility engine instantly checks if your background meets the specific requirements of each program.",
      icon: Search,
      color: "var(--lp-forest)",
      features: ["Filter by English or German taught", "Check ECTS credit matches", "Tuition-free program focus"],
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "step-3",
      number: "03",
      title: "Shortlist & Prepare",
      description: "Save your favorite programs to your shortlist. Review the exact admission prerequisites, deadlines, and required documents (like your Motivational Letter, CV, and VPD).",
      icon: Compass,
      color: "#0F172A",
      features: ["Compare university rankings", "Track application deadlines", "Organize required documents"],
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "step-4",
      number: "04",
      title: "Expert Document Audit",
      description: "Before applying, our consultancy team audits your application materials. We ensure your documents meet the strict standards of German universities and Uni-Assist.",
      icon: FileCheck,
      color: "var(--lp-gold)",
      features: ["Motivation letter review", "CV formatting checks", "VPD prerequisite verification"],
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "step-5",
      number: "05",
      title: "We Apply For You",
      description: "Sit back and relax. Choose our 'Apply For Me' service, and our dedicated agents will handle the tedious process of submitting applications on your behalf to multiple universities.",
      icon: ShieldCheck,
      color: "var(--lp-forest)",
      features: ["Unlimited applications", "Zero paperwork hassle", "Live status tracking"],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "step-6",
      number: "06",
      title: "Receive Offer Letters",
      description: "We monitor your application portals and notify you the moment a decision is made. Receive your official admission letter and start preparing for your journey to Germany!",
      icon: MailOpen,
      color: "#0F172A",
      features: ["Instant email notifications", "Guidance on enrollment", "Visa preparation tips"],
      image: "https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div style={{ background: 'var(--lp-bg)', color: 'var(--lp-foreground)', minHeight: '100vh', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* SEO Meta tags simulation via semantic HTML */}
      <header>
        <Navbar />
      </header>

      <main style={{ flex: 1 }}>
        {/* Page Header */}
        <section 
          aria-label="How it works header"
          style={{ 
            background: '#0F172A', 
            padding: '8rem 2rem 5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFFFFF', fontWeight: 700, margin: '0 0 1.5rem', lineHeight: 1.1 }}>
              Your Journey to Germany, <span style={{ color: 'var(--lp-gold)', fontStyle: 'italic' }}>Simplified.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              We've engineered a seamless process to help international students secure admissions in tuition-free German public universities. Discover how Orbon Consultancy makes your dream a reality.
            </p>
            <Link to="/register" className="lp-hero-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--lp-gold)', color: '#0F172A', border: 'none' }}>
              Start Your Application <ArrowRight size={18} />
            </Link>
          </div>
          
          {/* Decorative background elements */}
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(196, 151, 70, 0.1)', filter: 'blur(80px)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(30, 41, 59, 0.5)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
        </section>

        {/* The Process Section */}
        <section aria-labelledby="process-heading" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 id="process-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.5rem', color: 'var(--lp-foreground)', marginBottom: '1rem' }}>
              How We Work
            </h2>
            <p style={{ color: 'var(--lp-muted-fg)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Follow our proven 6-step procedure designed to maximize your chances of acceptance while minimizing your stress.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 !== 0;
              
              return (
                <article 
                  key={step.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: isEven ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    gap: '4rem',
                    background: 'var(--lp-card)',
                    padding: '3rem',
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                    border: '1px solid var(--lp-border)',
                    '@media (max-width: 900px)': { flexDirection: 'column', gap: '2rem', padding: '2rem' }
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.05)', color: step.color, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
                      {step.number}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', color: 'var(--lp-foreground)', marginBottom: '1rem' }}>
                      {step.title}
                    </h3>
                    <p style={{ color: 'var(--lp-muted-fg)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                      {step.description}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {step.features.map((feature, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lp-foreground)', fontSize: '0.95rem', fontWeight: 500 }}>
                          <CheckCircle2 size={18} color="var(--lp-gold)" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '420px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid var(--lp-border)' }}>
                      <img 
                        src={step.image} 
                        alt={step.title}
                        style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="lp-how-it-works-cta" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.5rem', color: 'var(--lp-forest-fg)', marginBottom: '1.5rem' }}>
              Ready to start your journey?
            </h2>
            <p className="lp-how-it-works-cta-copy" style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Join hundreds of students who have successfully secured their place in top German universities through Orbon Consultancy.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="lp-how-it-works-cta-primary">
                Create Free Account
              </Link>
              <Link to="/programs" className="lp-how-it-works-cta-secondary">
                Browse Programs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
