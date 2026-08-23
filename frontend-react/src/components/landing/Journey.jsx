import { UserCheck, Sparkles, Bookmark, ClipboardCheck, Award, ArrowRight } from 'lucide-react';
import { useInView } from '../../hooks/useReveal';
import { cn } from '../../lib/cn';

const stages = [
  { n: '01', title: 'Profile', body: 'Your academic record and language level, kept in one place.', icon: UserCheck },
  { n: '02', title: 'Recommendation', body: 'Matched programs, ranked and explained with exact match breakdown.', icon: Sparkles },
  { n: '03', title: 'Shortlist', body: 'Save and compare the programs worth pursuing side-by-side.', icon: Bookmark },
  { n: '04', title: 'Application', body: 'Track requirements, VPD documents, and deadlines per program.', icon: ClipboardCheck },
  { n: '05', title: 'Decision', body: 'Record admission outcomes and choose where to enroll with confidence.', icon: Award },
];

export function Journey() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section id="journey" style={{ background: '#F7F5EF', padding: '5.5rem 0' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 2rem' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)', gap: '4rem', alignItems: 'flex-start' }}>
          
          {/* Left Column */}
          <div style={{ position: 'sticky', top: '5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C7A45B', textTransform: 'uppercase', background: 'rgba(199, 164, 91, 0.12)', padding: '0.4rem 0.85rem', borderRadius: 999, border: '1px solid rgba(199, 164, 91, 0.25)' }}>
              THE APPLICATION JOURNEY
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.8vw, 3rem)', fontWeight: 400, color: '#0E1B2E', marginTop: '1rem', lineHeight: 1.15 }}>
              One organized path from first profile to final decision.
            </h2>
            <p style={{ color: '#68736F', fontSize: '1rem', lineHeight: 1.6, marginTop: '1.25rem', maxWidth: 480 }}>
              What starts on this page continues inside Orbon Consultancy. Your profile, recommendations, shortlist, and applications stay connected, so nothing is rebuilt from scratch at each stage.
            </p>

            {/* Visual Highlight Callout Card */}
            <div style={{ marginTop: '2.5rem', background: '#ffffff', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(31,41,39,0.08)', boxShadow: '0 12px 30px -10px rgba(14,27,46,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0E1B2E', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0E1B2E', margin: 0 }}>
                    100% Connected Admissions
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#68736F', margin: 0, marginTop: '0.2rem' }}>
                    Seamless workflow built specifically for German university entry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Interactive Step Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.n}
                  className={cn('lp-reveal', inView && 'lp-is-visible')}
                  style={{
                    ['--lp-reveal-delay']: `${i * 90}ms`,
                    background: '#ffffff',
                    padding: '1.5rem 1.75rem',
                    borderRadius: 16,
                    border: '1px solid rgba(31,41,39,0.08)',
                    boxShadow: '0 4px 16px rgba(31,41,39,0.04)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.35rem',
                    transition: 'transform 250ms ease, boxShadow 250ms ease',
                  }}
                >
                  {/* Theme Accent Gradient Gold Circular Badge */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #C7A45B 0%, #A88235 100%)',
                      color: '#ffffff',
                      boxShadow: '0 4px 14px rgba(199, 164, 91, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      flexShrink: 0,
                    }}
                  >
                    {stage.n}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Icon size={18} style={{ color: '#C7A45B' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0E1B2E', margin: 0 }}>
                        {stage.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#68736F', marginTop: '0.35rem', margin: 0, lineHeight: 1.5 }}>
                      {stage.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
