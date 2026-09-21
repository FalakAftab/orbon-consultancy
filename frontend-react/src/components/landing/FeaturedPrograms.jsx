import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Euro, ArrowRight } from 'lucide-react';
import { api } from '../../api/client';

export function FeaturedPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real programs from public catalog endpoint
    api('/programs?per_page=6')
      .then(res => {
        if (res && res.data) {
          setPrograms(res.data);
        } else if (Array.isArray(res)) {
          setPrograms(res.slice(0, 6));
        }
      })
      .catch(err => console.error("Failed to fetch programs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || programs.length === 0) return null;

  return (
    <section style={{ background: '#F8FAFC', padding: '5.5rem 0', borderTop: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: '#C49746', textTransform: 'uppercase', background: 'rgba(196,151,70,0.12)', padding: '0.35rem 0.85rem', borderRadius: '999px', display: 'inline-block', marginBottom: '0.85rem' }}>
              POPULAR
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.2rem, 3.4vw, 2.8rem)', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.15 }}>
              Featured Programs
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.975rem', lineHeight: 1.65, marginTop: '0.75rem', marginBottom: 0 }}>
              Discover highly sought-after degree programs from our verified catalog.
            </p>
          </div>

          <div>
            <Link to="/programs" style={{ color: '#C49746', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s ease, transform 0.2s ease' }}>
              View All Programs <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
          {programs.map((prog) => (
            <div
              key={prog.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#C49746';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.03)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {prog.degree_level || 'Program'}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: prog.language_of_instruction === 'English' ? '#059669' : '#0F172A', background: prog.language_of_instruction === 'English' ? '#D1FAE5' : '#F1F5F9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {prog.language_of_instruction || 'English/German'}
                </span>
              </div>

              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                {prog.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <BookOpen size={14} style={{ color: '#C49746' }} /> {prog.university?.name || 'Partner University'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: 'auto' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Tuition</span>
                  <div style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                    <Euro size={12} /> {prog.tuition_fee === 0 || prog.tuition_fee === null ? 'None (Public)' : prog.tuition_fee}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Location</span>
                  <div style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                    <MapPin size={12} /> {prog.university?.city || 'Germany'}
                  </div>
                </div>
              </div>

              <Link
                to={`/programs/${prog.id}`}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  background: '#0F172A',
                  color: '#ffffff',
                  textAlign: 'center',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'background 0.2s ease',
                }}
              >
                View Program <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
