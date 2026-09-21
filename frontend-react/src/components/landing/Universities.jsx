import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, ArrowRight, ChevronDown } from 'lucide-react';
import { api } from '../../api/client';

// Ultra-fast CDN German University Stock Images (Optimized 600px width for fast loading)
const RANDOM_UNI_IMAGES = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=600&q=75'
];

export function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Fetch real universities from public catalog endpoint
    api('/universities?per_page=6')
      .then(res => {
        if (res && res.data) {
          setUniversities(res.data);
        } else if (Array.isArray(res)) {
          setUniversities(res.slice(0, 6));
        }
      })
      .catch(err => console.error("Failed to fetch universities:", err))
      .finally(() => setLoading(false));
  }, []);

  // Close expanded view when clicking outside
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
    if (isHovered || expandedIndex !== null || universities.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const cardWidth = 412; // 380px + 32px gap
        
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });

        setTimeout(() => {
          if (container) {
             const originalMaxScroll = universities.length * cardWidth;
             if (container.scrollLeft >= originalMaxScroll) {
               container.scrollBy({ left: -originalMaxScroll, behavior: 'instant' });
             }
          }
        }, 600);
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [isHovered, expandedIndex, universities]);

  const handleScroll = () => {
    if (carouselRef.current && universities.length > 0) {
      const container = carouselRef.current;
      const cardWidth = 412;
      let newIndex = Math.round(container.scrollLeft / cardWidth);
      newIndex = newIndex % universities.length;
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const scrollToCard = (index) => {
    if (carouselRef.current) {
      const cardWidth = 412;
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const toggleCard = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // Helper to extract image URL safely or return dynamic fallback image
  const getUniversityImage = (uni, idx) => {
    const dbImg = uni.image_url || uni.logo_url || uni.cover_image || uni.image || uni.banner;
    if (dbImg && dbImg.trim() !== '') return dbImg;
    return RANDOM_UNI_IMAGES[idx % RANDOM_UNI_IMAGES.length];
  };

  if (loading || universities.length === 0) return null;

  return (
    <section
      id="universities"
      ref={sectionRef}
      style={{
        background: 'var(--lp-bg)',
        padding: '5.5rem 0',
        borderTop: '1px solid var(--lp-border)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--lp-gold)', textTransform: 'uppercase', background: 'var(--lp-secondary)', padding: '0.35rem 0.85rem', borderRadius: '999px', display: 'inline-block', marginBottom: '0.85rem' }}>
              EXPLORE
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.2rem, 3.4vw, 2.8rem)', fontWeight: 700, color: 'var(--lp-foreground)', margin: 0, lineHeight: 1.15 }}>
              Explore German Universities
            </h2>
            <p style={{ color: 'var(--lp-muted-fg)', fontSize: '0.975rem', lineHeight: 1.65, marginTop: '0.75rem', marginBottom: 0 }}>
              Discover world-class education and research opportunities at leading public universities across Germany.
            </p>
          </div>

          <div>
            <Link to="/universities" style={{ color: 'var(--lp-gold)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s ease, transform 0.2s ease' }}>
              View All Universities <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          style={{ position: 'relative' }}
        >
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
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <style>{`
              .lp-uni-grid::-webkit-scrollbar { display: none; }
            `}</style>
            
            {/* Infinite Loop Array */}
            {[...universities, ...universities, ...universities].map((uni, index) => {
              const originalIdx = index % universities.length;
              const isExpanded = expandedIndex === originalIdx;
              const photoUrl = getUniversityImage(uni, originalIdx);

              return (
                <div
                  key={`${uni.id || uni.name}-${index}`}
                  onClick={() => toggleCard(originalIdx)}
                  style={{
                    minWidth: '380px',
                    maxWidth: '380px',
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                    background: 'var(--lp-card)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: isExpanded ? '2px solid var(--lp-gold)' : '1px solid var(--lp-border)',
                    boxShadow: isExpanded ? '0 16px 36px rgba(199, 164, 91, 0.15)' : '0 4px 12px rgba(20, 69, 63, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ height: '190px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--lp-secondary)' }}>
                    <img
                      src={photoUrl}
                      alt={uni.name}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        transform: isExpanded ? 'scale(1.06)' : 'scale(1)',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = RANDOM_UNI_IMAGES[originalIdx % RANDOM_UNI_IMAGES.length];
                      }}
                    />

                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '34px', height: '34px', borderRadius: '50%', background: isExpanded ? 'var(--lp-forest)' : 'rgba(255, 255, 255, 0.9)', color: isExpanded ? 'var(--lp-forest-fg)' : 'var(--lp-foreground)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 300ms ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown size={18} />
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--lp-surface)', border: '1px solid var(--lp-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-gold)', flexShrink: 0 }}>
                        <GraduationCap size={18} />
                      </div>

                      <div>
                        <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.125rem', fontWeight: 700, color: 'var(--lp-foreground)', margin: 0, lineHeight: 1.25 }}>
                          {uni.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--lp-muted-fg)', marginTop: '0.2rem' }}>
                          <MapPin size={12} style={{ color: 'var(--lp-gold)' }} /> {uni.city || uni.state || 'Germany'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.85rem' }}>
                      <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--lp-foreground)', background: 'var(--lp-secondary)', border: '1px solid var(--lp-border)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                        {uni.type || 'Public University'}
                      </span>
                    </div>

                    <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--lp-gold)', fontWeight: 700, fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        {isExpanded ? 'Hide Details' : 'View Details'} <ArrowRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--lp-muted-fg)', fontWeight: 600 }}>
                        {uni.programs_count ? `${uni.programs_count} Programs` : 'Explore Programs'}
                      </span>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateRows: isExpanded ? '1fr' : '0fr', 
                      transition: 'grid-template-rows 300ms ease',
                      marginTop: isExpanded ? '1rem' : '0'
                    }}>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ paddingTop: '1rem', borderTop: '1px dashed var(--lp-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--lp-muted-fg)', lineHeight: 1.6, margin: 0 }}>
                            {uni.description || `Explore programs and admission details for ${uni.name}, located in ${uni.city || 'Germany'}.`}
                          </p>
                          
                          <Link
                            to={`/universities/${uni.id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              background: 'var(--lp-forest)',
                              color: 'var(--lp-forest-fg)',
                              padding: '0.65rem 1.1rem',
                              borderRadius: '8px',
                              fontWeight: 600,
                              fontSize: '0.825rem',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                              transition: 'background 0.2s ease',
                            }}
                          >
                            Explore University <ArrowRight size={15} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            {universities.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                style={{
                  width: activeIndex === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: activeIndex === idx ? 'var(--lp-gold)' : 'var(--lp-gold-soft)',
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