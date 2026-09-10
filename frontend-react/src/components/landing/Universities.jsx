import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, ArrowRight, ChevronDown, CheckCircle2, Award, BookOpen, Sparkles } from 'lucide-react';

const universities = [
  {
    rank: '#1',
    name: 'Ludwig-Maximilians-Universität München',
    location: 'Munich, Germany',
    description: "Germany's top-ranked public research university, globally celebrated for Computer Science, Business Administration, Medicine, and AI research.",
    photo: '/figma_assets/studypath-landing-page___Rectangle-1.png',
    tuition: '€0 / Semester (Public)',
    tags: ['Computer Science', 'Business', 'Engineering'],
    intake: 'Winter & Summer',
    language: 'English & German',
    degree: 'B.Sc & M.Sc Programs',
    highlights: 'Top 30 Worldwide • 0 Tuition Fee • Munich Tech Hub Access',
  },
  {
    rank: '#2',
    name: 'Technical University of Munich',
    location: 'Munich, Germany',
    description: "Germany's #1 technical university, world-famous for Automotive Engineering, Robotics, Artificial Intelligence, and Data Science.",
    photo: '/figma_assets/studypath-landing-page___Rectangle-2.png',
    tuition: '€0 / Semester (Public)',
    tags: ['Engineering', 'Computer Science', 'Natural Sciences'],
    intake: 'Winter Intake',
    language: '100% English Options',
    degree: 'Master of Science',
    highlights: 'Excellence University • BMW & Siemens Industry Links • AI Labs',
  },
  {
    rank: '#3',
    name: 'Humboldt-Universität zu Berlin',
    location: 'Berlin, Germany',
    description: "A world-celebrated center of academic excellence in Humanities, Social Sciences, Artificial Intelligence, and International Policy.",
    photo: '/figma_assets/studypath-landing-page___Rectangle-3.png',
    tuition: '€0 / Semester (Public)',
    tags: ['Humanities', 'Social Sciences', 'Natural Sciences'],
    intake: 'Winter & Summer',
    language: 'English-taught Masters',
    degree: 'B.A. & M.A. Programs',
    highlights: '29 Nobel Laureates • Capital City Campus • Historic Reputation',
  },
];

export function Universities() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const sectionRef = useRef(null);

  // Close expanded view when clicking outside the universities section
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setExpandedIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCard = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="universities"
      ref={sectionRef}
      style={{
        background: '#FAF7F2',
        padding: '5.5rem 0',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#C49746',
                textTransform: 'uppercase',
                background: 'rgba(196,151,70,0.12)',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                display: 'inline-block',
                marginBottom: '0.85rem',
              }}
            >
              EXPLORE
            </span>
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(2.2rem, 3.4vw, 2.8rem)',
                fontWeight: 700,
                color: '#161D2B',
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Top Ranked Public Universities
            </h2>
            <p
              style={{
                color: '#5B6578',
                fontSize: '0.975rem',
                lineHeight: 1.65,
                marginTop: '0.75rem',
                marginBottom: 0,
              }}
            >
              Discover world-class education at Germany's leading public universities.
            </p>
          </div>

          <div>
            <Link
              to="/student/universities"
              style={{
                color: '#C49746',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 0.2s ease, transform 0.2s ease',
              }}
            >
              View All Universities <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 3 Interactive Cards Grid */}
        <div className="lp-uni-grid" style={{ gap: '2rem' }}>
          {universities.map((uni, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={uni.name}
                className="lp-uni-interactive-card"
                onClick={() => toggleCard(idx)}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: isExpanded
                    ? '2px solid #C49746'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: isExpanded
                    ? '0 16px 36px rgba(196, 151, 70, 0.18)'
                    : '0 8px 24px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 300ms ease',
                  position: 'relative',
                }}
              >
                {/* Photo Top Header */}
                <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={uni.photo}
                    alt={uni.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 500ms ease',
                      transform: isExpanded ? 'scale(1.04)' : 'scale(1)',
                    }}
                  />

                  {/* Rank Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: '#C49746',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 12px rgba(196, 151, 70, 0.4)',
                    }}
                  >
                    {uni.rank}
                  </div>

                  {/* Expand Chevron Icon Button */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: isExpanded ? '#161D2B' : 'rgba(255, 255, 255, 0.9)',
                      color: isExpanded ? '#FFD700' : '#161D2B',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'all 300ms ease',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* Always Visible Card Body */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                    {/* Crest Emblem Circle Icon */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#FAF7F2',
                        border: '1px solid rgba(196, 151, 70, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#C49746',
                        flexShrink: 0,
                      }}
                    >
                      <GraduationCap size={18} />
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontSize: '1.125rem',
                          fontWeight: 700,
                          color: '#161D2B',
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {uni.name}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.78rem',
                          color: '#718096',
                          marginTop: '0.2rem',
                        }}
                      >
                        <MapPin size={12} style={{ color: '#C49746' }} /> {uni.location}
                      </div>
                    </div>
                  </div>

                  {/* Subject Tags Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.85rem' }}>
                    {uni.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          color: '#4A5568',
                          background: '#F7FAFC',
                          border: '1px solid #E2E8F0',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Initial Bottom Action Bar */}
                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        color: '#C49746',
                        fontWeight: 700,
                        fontSize: '0.825rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {isExpanded ? 'Hide Details' : 'View Programs'} <ArrowRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#A0AEC0', fontWeight: 600 }}>
                      {uni.tuition.split(' ')[0]} Tuition
                    </span>
                  </div>

                  {/* Top-to-Bottom Slide Down Reveal Panel */}
                  <div className={`lp-uni-reveal-wrapper ${isExpanded ? 'expanded' : ''}`}>
                    <div className="lp-uni-reveal-inner">
                      <div
                        style={{
                          marginTop: '1.25rem',
                          paddingTop: '1.25rem',
                          borderTop: '1.5px dashed rgba(196, 151, 70, 0.3)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        }}
                      >
                        <p style={{ fontSize: '0.85rem', color: '#5B6578', lineHeight: 1.6, margin: 0 }}>
                          {uni.description}
                        </p>

                        {/* Extended Details Grid */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.65rem',
                            background: '#FAF7F2',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(0,0,0,0.05)',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#A0AEC0', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Tuition Fee
                            </span>
                            <strong style={{ fontSize: '0.8rem', color: '#161D2B' }}>{uni.tuition}</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#A0AEC0', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Degree Types
                            </span>
                            <strong style={{ fontSize: '0.8rem', color: '#161D2B' }}>{uni.degree}</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#A0AEC0', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Intake Period
                            </span>
                            <strong style={{ fontSize: '0.8rem', color: '#161D2B' }}>{uni.intake}</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#A0AEC0', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Language
                            </span>
                            <strong style={{ fontSize: '0.8rem', color: '#161D2B' }}>{uni.language}</strong>
                          </div>
                        </div>

                        {/* Key Strengths */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#0B3B36', fontWeight: 600 }}>
                          <Sparkles size={14} style={{ color: '#C49746' }} />
                          <span>{uni.highlights}</span>
                        </div>

                        {/* Direct CTA Button */}
                        <Link
                          to="/register"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            background: '#161D2B',
                            color: '#ffffff',
                            padding: '0.65rem 1.1rem',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.825rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 4px 12px rgba(22, 29, 43, 0.25)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          View Programs & Requirements <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Universities;
