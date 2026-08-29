import { User, Sliders } from 'lucide-react';

export function Signals() {
  return (
    <section id="recommendations" style={{ background: '#FAF7F2', padding: '5rem 0' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="lp-signals-shell" style={{ gap: '3.5rem', alignItems: 'center' }}>
          
          {/* Left: Clean German University Campus Photograph */}
          <div
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <img
              src="/figma_assets/studypath-landing-page___Rectangle.png"
              alt="Historic German university campus courtyard"
              style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Right: Recommendation Engine Text & Feature Cards */}
          <div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', color: '#C49746', textTransform: 'uppercase' }}>
              THE RECOMMENDATION ENGINE
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', fontWeight: 600, color: '#161D2B', marginTop: '0.5rem', lineHeight: 1.15 }}>
              Every signal becomes a stronger match.
            </h2>
            <p style={{ color: '#5B6578', fontSize: '0.925rem', lineHeight: 1.65, marginTop: '1rem' }}>
              Orbon Consultancy does more than list universities. Each piece of information you provide narrows and refines the program set, so the final shortlist reflects your eligibility — not guesswork.
            </p>

            {/* 2 Feature Cards Side-by-Side */}
            <div className="lp-signals-cards" style={{ gap: '1rem', marginTop: '2rem' }}>
              
              {/* Card 1: Academic Profile */}
              <div style={{ background: '#ffffff', padding: '1.25rem 1rem', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '6px', background: 'rgba(196, 151, 70, 0.12)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <User size={16} />
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                  Academic Profile
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#68736F', lineHeight: 1.45, margin: 0 }}>
                  Degrees, grades, credits, and language skills mapped directly to admission rules.
                </p>
              </div>

              {/* Card 2: Academic Performance */}
              <div style={{ background: '#ffffff', padding: '1.25rem 1rem', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '6px', background: 'rgba(196, 151, 70, 0.12)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <Sliders size={16} />
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                  Academic Performance
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#68736F', lineHeight: 1.45, margin: 0 }}>
                  Intake semester, degree level, target budget, and living cost priorities.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
