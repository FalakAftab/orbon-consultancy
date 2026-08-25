import { Globe, Euro, Calendar, GraduationCap, Sparkles } from 'lucide-react';
import { useCountUp, useInView } from '../../hooks/useReveal';
import { cn } from '../../lib/cn';

const matches = [
  {
    level: 'Master',
    program: 'M.Sc. Data Engineering',
    university: 'Technical University of Berlin',
    score: 90,
    badgeColor: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    details: [
      { label: 'Language', value: 'English', icon: Globe },
      { label: 'Tuition', value: 'No tuition fee', icon: Euro },
      { label: 'Intake', value: 'Winter', icon: Calendar },
      { label: 'Degree', value: 'Master', icon: GraduationCap },
    ],
  },
  {
    level: 'Master',
    program: 'M.Sc. Mechanical Engineering',
    university: 'University of Stuttgart',
    score: 84,
    badgeColor: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    details: [
      { label: 'Language', value: 'German B2', icon: Globe },
      { label: 'Tuition', value: 'No tuition fee', icon: Euro },
      { label: 'Intake', value: 'Winter', icon: Calendar },
      { label: 'Degree', value: 'Master', icon: GraduationCap },
    ],
  },
  {
    level: 'Master',
    program: 'M.A. International Management',
    university: 'University of Cologne',
    score: 78,
    badgeColor: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    details: [
      { label: 'Language', value: 'English', icon: Globe },
      { label: 'Tuition', value: 'Semester fee only', icon: Euro },
      { label: 'Intake', value: 'Winter / Summer', icon: Calendar },
      { label: 'Degree', value: 'Master', icon: GraduationCap },
    ],
  },
];

function MatchCard({ match, index }) {
  const { ref, inView } = useInView({ threshold: 0.35 });
  const score = useCountUp(match.score, inView, 1300);

  return (
    <div
      ref={ref}
      style={{ ['--lp-reveal-delay']: `${index * 120}ms` }}
      className={cn('lp-reveal', inView && 'lp-is-visible')}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: '1.75rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          transition: 'transform 300ms ease, box-shadow 300ms ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Header row with Level & Score Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#68736F', textTransform: 'uppercase' }}>
              {match.level}
            </span>
            <div
              style={{
                background: match.badgeColor,
                color: '#ffffff',
                padding: '0.3rem 0.75rem',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              <Sparkles size={12} />
              {score}% MATCH
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: '#0E1B2E', lineHeight: 1.2, margin: 0 }}>
            {match.program}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#68736F', marginTop: '0.35rem', margin: 0 }}>
            {match.university}
          </p>

          {/* Progress Bar Indicator */}
          <div style={{ height: 4, background: '#E5E7EB', borderRadius: 999, margin: '1.25rem 0 1.5rem', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: inView ? `${match.score}%` : '0%',
                background: 'linear-gradient(90deg, #10B981, #34D399)',
                borderRadius: 999,
                transition: 'width 1200ms ease-out',
              }}
            />
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {match.details.map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#C7A45B', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  <Icon size={12} />
                  <span>{label}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', marginTop: '0.2rem' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Matches() {
  return (
    <section style={{ background: 'linear-gradient(135deg, #091A2C 0%, #0E243A 50%, #061320 100%)', padding: '5.5rem 0', color: '#ffffff' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C7A45B', textTransform: 'uppercase', background: 'rgba(199, 164, 91, 0.15)', padding: '0.4rem 0.85rem', borderRadius: 999, border: '1px solid rgba(199, 164, 91, 0.3)' }}>
              EXAMPLE MATCHES
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 400, color: '#ffffff', marginTop: '0.85rem', lineHeight: 1.15 }}>
              What a recommendation looks like.
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1rem', maxWidth: 540, lineHeight: 1.6, marginTop: '0.5rem' }}>
              A sample of how matched programs are presented inside Orbon Consultancy, with the criteria that produced the score.
            </p>
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: '#C7A45B', border: '1px solid rgba(199, 164, 91, 0.4)', padding: '0.45rem 1rem', borderRadius: 999, textTransform: 'uppercase', background: 'rgba(199, 164, 91, 0.1)' }}>
            DEMO DATA
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }}>
          {matches.map((match, i) => (
            <MatchCard key={match.program} match={match} index={i} />
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '3rem' }}>
          Example programs shown for illustration only. Live recommendations are generated from your own profile inside the application.
        </p>
      </div>
    </section>
  );
}
