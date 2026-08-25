import { useState, useEffect, useRef } from 'react';
import { Award, BookOpen, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';

const statsList = [
  { target: 500, suffix: '+', formatComma: false, label: 'DEGREES GUIDED', icon: BookOpen },
  { target: 1200, suffix: '+', formatComma: true, label: 'PROGRAMS LISTED', icon: GraduationCap },
  { target: 200, suffix: '+', formatComma: false, label: 'UNIVERSITIES', icon: Building2 },
  { target: 15, suffix: '+', formatComma: false, label: 'GERMAN CITIES', icon: Award },
  { target: 96, suffix: '%', formatComma: false, label: 'MATCH SATISFACTION', icon: CheckCircle2 },
];

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
    if (!isVisible) return;
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
  return (
    <section
      style={{
        background: '#121722',
        padding: '3.25rem 0',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1.75rem',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(196, 151, 70, 0.15)',
                  border: '1px solid rgba(196, 151, 70, 0.4)',
                  color: '#C49746',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.95rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    lineHeight: 1.05,
                    letterSpacing: '-0.02em',
                  }}
                >
                  <CounterNumber
                    targetNumber={stat.target}
                    suffix={stat.suffix}
                    formatComma={stat.formatComma}
                  />
                </div>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, letterSpacing: '0.09em', color: '#94A3B8', marginTop: '0.25rem' }}>
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
