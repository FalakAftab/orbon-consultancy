import { useNavigate } from 'react-router-dom';
import { CreditCard, UploadCloud, Send, GraduationCap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const steps = [
  {
    n: '01',
    title: 'Subscribe & Align Plan',
    body: 'Select your Pro plan. Our team connects with you to outline your target German universities.',
    icon: CreditCard,
    accent: '#C49746',
  },
  {
    n: '02',
    title: 'Upload Documents',
    body: 'Upload your transcripts, CV, MOI/IELTS certificates safely to your encrypted Document Vault.',
    icon: UploadCloud,
    accent: '#38BDF8',
  },
  {
    n: '03',
    title: 'We Prepare & Apply',
    body: 'We format your VPD review, craft application files, and submit to German university portals.',
    icon: Send,
    accent: '#34D399',
  },
  {
    n: '04',
    title: 'Track & Get Admitted',
    body: 'Track real-time status updates in your dashboard until your official admission letter arrives!',
    icon: GraduationCap,
    accent: '#F59E0B',
  },
];

export function Process() {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" style={{ background: '#FAF7F2', padding: '5.5rem 0', borderTop: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#C49746',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={14} />
            <span>YOUR APPLICATION ROADMAP</span>
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
              fontWeight: 600,
              color: '#161D2B',
              marginTop: '0.25rem',
              lineHeight: 1.15,
            }}
          >
            How Orbon Consultancy Handles Your Application Journey
          </h2>
          <p style={{ color: '#5B6578', fontSize: '0.925rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
            A streamlined 4-step path from profile setup to receiving your German university offer letter.
          </p>
        </div>

        {/* Timeline Representation Container */}
        <div style={{ position: 'relative', marginTop: '2.5rem' }}>
          
          {/* Horizontal Connecting Timeline Bar (Desktop line running across nodes) */}
          <div
            className="lp-process-line"
            style={{
              position: 'absolute',
              top: '40px',
              left: '10%',
              right: '10%',
              height: '3px',
              background: 'linear-gradient(90deg, #C49746 0%, #38BDF8 33%, #34D399 66%, #F59E0B 100%)',
              zIndex: 1,
              borderRadius: '999px',
              opacity: 0.35,
            }}
          />

          {/* 4 Connected Timeline Step Nodes */}
          <div className="lp-process-steps-grid" style={{ gap: '1.5rem', position: 'relative', zIndex: 2 }}>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.n}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  {/* Timeline Node Badge Pill */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '24px',
                      background: '#FFFFFF',
                      border: `2px solid ${step.accent}`,
                      boxShadow: `0 10px 25px rgba(0,0,0,0.06), 0 0 15px ${step.accent}20`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.75rem',
                      position: 'relative',
                      transition: 'transform 200ms ease, boxShadow 200ms ease',
                    }}
                  >
                    <Icon size={26} style={{ color: step.accent }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: '#161D2B',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '999px',
                        border: '2px solid #FAF7F2',
                      }}
                    >
                      {step.n}
                    </span>
                  </div>

                  {/* Step Card Content */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '1.75rem 1.35rem',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      transition: 'transform 200ms ease, boxShadow 200ms ease',
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: step.accent, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      STEP {step.n}
                    </div>

                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.5rem', lineHeight: 1.25 }}>
                      {step.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: '#5B6578', lineHeight: 1.6, margin: 0 }}>
                      {step.body}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Callout Banner */}
        <div
          className="lp-process-callout-banner"
          style={{
            marginTop: '4rem',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid rgba(196, 151, 70, 0.2)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            gap: '1.5rem',
            maxWidth: '960px',
            margin: '4rem auto 0',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>
              Ready to start your German university applications?
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#5B6578', marginTop: '0.25rem', margin: 0 }}>
              Select Pro Plan or test your eligibility instantly with our free AI matcher.
            </p>
          </div>

          <button
            onClick={() => navigate('/wizard')}
            style={{
              background: '#C49746',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.85rem 1.75rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(196, 151, 70, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
          >
            <span>Get Started Today</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
