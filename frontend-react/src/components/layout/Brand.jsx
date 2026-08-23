import { GraduationCap } from 'lucide-react';
import { cn } from '../../lib/cn';

export function Brand({ className }) {
  return (
    <div className={cn('sidebar-brand', className)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 1.5rem 1rem' }}>
      <div
        style={{
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #0B3B36 0%, #164E48 100%)',
          color: '#C49746',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(11, 59, 54, 0.2)',
        }}
      >
        <GraduationCap size={20} />
      </div>
      <div>
        <span
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#161D2B',
            lineHeight: 1.1,
            display: 'block',
          }}
        >
          Orbon
        </span>
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#C49746',
            textTransform: 'uppercase',
            display: 'block',
          }}
        >
          CONSULTANCY
        </span>
      </div>
    </div>
  );
}

export default Brand;

