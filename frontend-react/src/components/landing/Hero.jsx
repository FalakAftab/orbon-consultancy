import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DecorativeLineArt } from './DecorativeLineArt';

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
        
        {/* Left Column: Search Widget replacing the old hero copy */}
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

        {/* Right Column: User's original 9-Image University Collage Grid (3x3) */}
        <div
          className="lp-hero-collage-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.65rem',
            width: '100%',
          }}
        >
          {/* Row 1 */}
          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/images/universities/uni-wuerzburg-1.jpg"
              alt="German University Palace Gardens"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/library-interior.jpg"
              alt="Academic Library"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-4.png"
              alt="Historic University Neoclassical Facade"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Row 2 */}
          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/images/universities/campus-tum.jpg"
              alt="Technical University of Munich Campus & Alps"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/images/universities/uni-wuerzburg-2.png"
              alt="German University Historic Palace"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-2.png"
              alt="Modern University Campus Library & Students"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Row 3 */}
          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-3.png"
              alt="Historic University Courtyard & Students"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/hero-university.jpg"
              alt="Historic German University Architecture & Students"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: 'var(--lp-card)' }}>
            <img
              src="/images/universities/uni-wuerzburg-3.png"
              alt="University Palace in Autumn"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
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
