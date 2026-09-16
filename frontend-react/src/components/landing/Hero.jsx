import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();
  const [degree, setDegree] = useState('master');
  const [subject, setSubject] = useState('');
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState('english');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (degree) params.set('degree_level', degree);
    if (subject) params.set('search', subject);
    if (city) params.set('city', city);
    if (language) params.set('language_of_instruction', language);
    navigate(`/programs?${params.toString()}`);
  };

  return (
    <section
      style={{
        background: '#FAF7F2',
        padding: '3.5rem 0 5rem',
        overflow: 'hidden',
      }}
    >
      <div
        className="lp-hero-grid-shell"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.5rem',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Editorial Heading & Integrated Search Widget */}
        <div>
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2.2rem, 4.2vw, 3.6rem)',
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: '#161D2B',
              margin: 0,
            }}
          >
            Find the right<br />
            German university<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#C49746' }}>
              for you.
            </span>
          </h1>

          <p
            style={{
              fontSize: '0.975rem',
              color: '#5B6578',
              marginTop: '1.5rem',
              lineHeight: 1.65,
              maxWidth: '480px',
            }}
          >
            Browse instructions by city and academic field, then see which of their programs actually align with your academic profile - not guesswork.
          </p>

          {/* Quick Filter Search Bar */}
          <form
            onSubmit={handleSearch}
            className="lp-hero-search-form"
            style={{
              marginTop: '2.25rem',
              background: '#EDE8DF',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              gap: '0.85rem',
            }}
          >
            <div style={{ background: '#FAF7F2', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#718096', textTransform: 'uppercase' }}>
                DEGREE LEVEL
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#161D2B', outline: 'none', cursor: 'pointer', marginTop: '0.1rem' }}
              >
                <option value="master">Master's ▾</option>
                <option value="bachelor">Bachelor's ▾</option>
                <option value="phd">PhD ▾</option>
              </select>
            </div>

            <div style={{ background: '#FAF7F2', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#718096', textTransform: 'uppercase' }}>
                SUBJECT AREA
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#161D2B', outline: 'none', cursor: 'pointer', marginTop: '0.1rem' }}
              >
                <option value="">Any Field ▾</option>
                <option value="computer science">Computer Science</option>
                <option value="engineering">Engineering</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div style={{ background: '#FAF7F2', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#718096', textTransform: 'uppercase' }}>
                LOCATION
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#161D2B', outline: 'none', cursor: 'pointer', marginTop: '0.1rem' }}
              >
                <option value="">All Cities ▾</option>
                <option value="Munich">Munich</option>
                <option value="Berlin">Berlin</option>
                <option value="Heidelberg">Heidelberg</option>
              </select>
            </div>

            <div style={{ background: '#FAF7F2', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#718096', textTransform: 'uppercase' }}>
                LANGUAGE
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#161D2B', outline: 'none', cursor: 'pointer', marginTop: '0.1rem' }}
              >
                <option value="english">English ▾</option>
                <option value="german">German ▾</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#C49746',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'background 150ms ease',
                }}
              >
                Find Programs +
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: 9-Image University Collage Grid (3x3) - Completely Static */}
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
          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/images/universities/uni-wuerzburg-1.jpg"
              alt="German University Palace Gardens"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/library-interior.jpg"
              alt="Academic Library"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-4.png"
              alt="Historic University Neoclassical Facade"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Row 2 */}
          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/images/universities/campus-tum.jpg"
              alt="Technical University of Munich Campus & Alps"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/images/universities/uni-wuerzburg-2.png"
              alt="German University Historic Palace"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-2.png"
              alt="Modern University Campus Library & Students"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Row 3 */}
          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-3.png"
              alt="Historic University Courtyard & Students"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/hero-university.jpg"
              alt="Historic German University Architecture & Students"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ height: '138px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#FAF7F2' }}>
            <img
              src="/images/universities/uni-wuerzburg-3.png"
              alt="University Palace in Autumn"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
