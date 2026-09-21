import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, GraduationCap, CheckCircle2, ArrowRight, ShieldCheck, Zap, Search, Globe2, Building2 } from 'lucide-react';

export function AnimatedHero() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [degree, setDegree] = useState('master');
  const [subject, setSubject] = useState('');
  const [city, setCity] = useState('');

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMousePos({
      x: ((clientX - centerX) / centerX) * 15,
      y: ((clientY - centerY) / centerY) * 15,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (degree) params.set('degree_level', degree);
    if (subject) params.set('search', subject);
    if (city) params.set('city', city);
    navigate(`/programs?${params.toString()}`);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #070D1B 0%, #0F172A 50%, #161D2B 100%)',
        color: '#FFFFFF',
        padding: '5rem 0 6rem',
        overflow: 'hidden',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Dynamic Keyframes Injection */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(-3deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>

      {/* Background Ambient Glowing Orbs & Mesh */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(196,151,70,0.25) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulseGlow 8s infinite ease-in-out',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'pulseGlow 10s infinite ease-in-out 2s',
          pointerEvents: 'none',
        }}
      />

      <div
        className="lp-animated-hero-grid"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.5rem',
          width: '100%',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left Column: Heading, Badges, Search & Actions */}
        <div>
          {/* Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(196, 151, 70, 0.12)',
              border: '1px solid rgba(196, 151, 70, 0.4)',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              backdropFilter: 'blur(10px)',
              marginBottom: '1.75rem',
            }}
          >
            <Sparkles size={16} style={{ color: '#C49746' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E5C07B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Next-Gen Germany Study Recommender
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.8rem, 4.5vw, 4.2rem)',
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Unlock Your Admission in{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FCD34D 0%, #C49746 50%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontStyle: 'italic',
              }}
            >
              Germany
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#94A3B8',
              marginTop: '1.5rem',
              lineHeight: 1.7,
              maxWidth: '540px',
            }}
          >
            AI-driven eligibility matching across 2,000+ German public programs. Search, get instant recommendations, or let our expert team submit unlimited applications for you.
          </p>

          {/* Quick Filter Form */}
          <form
            onSubmit={handleSearch}
            className="lp-animated-search-form"
            style={{
              marginTop: '2.5rem',
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(16px)',
              padding: '1.25rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              gap: '0.75rem',
            }}
          >
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>
                DEGREE
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', outline: 'none', cursor: 'pointer', marginTop: '0.2rem' }}
              >
                <option value="master" style={{ background: '#0F172A', color: '#FFF' }}>Master's ▾</option>
                <option value="bachelor" style={{ background: '#0F172A', color: '#FFF' }}>Bachelor's ▾</option>
                <option value="phd" style={{ background: '#0F172A', color: '#FFF' }}>PhD ▾</option>
              </select>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>
                FIELD
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', outline: 'none', cursor: 'pointer', marginTop: '0.2rem' }}
              >
                <option value="" style={{ background: '#0F172A', color: '#FFF' }}>All Fields ▾</option>
                <option value="computer science" style={{ background: '#0F172A', color: '#FFF' }}>Computer Science</option>
                <option value="engineering" style={{ background: '#0F172A', color: '#FFF' }}>Engineering</option>
                <option value="business" style={{ background: '#0F172A', color: '#FFF' }}>Business</option>
              </select>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>
                LOCATION
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', outline: 'none', cursor: 'pointer', marginTop: '0.2rem' }}
              >
                <option value="" style={{ background: '#0F172A', color: '#FFF' }}>All Cities ▾</option>
                <option value="Munich" style={{ background: '#0F172A', color: '#FFF' }}>Munich</option>
                <option value="Berlin" style={{ background: '#0F172A', color: '#FFF' }}>Berlin</option>
                <option value="Heidelberg" style={{ background: '#0F172A', color: '#FFF' }}>Heidelberg</option>
              </select>
            </div>

            <div className="lp-animated-btn-group" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #C49746 0%, #D4AF37 100%)',
                  color: '#070D1B',
                  border: 'none',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 10px 25px rgba(196,151,70,0.35)',
                  transition: 'all 200ms ease',
                }}
              >
                <Search size={18} />
                <span>Search Programs</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/student/apply-for-me')}
                style={{
                  flex: 1,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 200ms ease',
                }}
              >
                <Zap size={18} style={{ color: '#34D399' }} />
                <span>Apply For Me (Unlimited)</span>
              </button>
            </div>
          </form>

          {/* Quick Stats Badges */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={20} style={{ color: '#C49746' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>400+</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Public German Unis</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe2 size={20} style={{ color: '#34D399' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>0€ Tuition</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Tuition-Free Options</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Animated Floating Visual Display */}
        <div
          style={{
            position: 'relative',
            perspective: '1000px',
            transform: `rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.1, 1, 0.1, 1)',
          }}
        >
          {/* Main 3D Card Showcase */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95))',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '2rem',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header of Visual Showcase Card */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em' }}>
                AI ADMISSION MATCH ENGINE
              </span>
            </div>

            {/* Simulated Live Admission Match Result Card */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 700, letterSpacing: '0.05em' }}>
                    HIGH ADMISSION PROBABILITY (98%)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>
                    TU Munich — M.Sc. Data Engineering
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                    Language: English • Tuition: 0€/sem • ECTS Match: 100%
                  </div>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} style={{ color: '#34D399' }} />
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#FCD34D', fontWeight: 700, letterSpacing: '0.05em' }}>
                    MATCHED ADMISSION (92%)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>
                    RWTH Aachen — M.Sc. Software Systems
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                    Language: English • Tuition: 0€/sem • VPD Ready
                  </div>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(252,211,77,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} style={{ color: '#FCD34D' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(user ? '/student/wizard' : '/check-eligibility')}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                padding: '0.75rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Test Your Eligibility Match</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Floating Badge 1: 3D Germany Flag Shield */}
          <div
            style={{
              position: 'absolute',
              top: '-25px',
              right: '-20px',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(196,151,70,0.5)',
              borderRadius: '16px',
              padding: '0.75rem 1.25rem',
              boxShadow: '0 20px 30px rgba(0,0,0,0.5), 0 0 20px rgba(196,151,70,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              animation: 'floatSlow 6s ease-in-out infinite',
              zIndex: 3,
            }}
          >
            <div style={{ fontSize: '1.6rem' }}>🇩🇪</div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#E5C07B', fontWeight: 700, textTransform: 'uppercase' }}>GERMANY APPROVED</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>0€ Tuition Unis</div>
            </div>
          </div>

          {/* Floating Badge 2: 3D Graduation Cap */}
          <div
            style={{
              position: 'absolute',
              bottom: '-25px',
              left: '-25px',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(16,185,129,0.5)',
              borderRadius: '16px',
              padding: '0.75rem 1.25rem',
              boxShadow: '0 20px 30px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              animation: 'floatReverse 7s ease-in-out infinite',
              zIndex: 3,
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} style={{ color: '#34D399' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>APPLY FOR ME</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Unlimited Applications</div>
            </div>
          </div>

          {/* Floating Badge 3: 3D Fast Track VPD Verification */}
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: '-35px',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '14px',
              padding: '0.6rem 1rem',
              boxShadow: '0 15px 25px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              animation: 'floatSlow 8s ease-in-out infinite 1s',
              zIndex: 3,
            }}
          >
            <ShieldCheck size={18} style={{ color: '#38BDF8' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0' }}>VPD & Uni-Assist Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
