import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DecorativeLineArt } from './DecorativeLineArt';

// High-Speed Compressed CDN Images (Ultra-fast loading < 30KB per image)
const HERO_GRID_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=70",
    alt: "German University Palace Gardens"
  },
  {
    src: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=70",
    alt: "Academic Library Interior"
  },
  {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=70",
    alt: "Historic University Neoclassical Building"
  },
  {
    src: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=400&q=70",
    alt: "Technical University Campus"
  },
  {
    src: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=400&q=70",
    alt: "German Historic University Facade"
  },
  {
    src: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=400&q=70",
    alt: "Modern Campus Library & Students"
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=70",
    alt: "University Courtyard"
  },
  {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=70",
    alt: "German University Architecture"
  },
  {
    src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=70",
    alt: "University Campus in Autumn"
  }
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
        
        {/* Left Column: Search Widget */}
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

        {/* Right Column: Instant High-Speed 3x3 Image Grid */}
        <div
          className="lp-hero-collage-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.65rem',
            width: '100%',
          }}
        >
          {HERO_GRID_IMAGES.map((img, idx) => (
            <div 
              key={idx} 
              style={{ 
                height: '138px', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.07)', 
                background: 'var(--lp-card, #e2e8f0)' 
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="eager"
                fetchpriority="high"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=70";
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