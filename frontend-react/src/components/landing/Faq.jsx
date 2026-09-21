import { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { DecorativeLineArt } from './DecorativeLineArt';

const FAQ_ITEMS = [
  {
    question: 'How does the Germany Study recommendation system work?',
    answer: 'Our engine uses the official German Bavarian Formula to convert your home country GPA into the German 1.0 - 4.0 grading scale. It then checks your ECTS credit distribution, language certificates (IELTS, TOEFL, or MOI), and academic field against DAAD and German university database requirements.',
  },
  {
    question: 'Is the eligibility recommendation & program search free?',
    answer: 'Yes! Self-service eligibility checks, searching over 2,000+ German public university programs, filtering by tuition-free courses, and shortlisting programs are 100% free for all students.',
  },
  {
    question: 'What does the "Apply for Me" Pro Plan service include?',
    answer: 'With Pro Plan, our dedicated consultancy team handles the complete university application workflow on your behalf — including document auditing, Uni-Assist VPD review, portal form submission for unlimited target universities, and live tracking.',
  },
  {
    question: 'Does the Pro Plan guarantee university admission?',
    answer: 'Admission decisions are made strictly by public German university admissions committees. Our consultancy maximizes your acceptance rate by ensuring your documents, grade conversions, and portal submissions comply 100% with university requirements without any mistakes.',
  },
  {
    question: 'How do I track my application status once submitted?',
    answer: 'Your student dashboard includes a real-time status tracker (Pending, Under Review, Documents Verified, Submitted to University, Admission Letter Issued) with direct messaging and notes from your assigned advisor.',
  },
  {
    question: 'What are the upcoming Ultra & Premium Pro plans?',
    answer: 'Ultra Plan will include Student Job Search assistance in Germany. Premium Pro Plan will include Job Search PLUS Living Space & Accommodation finder in Germany. Both modules are launching soon!',
  },
];

export function Faq() {
  const [openIdx, setOpenIdx] = useState(0); // First item open by default

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" style={{ padding: '5.5rem 0', background: 'var(--lp-bg)', borderTop: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#C49746',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            <HelpCircle size={14} />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.2vw, 2.5rem)',
              fontWeight: 600,
              color: '#161D2B',
              marginTop: '0.25rem',
            }}
          >
            Everything You Need To Know
          </h2>
          <p style={{ color: '#5B6578', fontSize: '0.925rem', marginTop: '0.5rem' }}>
            Got questions about studying in Germany or our application services? We've got answers.
          </p>
        </div>

        {/* Accordion Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  border: isOpen ? '1px solid rgba(196, 151, 70, 0.4)' : '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 200ms ease',
                  background: 'var(--lp-card)',
                  boxShadow: isOpen ? '0 8px 25px rgba(196, 151, 70, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.02)',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: isOpen ? '#161D2B' : '#334155',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: isOpen ? '#C49746' : '#94A3B8',
                        width: '24px',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{item.question}</span>
                  </span>

                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isOpen ? 'rgba(196, 151, 70, 0.12)' : '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 200ms ease',
                    }}
                  >
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms ease',
                        color: isOpen ? '#C49746' : '#64748B',
                      }}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.35rem 3.25rem',
                      fontSize: '0.9rem',
                      color: '#5B6578',
                      lineHeight: 1.65,
                      borderTop: '1px solid rgba(0,0,0,0.04)',
                      paddingTop: '0.85rem',
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
