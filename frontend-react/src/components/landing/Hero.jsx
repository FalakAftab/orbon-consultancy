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
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.05fr)',
          gap: '3.5rem',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Editorial Heading & Integrated Search Widget */}
        <div>
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2.6rem, 4.2vw, 3.6rem)',
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
            style={{
              marginTop: '2.25rem',
              background: '#EDE8DF',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
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

        {/* Right Column: 6-Image Grid Collage Exactly Aligned as in Mockup Screenshot */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
          {/* Top Row: 3 Cards */}
          <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-4.png"
              alt="Lab & Research"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img
              src="/library-interior.jpg"
              alt="Modern Academic Library"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-6.png"
              alt="Microscope Research"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Bottom Row: 3 Cards */}
          <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-7.png"
              alt="Circuit Board Tech"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img
              src="/figma_assets/studypath-landing-page___Rectangle-8.png"
              alt="Digital Tech Network"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img
              src="/academic-world.jpg"
              alt="Grand Historic Lecture Hall"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
