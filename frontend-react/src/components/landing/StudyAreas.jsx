import { Link } from 'react-router-dom';
import { Monitor, Cpu, Briefcase, TestTube, Stethoscope, Building, Scale, Film, Users, ArrowRight } from 'lucide-react';

const AREAS = [
  { name: 'Computer Science & IT', icon: Monitor, href: '/programs?subject=Computer Science' },
  { name: 'Engineering', icon: Cpu, href: '/programs?subject=Engineering' },
  { name: 'Business & Economics', icon: Briefcase, href: '/programs?subject=Business' },
  { name: 'Natural Sciences', icon: TestTube, href: '/programs?subject=Natural Sciences' },
  { name: 'Medicine & Health', icon: Stethoscope, href: '/programs?subject=Medicine' },
  { name: 'Architecture & Design', icon: Building, href: '/programs?subject=Architecture' },
  { name: 'Law', icon: Scale, href: '/programs?subject=Law' },
  { name: 'Media & Communication', icon: Film, href: '/programs?subject=Media' },
  { name: 'Social Sciences', icon: Users, href: '/programs?subject=Social Sciences' },
];

export function StudyAreas() {
  return (
    <section style={{ background: '#FFFFFF', padding: '5.5rem 0', borderTop: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.15 }}>
            Explore by Study Area
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.975rem', lineHeight: 1.65, marginTop: '0.75rem', maxWidth: '600px', margin: '0.75rem auto 0' }}>
            Find specialized programs across Germany's most renowned academic disciplines.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {AREAS.map((area) => {
            const Icon = area.icon;
            return (
              <Link
                key={area.name}
                to={area.href}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textDecoration: 'none',
                  color: '#0F172A',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 23, 42, 0.05)';
                  e.currentTarget.style.borderColor = '#C49746';
                  e.currentTarget.querySelector('.area-icon').style.background = '#0F172A';
                  e.currentTarget.querySelector('.area-icon').style.color = '#FFFFFF';
                  e.currentTarget.querySelector('.area-arrow').style.transform = 'translateX(4px)';
                  e.currentTarget.querySelector('.area-arrow').style.color = '#C49746';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.querySelector('.area-icon').style.background = '#FFFFFF';
                  e.currentTarget.querySelector('.area-icon').style.color = '#C49746';
                  e.currentTarget.querySelector('.area-arrow').style.transform = 'none';
                  e.currentTarget.querySelector('.area-arrow').style.color = '#94A3B8';
                }}
              >
                <div 
                  className="area-icon"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C49746',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={20} />
                </div>
                
                <div style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                  {area.name}
                </div>
                
                <ArrowRight className="area-arrow" size={16} color="#94A3B8" style={{ transition: 'all 0.2s ease' }} />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
