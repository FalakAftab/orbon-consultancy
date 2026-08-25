import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { GraduationCap, MapPin, ChevronRight } from 'lucide-react';

/* ============================================================
   CountUp
   ============================================================ */
export function CountUp({ value, label, className }) {
  return (
    <div className={cn('count-up', className)}>
      <div className="count-up-value">{value}</div>
      <div className="count-up-label">{label}</div>
    </div>
  );
}

/* ============================================================
   Reveal — scroll-driven or immediate fade-up
   ============================================================ */
export function Reveal({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!visible) {
    return (
      <div ref={ref} className={cn('reveal', className)} style={{ '--reveal-delay': `${delay}ms` }}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn(className)} style={{ opacity: 1, transform: 'none', animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ============================================================
   MatchRing — circular match score visual
   ============================================================ */
export function MatchRing({ value = 94, tone = 'gold', className }) {
  return (
    <div
      className={cn('match-ring', `match-ring-${tone}`, className)}
      role="img"
      aria-label={`${value}% match`}
      style={{ '--match-value': value }}
    >
      <span>{value}%</span>
    </div>
  );
}

/* ============================================================
   JourneyPath — vertical step-by-step visual
   ============================================================ */
export function JourneyPath({ steps = [] }) {
  return (
    <div className="journey-path" aria-label="Study journey path">
      <div className="journey-path-line" aria-hidden="true" />
      {steps.map((step, index) => (
        <div key={step.label} className="journey-step">
          <div className="journey-step-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="journey-step-body">
            <h3>{step.label}</h3>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   PremiumProgramCard
   ============================================================ */
export function PremiumProgramCard({
  university,
  program,
  degree,
  location,
  tuition,
  language,
  deadline,
  match,
}) {
  return (
    <article className="premium-program-card card-hover">
      <div className="premium-program-accent" aria-hidden="true" />
      <div className="premium-program-body">
        <div className="premium-program-top">
          <div>
            <p className="premium-program-university">{university}</p>
            <h3>{program}</h3>
            <p className="premium-program-meta">
              {degree} · {location}
            </p>
          </div>
          <MatchRing value={match} tone="gold" />
        </div>
        <div className="premium-program-grid">
          <div>
            <span>Tuition</span>
            <strong>{tuition}</strong>
          </div>
          <div>
            <span>Language</span>
            <strong>{language}</strong>
          </div>
          <div>
            <span>Deadline</span>
            <strong>{deadline}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   AcademicWorld — the cinematic 3D hero illustration
   ============================================================ */
const cityNodes = [
  { className: 'aw-node-berlin',     label: 'Berlin' },
  { className: 'aw-node-munich',     label: 'Munich' },
  { className: 'aw-node-hamburg',    label: 'Hamburg' },
  { className: 'aw-node-heidelberg', label: 'Heidelberg' },
  { className: 'aw-node-frankfurt',  label: 'Frankfurt' },
];

export function AcademicWorld() {
  return (
    <div className="academic-world" aria-hidden="true">
      {/* Atmospheric orbit rings */}
      <div className="aw-orbit-outer" />
      <div className="aw-orbit-inner" />

      {/* Main sphere */}
      <div className="academic-world-sphere">
        {/* If the generated image loaded correctly, it sits inside the sphere */}
        <img
          className="academic-world-photo"
          src="/academic-world.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />

        {/* Inner glow overlay */}
        <div className="academic-world-glow" />

        {/* CSS-drawn university cityscape (fallback & overlay) */}
        <div className="academic-world-architecture">
          <span className="tower tower-left">
            <span className="tower-windows">
              {[...Array(4)].map((_, i) => <span key={i} className="tower-win" />)}
            </span>
          </span>
          <span className="tower tower-mid-l" />
          <span className="tower tower-center">
            <span className="tower-windows">
              {[...Array(6)].map((_, i) => <span key={i} className="tower-win" />)}
            </span>
          </span>
          <span className="tower tower-mid-r" />
          <span className="tower tower-right" />
          <span className="gate gate-left" />
          <span className="gate gate-right" />
        </div>
      </div>

      {/* Floating graduation cap */}
      <div className="aw-cap">
        <div className="aw-cap-board">
          <div className="aw-cap-top" />
          <div className="aw-cap-tassel" />
        </div>
      </div>

      {/* City / university nodes */}
      {cityNodes.map((node) => (
        <span key={node.label} className={cn('aw-node', node.className)}>
          <span className="aw-node-dot" />
          {node.label}
        </span>
      ))}

      {/* Floating mini-cards */}
      <div className="academic-world-cards">
        <div className="academic-mini-card">
          <div className="academic-mini-card-label">Top Match</div>
          <div className="academic-mini-card-value">96%</div>
          <div className="academic-mini-card-sub">TU Munich · Data Engineering</div>
        </div>
        <div className="academic-mini-card academic-mini-card-alt">
          <div className="academic-mini-card-label">Programs Available</div>
          <div className="academic-mini-card-value">1,200+</div>
          <div className="academic-mini-card-sub">across Germany</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FlowVisual — recommendation engine orbital diagram
   ============================================================ */
export function FlowVisual() {
  return (
    <div className="flow-visual" aria-hidden="true">
      <div className="flow-visual-ring" />
      <div className="flow-visual-ring" />
      <div className="flow-visual-ring" />
      <div className="flow-visual-center">
        <GraduationCap size={24} />
      </div>
    </div>
  );
}

/* ============================================================
   JourneyStages — student journey visual
   ============================================================ */
export function JourneyStages({ activeIndex = 1 }) {
  const stages = ['Profile', 'Recommendation', 'Shortlist', 'Application', 'Decision'];
  return (
    <div className="journey-stages" aria-label="Student journey stages">
      {stages.map((stage, i) => (
        <div key={stage} className={cn('journey-stage', i === activeIndex && 'active')}>
          <div className="journey-stage-marker" aria-hidden="true" />
          <span className="journey-stage-name">{stage}</span>
          {i === activeIndex && (
            <ChevronRight size={16} className="journey-stage-arrow" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

export default {
  CountUp,
  Reveal,
  MatchRing,
  JourneyPath,
  PremiumProgramCard,
  AcademicWorld,
  FlowVisual,
  JourneyStages,
};
