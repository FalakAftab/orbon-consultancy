import { Link } from 'react-router-dom';
import { Building2, MapPin, GraduationCap, ArrowRight } from 'lucide-react';

const universities = [
  {
    name: 'Technical University of Munich (TUM)',
    location: 'Munich, Bavaria',
    description: "Germany's #1 technical university, globally renowned for Computer Science, Robotics, Automotive Engineering, and AI research.",
    photo: '/figma_assets/studypath-landing-page___Rectangle-1.png',
    tuition: '€0 / Semester (Public)',
  },
  {
    name: 'Heidelberg University',
    location: 'Heidelberg, Baden-Württemberg',
    description: "Germany's oldest university, world-celebrated for Medicine, Biotechnology, Data Science, and International Law.",
    photo: '/figma_assets/studypath-landing-page___Rectangle-2.png',
    tuition: '€0 / Semester (Public)',
  },
  {
    name: 'Humboldt University of Berlin (HU Berlin)',
    location: 'Berlin, Germany',
    description: "A world-famous center of academic excellence in humanities, artificial intelligence, public policy, and social sciences.",
    photo: '/figma_assets/studypath-landing-page___Rectangle-3.png',
    tuition: '€0 / Semester (Public)',
  },
];

export function Universities() {
  return (
    <section id="universities" style={{ background: '#FAF7F2', padding: '5.5rem 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#C49746', textTransform: 'uppercase', background: 'rgba(196,151,70,0.12)', padding: '0.35rem 0.85rem', borderRadius: '999px' }}>
            ACCREDITED PUBLIC INSTITUTIONS
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.2rem, 3.4vw, 2.8rem)', fontWeight: 700, color: '#161D2B', marginTop: '0.85rem', lineHeight: 1.15 }}>
            Explore Top-Ranked German Public Universities
          </h2>
          <p style={{ color: '#5B6578', fontSize: '0.975rem', lineHeight: 1.65, marginTop: '0.75rem' }}>
            Discover state-of-the-art research hubs offering globally recognized English-taught Bachelor's & Master's degrees with €0 tuition fees.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="lp-uni-grid" style={{ gap: '2rem' }}>
          {universities.map((uni) => (
            <div
              key={uni.name}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 200ms ease, boxShadow 200ms ease',
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={uni.photo}
                  alt={uni.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#0B3B36', color: '#FFD700', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.725rem', fontWeight: 700 }}>
                  {uni.tuition}
                </div>
              </div>

              <div style={{ padding: '1.75rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#C49746', marginBottom: '0.4rem' }}>
                  <MapPin size={14} /> {uni.location}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#161D2B', margin: 0, lineHeight: 1.25 }}>
                  {uni.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#5B6578', lineHeight: 1.6, marginTop: '0.85rem', flex: 1 }}>
                  {uni.description}
                </p>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <Link
                    to="/universities"
                    style={{ color: '#0B3B36', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    View Programs & Requirements <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
