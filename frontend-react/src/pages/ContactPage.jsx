import { useState } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { SiteFooter } from '../components/landing/SiteFooter';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Plus,
  Minus,
  MessageSquare,
  ShieldCheck,
  Star,
  GraduationCap,
  Globe,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function LinkedInIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

const faqs = [
  {
    question: 'What is the application process like?',
    answer:
      'Our process begins with a comprehensive academic profile evaluation (analyzing your ECTS credits and GPA equivalency). We then match you with targeted tuition-free public German universities, assist in auditing Uni-Assist/VPD prerequisites, and submit your applications directly.',
  },
  {
    question: 'Do you help with visa and accommodation?',
    answer:
      'Yes! We provide step-by-step guidance for German student visa documentation, blocked account (Sperrkonto) setup, compulsory health insurance verification, and student housing/WG placement assistance.',
  },
  {
    question: 'How much does your consultancy service cost?',
    answer:
      'Our core university search and recommendation engine is 100% free. For students who prefer our team to manage all application submissions, Uni-Assist VPDs, and direct university follow-ups, our Pro Plan starts at a transparent one-time fee of PKR 45,000.',
  },
  {
    question: 'Can you help with all universities in Germany?',
    answer:
      'We partner with and assist applications across all accredited public German universities, including TUM, LMU Munich, Heidelberg, HU Berlin, RWTH Aachen, TU Darmstadt, and many more.',
  },
  {
    question: 'How can I track my application status?',
    answer:
      'Once registered, you can track real-time application updates, document status, and chat directly with your assigned consultancy advisor inside your student portal dashboard.',
  },
];

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <div style={{ background: '#FAF7F2', color: '#161D2B', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <main>
        {/* ============================================================
            1. HERO SECTION
            ============================================================ */}
        <section style={{ padding: '4.5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              
              {/* Left Column: Text & Feature Pills */}
              <div>
                <Link
                  to="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#5B6578',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => (e.target.style.color = '#161D2B')}
                  onMouseOut={(e) => (e.target.style.color = '#5B6578')}
                >
                  <ArrowLeft size={16} /> Back to Home
                </Link>
                <br />

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#C49746',
                    textTransform: 'uppercase',
                    marginBottom: '0.85rem',
                    display: 'inline-block',
                  }}
                >
                  GET IN TOUCH
                </span>

                <h1
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                    fontWeight: 700,
                    color: '#161D2B',
                    margin: '0 0 1rem 0',
                    lineHeight: 1.15,
                  }}
                >
                  We're Here to Help You
                </h1>

                <p style={{ color: '#5B6578', fontSize: '1.025rem', lineHeight: 1.65, marginBottom: '2.25rem', maxWidth: '520px' }}>
                  Have questions about studying in Germany? Need guidance with your application? Our team is ready to assist you. Reach out to us — we'd love to hear from you!
                </p>

                {/* 3 Horizontal Feature Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#ffffff', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.825rem', color: '#161D2B', display: 'block' }}>Quick Response</strong>
                      <span style={{ fontSize: '0.725rem', color: '#718096' }}>We reply within 24 hours</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#ffffff', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.825rem', color: '#161D2B', display: 'block' }}>Personal Support</strong>
                      <span style={{ fontSize: '0.725rem', color: '#718096' }}>From application to arrival</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#ffffff', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Star size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.825rem', color: '#161D2B', display: 'block' }}>Expert Guidance</strong>
                      <span style={{ fontSize: '0.725rem', color: '#718096' }}>Trusted by 1000+ students</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Organic Masked German Image & Floating Badge */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '480px',
                    height: '380px',
                    borderRadius: '160px 40px 160px 40px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(15,23,42,0.12)',
                    border: '4px solid #ffffff',
                  }}
                >
                  <img
                    src="/images/contact_hero.jpg"
                    alt="Study in Germany"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Gold Cursive Script Badge Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '2rem',
                      right: '2rem',
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: 'italic',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      textAlign: 'right',
                    }}
                  >
                    Your Future<br />Our Priority
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1.25rem',
                    right: '1rem',
                    background: '#ffffff',
                    padding: '0.85rem 1.35rem',
                    borderRadius: '999px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={16} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#161D2B' }}>
                    Let's Start Your German Journey Together
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ============================================================
            2. MAIN CONTACT DETAILS & FORM SECTION (2 COLUMNS)
            ============================================================ */}
        <section style={{ padding: '3.5rem 0 4.5rem' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
              
              {/* LEFT COLUMN: Contact Details & Office/Map Cards */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                }}
              >
                <div>
                  <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.65rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.35rem 0' }}>
                    Our Contact Details
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#5B6578', margin: 0 }}>
                    Feel free to reach out through any of the following channels.
                  </p>
                </div>

                {/* 4 Contact Items Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                  {/* Phone */}
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase' }}>Phone</span>
                      <strong style={{ fontSize: '0.9rem', color: '#161D2B', display: 'block', marginTop: '0.15rem' }}>+49 123 4567890</strong>
                      <span style={{ fontSize: '0.725rem', color: '#A0AEC0' }}>Mon - Fri, 9AM - 6PM (CET)</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase' }}>Email</span>
                      <a href="mailto:germanconsultancy.info@gmail.com" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#161D2B', textDecoration: 'none', display: 'block', marginTop: '0.15rem' }}>
                        germanconsultancy.info@gmail.com
                      </a>
                      <span style={{ fontSize: '0.725rem', color: '#A0AEC0' }}>We reply within 24 hours</span>
                    </div>
                  </div>

                  {/* Office */}
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase' }}>Our Office</span>
                      <strong style={{ fontSize: '0.85rem', color: '#161D2B', display: 'block', marginTop: '0.15rem', lineHeight: 1.3 }}>
                        Hauptstraße 25, 10117 Berlin, Germany
                      </strong>
                      <a href="#map" style={{ fontSize: '0.75rem', color: '#C49746', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem' }}>
                        View on Google Maps <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Follow Us */}
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <LinkedInIcon size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase' }}>Follow Us</span>
                      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem', color: '#161D2B' }}>
                        <a href="#linkedin" aria-label="LinkedIn" style={{ color: '#161D2B' }}><LinkedInIcon size={16} /></a>
                        <a href="#instagram" aria-label="Instagram" style={{ color: '#161D2B' }}><InstagramIcon size={16} /></a>
                        <a href="#youtube" aria-label="YouTube" style={{ color: '#161D2B' }}><YoutubeIcon size={16} /></a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2 Side-by-Side Image Cards (Google Map & Office Photo) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
                  
                  {/* Google Map Card */}
                  <div
                    id="map"
                    style={{
                      position: 'relative',
                      height: '210px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.08)',
                      background: '#E5E3DF',
                    }}
                  >
                    {/* Simulated Styled Map */}
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at 50% 50%, #e8ecef 0%, #d4dade 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {/* Map Pin Marker */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                        <div style={{ background: '#161D2B', color: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.725rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                          📍 Orbon Consultancy
                          <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 400, color: '#C49746' }}>Hauptstraße 25, 10117 Berlin</span>
                        </div>
                        <div style={{ width: 14, height: 14, background: '#C49746', borderRadius: '50%', border: '2px solid #ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
                      </div>

                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          position: 'absolute',
                          bottom: '0.75rem',
                          left: '0.75rem',
                          background: '#ffffff',
                          color: '#161D2B',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        View on Google Maps <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* Office Interior Photo Card */}
                  <div
                    style={{
                      height: '210px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.08)',
                      position: 'relative',
                    }}
                  >
                    <img
                      src="/images/orbon_office_interior.jpg"
                      alt="Orbon Consultancy Berlin Office"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(22, 29, 43, 0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 700 }}>
                      🏢 Berlin Advisory Office
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT COLUMN: Send Us a Message (Form Card) */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                }}
              >
                <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.65rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.35rem 0' }}>
                  Send Us a Message
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#5B6578', margin: '0 0 1.75rem 0' }}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {submitted && (
                  <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#047857', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> Message Sent Successfully! Our advisory team will get back to you within 24 hours.
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.875rem',
                        background: '#FAF7F2',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.875rem',
                        background: '#FAF7F2',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number (optional)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.875rem',
                        background: '#FAF7F2',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                      Subject *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.875rem',
                        background: '#FAF7F2',
                        outline: 'none',
                        color: formData.subject ? '#161D2B' : '#A0AEC0',
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="admission">University Admission Inquiry</option>
                      <option value="apply_for_me">Apply for Me Service Inquiry</option>
                      <option value="visa">German Visa & Blocked Account</option>
                      <option value="document">Document & VPD Audit</option>
                      <option value="other">Other General Query</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.875rem',
                        background: '#FAF7F2',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '0.5rem',
                      background: '#C49746',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.8rem 1.75rem',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(196,151,70,0.3)',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <Send size={16} /> Send Message →
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>


        {/* ============================================================
            3. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
            ============================================================ */}
        <section style={{ padding: '4.5rem 0', background: '#FAF7F2', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#C49746',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  display: 'inline-block',
                }}
              >
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: 'clamp(2.2rem, 3.5vw, 2.8rem)',
                  fontWeight: 700,
                  color: '#161D2B',
                  margin: '0 0 0.5rem 0',
                }}
              >
                Got Questions?
              </h2>
              <p style={{ color: '#5B6578', fontSize: '0.95rem', margin: 0 }}>
                Find quick answers to the most common questions about studying in Germany and our services.
              </p>
            </div>

            {/* Accordion List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => toggleFaq(idx)}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      boxShadow: isOpen ? '0 4px 16px rgba(0,0,0,0.04)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                      }}
                    >
                      <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>
                        {faq.question}
                      </h3>
                      <div
                        style={{
                          color: '#C49746',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </div>
                    </div>

                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                        <p style={{ fontSize: '0.875rem', color: '#5B6578', lineHeight: 1.6, margin: '0.75rem 0 0 0' }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* ============================================================
            4. BOTTOM HERO BANNER SECTION (LET'S TALK ABOUT YOUR FUTURE)
            ============================================================ */}
        <section style={{ background: '#161D2B', color: '#ffffff', padding: '4.5rem 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2.5rem' }}>
              
              {/* Left Column: Text & CTA */}
              <div style={{ maxWidth: '580px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#C49746',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    display: 'inline-block',
                  }}
                >
                  STILL HAVE QUESTIONS?
                </span>
                <h2
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: 'clamp(2.2rem, 3.5vw, 2.8rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: '0 0 0.75rem 0',
                    lineHeight: 1.15,
                  }}
                >
                  Let's Talk About Your Future
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  Get personalized advice and start your journey to a German university today.
                </p>

                <Link
                  to="/register"
                  style={{
                    background: '#C49746',
                    color: '#ffffff',
                    padding: '0.8rem 1.85rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(196,151,70,0.3)',
                    transition: 'all 200ms ease',
                  }}
                >
                  Book a Free Consultation →
                </Link>
              </div>

              {/* Right Column: 3 Live Stats Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.35rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(196,151,70,0.2)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>1000+</strong>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>Students Guided</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.35rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(196,151,70,0.2)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>98%</strong>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>Success Rate</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.35rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(196,151,70,0.2)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>50+</strong>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>Partner Universities</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ContactPage;
