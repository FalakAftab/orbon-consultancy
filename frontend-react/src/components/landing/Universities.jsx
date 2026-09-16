import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, ArrowRight, ChevronDown, CheckCircle2, Award, BookOpen, Sparkles } from 'lucide-react';

const universities = [
  {
    rank: '#1',
    name: 'Ludwig-Maximilians-Universität München',
    location: 'Munich, Germany',
    description: "Germany's top-ranked public research university, globally celebrated for Computer Science, Business Administration, Medicine, and AI research.",
    photo: '/images/universities/campus-lmu.jpg',
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
    photo: '/images/universities/campus-tum.jpg',
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
    photo: '/images/universities/campus-humboldt.jpg',
    tuition: '€0 / Semester (Public)',
    tags: ['Humanities', 'Social Sciences', 'Natural Sciences'],
    intake: 'Winter & Summer',
    language: 'English-taught Masters',
    degree: 'B.A. & M.A. Programs',
    highlights: '29 Nobel Laureates • Capital City Campus • Historic Reputation',
  },
  {
    rank: '#4',
    name: 'RWTH Aachen University',
    location: 'Aachen, Germany',
    description: "The largest technical university in Germany, renowned for Mechanical Engineering, Sustainable Energy, and cutting-edge research facilities.",
    photo: '/images/universities/campus-rwth.jpg',
    tuition: '€0 / Semester (Public)',
    tags: ['Mechanical Eng.', 'Physics', 'Sustainable Energy'],
    intake: 'Winter & Summer',
    language: 'English & German',
    degree: 'Master of Science',
    highlights: 'Top Engineering Hub • Leading Tech Labs • European Network',
  },
  {
    rank: '#5',
    name: 'Heidelberg University',
    location: 'Heidelberg, Germany',
    description: "Germany's oldest university, a leading institution in Life Sciences, Medicine, and classical Humanities with a breathtaking historic campus.",
    photo: '/images/universities/campus-heidelberg.jpg',
    tuition: '€1,500 / Semester (Intl)',
    tags: ['Medicine', 'Life Sciences', 'Law'],
    intake: 'Winter Intake',
    language: 'English-taught Programs',
    degree: 'B.A. & M.A. Programs',
    highlights: 'Oldest University • Top Medical Research • Historic City',
  },
  {
    rank: '#6',
    name: 'Freie Universität Berlin',
    location: 'Berlin, Germany',
    description: "A premier excellence university in Germany known for Political Science, International Relations, and extensive global partnership networks.",
    photo: '/images/universities/campus-fu.jpg',
    tuition: '€0 / Semester (Public)',
    tags: ['Political Science', 'Global Studies', 'Arts'],
    intake: 'Winter & Summer',
    language: 'English Options',
    degree: 'B.Sc & M.Sc Programs',
    highlights: 'International Campus • Political Hub • Leading Research',
  },
];

export function Universities() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

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

  // Auto-scroll logic (Infinite loop)
  useEffect(() => {
    if (isHovered || expandedIndex !== null) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const cardWidth = 412; // 380px + 32px gap
        
        // Scroll to next card
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });

        // Check if we need to reset back to start for infinite effect
        // We do this after the scroll animation finishes
        setTimeout(() => {
          if (container) {
             // If we reached the end of the original list length in the duplicated array
             const originalMaxScroll = universities.length * cardWidth;
             if (container.scrollLeft >= originalMaxScroll) {
               // Instantly jump back to the exact same visual position in the first set
               container.scrollBy({ left: -originalMaxScroll, behavior: 'instant' });
             }
          }
        }, 600); // slightly longer than typical smooth scroll duration
      }
    }, 2500); // Non-stop but readable

    return () => clearInterval(interval);
  }, [isHovered, expandedIndex]);

  const handleScroll = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const cardWidth = 412;
      let newIndex = Math.round(container.scrollLeft / cardWidth);
      
      // Normalize index for the dots
      newIndex = newIndex % universities.length;
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const scrollToCard = (index) => {
    if (carouselRef.current) {
      const cardWidth = 412;
      // Scroll to the exact index in the first set
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const toggleCard = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="universities"
      ref={sectionRef}
      style={{
        background: '#FFFFFF',
        padding: '5.5rem 0',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
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

        {/* Carousel Grid Container */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          style={{ position: 'relative' }}
        >
          {/* Carousel Grid */}
          <div 
            ref={carouselRef}
            className="lp-uni-grid" 
            onScroll={handleScroll}
            style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              gap: '2rem',
              overflowX: 'auto',
              paddingBottom: '2rem',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none' // IE/Edge
            }}
          >
            <style>{`
              .lp-uni-grid::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {/* Duplicate the array 3 times for a seamless infinite loop */}
            {[...universities, ...universities, ...universities].map((uni, index) => {
              // The expandedIndex logic only works for the first set, or we can map it by modulo
              const originalIdx = index % universities.length;
              const isExpanded = expandedIndex === originalIdx;

              return (
                <div
                  key={`${uni.name}-${index}`}
                  className="lp-uni-interactive-card"
                  onClick={() => toggleCard(originalIdx)}
                  style={{
                    minWidth: '380px',
                    maxWidth: '380px',
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
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
                    position: 'relative',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Photo Top Header */}
                  <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={uni.photo}
                      alt={uni.name}
                      className="lp-uni-card-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: isExpanded ? 'scale(1.06)' : undefined,
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#0F172A', fontWeight: 600 }}>
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

          {/* Navigation Bars/Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1.5rem',
          }}>
            {universities.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => scrollToCard(idx)}
                style={{
                  width: activeIndex === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: activeIndex === idx ? '#C49746' : 'rgba(196, 151, 70, 0.25)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 300ms ease',
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Universities;
