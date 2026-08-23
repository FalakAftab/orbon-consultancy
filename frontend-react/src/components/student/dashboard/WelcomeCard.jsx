import { useAuth } from '../../../contexts/AuthContext';

/**
 * Simple editorial welcome header for the Student Dashboard.
 * Plain ivory card, serif heading — matches the light dashboard theme.
 */
export function WelcomeCard({ profile }) {
  const { user } = useAuth();
  const firstName = profile?.first_name || user?.name?.split(' ')[0] || 'there';

  return (
    <section aria-label="Welcome">
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          color: 'var(--color-charcoal)',
        }}
      >
        Welcome back, {firstName}
      </h1>
      <p
        style={{
          marginTop: '0.5rem',
          fontSize: '0.9375rem',
          color: 'var(--color-text-muted)',
        }}
      >
        Keep an eye on your matches, shortlist, and upcoming application deadlines.
      </p>
    </section>
  );
}

export default WelcomeCard;
