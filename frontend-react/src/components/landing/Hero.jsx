import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// High-speed reliable royalty-free CDN images (Fast < 30KB)
const HERO_GRID_IMAGES = [
  "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&w=400"
];

export function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/programs?search=${encodeURIComponent(searchQuery)}`);
  };

  const quickLinks = [
    { label: 'Computer Science', href: '/programs?subject=Computer Science' },
    { label: 'Engineering', href: '/programs?subject=Engineering' },
    { label: 'Business', href: '/programs?subject=Business' },
    { label: 'Data Science', href: '/programs?subject=Data Science' },
    { label: 'Architecture', href: '/programs?subject=Architecture' }
  ];

  const eligibilityPath = user ? (user.role === 'admin' ? '/admin/students/wizard' : '/student/wizard') : '/check-eligibility';

  return (
    <section className="lp-home-hero" style={{ background: 'var(--lp-bg)', padding: '5rem 0 7rem', position: 'relative', overflow: 'hidden' }}>
      <div className="lp-home-hero-inner" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Left Column */}
        <div className="lp-home-hero-copy" style={{ zIndex: 10 }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--lp-gold)', fontWeight: 700, marginBottom: '1.25rem' }}>
            Study in Germany
          </div>
          
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--lp-foreground)', margin: 0 }}>
            Find the right<br />study program<br />in Germany.
          </h1>

          <p className="lp-home-hero-description" style={{ fontSize: '1.05rem', color: 'var(--lp-muted-fg)', marginTop: '1.5rem', lineHeight: 1.6, maxWidth: '500px' }}>
            Explore universities and programs, compare your options, and get guidance when you're ready to take the next step.
          </p>

          <div className="lp-home-hero-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <Link to="/programs" className="lp-hero-btn-primary">
              Explore Programs
            </Link>
            <Link to={eligibilityPath} className="lp-hero-btn-outline">
              Check My Eligibility
            </Link>
          </div>

          <form className="lp-home-hero-search" onSubmit={handleSearch} style={{ marginTop: '3rem', position: 'relative', maxWidth: '500px' }}>
            <div className="lp-home-hero-search-row" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '1rem' }} />
              <input 
                type="text" 
                placeholder="Search programs, universities or subjects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)', transition: 'border-color 0.2s', background: '#FFFFFF' }}
              />
              <button type="submit" className="lp-hero-btn-primary lp-home-hero-search-button" style={{ position: 'absolute', right: '0.5rem', padding: '0.75rem 1.25rem' }}>
                Search
              </button>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--lp-muted-fg)' }}>Popular:</span>
              {quickLinks.map(link => (
                <Link key={link.label} to={link.href} className="lp-popular-tag">
                  {link.label}
                </Link>
              ))}
            </div>
          </form>
        </div>

        {/* Right Column: 3x3 Image Grid with Reliable Fallbacks */}
        <div
          className="lp-hero-collage-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.65rem',
            width: '100%',
          }}
        >
          {HERO_GRID_IMAGES.map((imgSrc, idx) => (
            <div 
              key={idx} 
              style={{ 
                height: '138px', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.07)', 
                background: '#0F172A',
                position: 'relative'
              }}
            >
              <img
                src={imgSrc}
                alt="German University Campus"
                loading="eager"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)';
                }}
              />
            </div>
          ))}
        </div>
        
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1023px) {
          .lp-hero-grid-shell { grid-template-columns: 1fr !important; text-align: center; }
          .lp-hero-search-form { margin-left: auto; margin-right: auto; }
        }
      `}} />
    </section>
  );
}