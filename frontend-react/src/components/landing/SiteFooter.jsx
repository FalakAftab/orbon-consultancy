import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer style={{ background: '#121722', color: 'rgba(255, 255, 255, 0.7)', padding: '4.5rem 0 2.5rem', fontSize: '0.85rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="lp-footer-grid" style={{ gap: '2.5rem', paddingBottom: '3.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.45rem', fontWeight: 700, color: '#ffffff', textDecoration: 'none' }}>
              Orbon Consultancy
            </Link>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginTop: '1rem', lineHeight: 1.65, maxWidth: '340px', fontSize: '0.825rem' }}>
              Your personal admission companion for German higher education. We simplify the evaluation, planning, and match strategy so you can apply with confidence.
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: '#C49746' }}>
              Email: <a href="mailto:germanconsultancy.info@gmail.com" style={{ color: '#C49746', textDecoration: 'none' }}>germanconsultancy.info@gmail.com</a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              PLATFORM
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li><Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>Contact Us</Link></li>
              <li><a href="#how-it-works" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>Pathway Guide</a></li>
              <li><a href="#pricing" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>Pricing</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              RESOURCES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li><a href="#visa" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>German Student Visa</a></li>
              <li><a href="#blocked-account" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>Blocked Account Guide</a></li>
              <li><a href="#anabin" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>Anabin Database</a></li>
              <li><a href="#insurance" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>Health Insurance</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', paddingTop: '1.75rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.45)' }}>
          <p style={{ margin: 0 }}>© 2026 Orbon Consultancy GmbH. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#terms" style={{ color: 'rgba(255, 255, 255, 0.45)', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#privacy" style={{ color: 'rgba(255, 255, 255, 0.45)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#legal" style={{ color: 'rgba(255, 255, 255, 0.45)', textDecoration: 'none' }}>Legal Notice</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

