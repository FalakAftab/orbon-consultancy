import { useState, useEffect, useRef } from 'react';
import { Award, BookOpen, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client';

function CounterNumber({ targetNumber, suffix = '', formatComma = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || targetNumber === undefined || targetNumber === 0) return;
    const duration = 1800; // 1.8 seconds animation duration
    const frameRate = 1000 / 60; // 60 fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // Ease-out quadratic formula
      const progress = frame / totalFrames;
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentCount = Math.round(easeProgress * targetNumber);

      setCount(currentCount);

      if (frame >= totalFrames) {
        setCount(targetNumber);
        clearInterval(timer);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isVisible, targetNumber]);

  const formattedCount = formatComma
    ? count.toLocaleString('en-US')
    : count;

  return (
    <span ref={ref}>
      {formattedCount}{suffix}
    </span>
  );
}

export function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch live statistics from backend
    api('/stats')
      .then(res => setStats(res.data || res))
      .catch(err => console.error("Failed to fetch public stats:", err));
  }, []);

  // Fallback defaults if API fails
  const programsCount = stats?.programs_count || 1200;
  const uniCount = stats?.universities_count || 180;
  const freeCount = stats?.tuition_free_count || 500;
  
  const statsList = [
    { target: programsCount, suffix: '+', formatComma: true, label: 'PROGRAMS LISTED', icon: GraduationCap },
    { target: uniCount, suffix: '+', formatComma: false, label: 'UNIVERSITIES', icon: Building2 },
    { target: freeCount, suffix: '+', formatComma: true, label: 'TUITION-FREE PROGRAMS', icon: BookOpen },
    { target: 15, suffix: '+', formatComma: false, label: 'GERMAN CITIES', icon: Award },
    { target: 96, suffix: '%', formatComma: false, label: 'MATCH SATISFACTION', icon: CheckCircle2 },
  ];

  return (
    <section
      style={{
        background: '#0F172A',
        padding: '2.5rem 0',
        borderTop: '1px solid #1E293B',
        borderBottom: '1px solid #1E293B',
      }}
    >
      <div
        className="lp-stats-grid"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.5rem',
          gap: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', minWidth: '200px' }}>
              <div style={{ color: 'var(--lp-gold)', marginBottom: '0.25rem' }}>
                <Icon size={28} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '2.25rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  <CounterNumber
                    targetNumber={stat.target}
                    suffix={stat.suffix}
                    formatComma={stat.formatComma}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: '#94A3B8', marginTop: '0.75rem' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
