import { useNavigate } from 'react-router-dom';
import { Check, Clock } from 'lucide-react';

const plans = [
  {
    name: 'Pro Plan',
    price: 'PKR 45,000',
    billing: 'One-time consultancy fee',
    popular: true,
    active: true,
    description: 'We search, match & submit unlimited German university applications on your behalf.',
    features: [
      'Unlimited German University Applications',
      'Document Vault & VPD Handling',
      'Direct Application Submission for Client',
      'Real-time Admission Tracking Dashboard',
      'Direct Advisor Support',
    ],
  },
  {
    name: 'Ultra Plan',
    price: 'PKR 65,000',
    billing: 'One-time consultancy fee',
    comingSoon: true,
    description: 'Unlimited university applications + student job search assistance in Germany.',
    features: [
      'All Pro Plan Features included',
      'Unlimited University Applications',
      'Student Job Search & Resume Adaptation',
      'Part-time Job Placement Guidance',
      'Dedicated Career Advisor',
    ],
  },
  {
    name: 'Premium Pro Plan',
    price: 'PKR 95,000',
    billing: 'One-time consultancy fee',
    comingSoon: true,
    description: 'Complete German relocation package — Applications, Job Search, and Accommodation.',
    features: [
      'All Ultra Plan Features included',
      'Unlimited University Applications',
      'Student Job Search Assistance',
      'Living Space & Accommodation Finder',
      'WG & Apartment Placement in Germany',
    ],
  },
];

export function ComparisonTable() {
  const navigate = useNavigate();

  return (
    <section id="pricing" style={{ padding: '5rem 0', background: '#FAF7F2', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', color: '#C49746', textTransform: 'uppercase' }}>
            PREMIUM APPLICATION SERVICES
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', fontWeight: 600, color: '#161D2B', marginTop: '0.5rem', lineHeight: 1.15 }}>
            We apply on your behalf — you focus on your future
          </h2>
          <p style={{ color: '#5B6578', fontSize: '0.925rem', lineHeight: 1.6, marginTop: '0.75rem' }}>
            Upgrade to Pro Plan for unlimited university applications submitted by our expert consultancy team.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem', alignItems: 'stretch' }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '2rem 1.75rem',
                border: plan.popular ? '2px solid #C49746' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#C49746',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  ACTIVE • UNLIMITED
                </div>
              )}

              {plan.comingSoon && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#FEF2F2',
                    color: '#EF4444',
                    border: '1px solid #FCA5A5',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Clock size={12} />
                  COMING SOON
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  {plan.description}
                </p>

                <div style={{ marginTop: '1rem' }}>
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.1rem', fontWeight: 700, color: '#161D2B' }}>
                    {plan.price}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.1rem' }}>
                    {plan.billing}
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4A5568' }}>
                      <Check size={16} style={{ color: '#C49746', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.active ? (
                <button
                  onClick={() => navigate('/student/apply-for-me')}
                  style={{
                    marginTop: '2rem',
                    width: '100%',
                    background: '#C49746',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  Get Started (Apply For Me)
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    marginTop: '2rem',
                    width: '100%',
                    background: '#F1F5F9',
                    color: '#94A3B8',
                    border: '1px solid rgba(0,0,0,0.08)',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'not-allowed',
                  }}
                >
                  Coming Soon (Join Waitlist)
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
