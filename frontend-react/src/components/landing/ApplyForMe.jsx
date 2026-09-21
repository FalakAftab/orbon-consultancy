import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Globe, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function ApplyForMe() {
  const { user } = useAuth();
  const applyPath = user ? (user.role === 'admin' ? '/admin/students/wizard' : '/student/apply-for-me') : '/login';

  return (
    <section style={{ background: '#FAF7F2', padding: '6rem 0' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ background: '#0F172A', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          <div style={{ padding: '4rem 3rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', '@media (max-width: 1023px)': { gridTemplateColumns: '1fr', padding: '3rem 2rem' } }}>
            
            {/* Left Column: Copy & Benefits */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(196, 151, 70, 0.15)', padding: '0.4rem 1rem', borderRadius: '999px', marginBottom: '1.5rem' }}>
                <ShieldCheck size={16} color="#C49746" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#C49746', textTransform: 'uppercase' }}>
                  Premium Service
                </span>
              </div>
              
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', fontWeight: 600, color: '#FFFFFF', margin: '0 0 1.25rem 0', lineHeight: 1.15 }}>
                Expert guidance.<br/>Zero stress.
              </h2>
              
              <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '480px' }}>
                Applying to German universities can be complex. Let our expert consultants handle the entire process from document review to final submission.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                  { icon: FileText, title: 'Document Verification', desc: 'We ensure your documents meet uniAssist & university standards.' },
                  { icon: Globe, title: 'Direct Application', desc: 'We handle the portal submissions and correspondence.' },
                  { icon: Clock, title: 'Deadline Management', desc: 'Never miss an intake with our automated tracking.' },
                ].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(196, 151, 70, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2rem' }}>
                      <feature.icon size={14} color="#C49746" />
                    </div>
                    <div>
                      <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>{feature.title}</h4>
                      <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to={applyPath}
                style={{
                  background: '#C49746',
                  color: '#FFFFFF',
                  padding: '1rem 2rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s ease',
                  boxShadow: '0 8px 24px rgba(196, 151, 70, 0.25)'
                }}
              >
                Apply For Me <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right Column: Visual Component */}
            <div style={{ position: 'relative', height: '100%', minHeight: '400px', '@media (max-width: 1023px)': { display: 'none' } }}>
              <img 
                src="/apply_for_me_illustration_1788865219304.jpg" 
                alt="Expert Consultancy" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop";
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
