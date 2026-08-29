import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, GraduationCap, Mail } from 'lucide-react';
import { forgotPassword } from '../../api/auth';
import { Button, Input } from '../../components/ui';
import '../../styles/login.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  const updateEmail = (event) => {
    setEmail(event.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
    if (serverError) setServerError('');
    if (success) setSuccess('');
  };

  const validate = () => {
    const next = {};
    if (!email.trim()) {
      next.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return; // prevent double submit

    setServerError('');
    setSuccess('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await forgotPassword(email.trim());
      setSuccess(
        res?.message ||
          'If an account exists for this email, we have sent password reset instructions. Please check your inbox and spam folder.'
      );
    } catch (err) {
      if (err.errors?.email) {
        setErrors((prev) => ({
          ...prev,
          email: Array.isArray(err.errors.email) ? err.errors.email[0] : err.errors.email,
        }));
      } else {
        // Fallback gracefully so user gets clear actionable feedback
        setSuccess(
          'If an account exists for this email, we have sent password reset instructions. Please check your inbox and spam folder.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* ===== LEFT: HERO ===== */}
      <section className="auth-hero">
        <div className="auth-hero-top">
          <Link to="/" className="auth-hero-brand" aria-label="Orbon Consultancy home">
            <span className="auth-hero-brand-name">Orbon Consultancy</span>
          </Link>
        </div>

        <div className="auth-hero-photo">
          <img
            src="/figma_assets/forgot-password___Image_Container.png"
            alt="Modern study room with wooden shelving"
            width={960}
            height={640}
          />
        </div>

        <div className="auth-hero-body">
          <span className="auth-hero-eyebrow">Secure Access</span>
          <h1 className="auth-hero-title">
            Regain your academic compass.
          </h1>
          <p className="auth-hero-sub">
            We will send you a secure link to reset your account credentials and get
            you back on your pathway.
          </p>
        </div>
      </section>

      {/* ===== RIGHT: FORGOT PASSWORD CARD ===== */}
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          {/* Mobile-only brand */}
          <div className="auth-mobile-brand">
            <span className="auth-hero-brand-mark">
              <GraduationCap size={20} />
            </span>
            <span className="auth-hero-brand-name">Orbon Consultancy</span>
          </div>

          <div className="auth-card">
            <div className="auth-card-heading">
              <h1>Reset Password</h1>
              <p>No worries. Enter your registered email address below, and we&rsquo;ll help you securely reset it.</p>
            </div>

            {serverError && (
              <div className="auth-error-banner" role="alert">
                <CheckCircle2 size={18} />
                <span>{serverError}</span>
              </div>
            )}

            {success && (
              <div className="auth-success-banner" role="status">
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}

            {!success ? (
              <form onSubmit={onSubmit} noValidate>
                <div className="auth-field">
                  <div className="auth-input-w-icon">
                    <span className="auth-field-icon" aria-hidden="true">
                      <Mail size={18} />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      label="Email address"
                      placeholder="Enter your registered email"
                      autoComplete="email"
                      value={email}
                      onChange={updateEmail}
                      error={errors.email}
                      aria-invalid={errors.email ? true : undefined}
                    />
                  </div>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="auth-submit"
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? 'Sending link…' : 'Send Reset Link'}
                  {!submitting && <ArrowRight size={18} />}
                </Button>
              </form>
            ) : (
              <div className="auth-resend">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setSuccess('');
                    setEmail('');
                  }}
                >
                  Request another link
                </Button>
              </div>
            )}
          </div>

          <div className="auth-footer">
            Remember your password? <Link to="/login">Back to login</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
