import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
} from 'lucide-react';
import { register, resendVerificationEmail, getSocialAuthUrl } from '../../api/auth';
import { Button, Input } from '../../components/ui';
import '../../styles/login.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password) {
  if (!password) return { label: '', score: 0, cls: '' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Weak', score, cls: 'strength-weak' };
  if (score === 2) return { label: 'Fair', score, cls: 'strength-fair' };
  if (score === 3) return { label: 'Good', score, cls: 'strength-good' };
  return { label: 'Strong', score: 4, cls: 'strength-strong' };
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSocialLogin = async (provider) => {
    try {
      const res = await getSocialAuthUrl(provider);
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      setServerError(err.message || `Social login for ${provider} is not configured yet in backend .env file.`);
    }
  };

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) {
      next.name = 'Full name is required.';
    }
    if (!form.email.trim()) {
      next.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      next.password = 'Password is required.';
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    }
    if (form.password_confirmation !== form.password) {
      next.password_confirmation = 'Passwords do not match.';
    }
    if (!agreeTerms) {
      next.terms = 'You must agree to the Terms of Service & Privacy Policy.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return; // prevent double submit

    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
        country: null,
      });

      // Backend register() never issues a token — the account can't log in
      // until the email is verified. Show a confirmation screen instead of
      // navigating anywhere.
      setRegisteredEmail(form.email.trim());
    } catch (err) {
      // Map field-level 422 validation errors if present
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([key, messages]) => {
          mapped[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors(mapped);
      } else {
        setServerError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (resending || !registeredEmail) return;
    setResending(true);
    setResendMessage('');
    try {
      const result = await resendVerificationEmail(registeredEmail);
      setResendMessage(result?.message || 'Verification link sent.');
    } catch (err) {
      setResendMessage(err.message || 'Could not resend the email. Please try again.');
    } finally {
      setResending(false);
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
            src="/figma_assets/signup___Image_Container.png"
            alt="Grand university library reading hall"
            width={960}
            height={640}
          />
        </div>

        <div className="auth-hero-body">
          <span className="auth-hero-eyebrow">Begin Your Journey</span>
          <h1 className="auth-hero-title">
            Your path to a German university starts here.
          </h1>
          <p className="auth-hero-sub">
            Create your account to discover personalized recommendations, academic
            pathways, and direct admission tools.
          </p>
        </div>
      </section>

      {/* ===== RIGHT: REGISTER CARD ===== */}
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
            {registeredEmail ? (
              <>
                <div className="auth-card-heading">
                  <h1>Check your email</h1>
                  <p>
                    We've sent a verification link to <strong>{registeredEmail}</strong>. Click it to
                    activate your account, then sign in.
                  </p>
                </div>

                {resendMessage && (
                  <div className="auth-error-banner" role="status">
                    <CheckCircle2 size={18} />
                    <span>{resendMessage}</span>
                  </div>
                )}

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="auth-submit"
                  loading={resending}
                  disabled={resending}
                  onClick={onResend}
                >
                  {resending ? 'Sending…' : 'Resend verification email'}
                </Button>

                <div className="auth-footer">
                  Already verified? <Link to="/login">Sign in</Link>
                </div>
              </>
            ) : (
              <>
                <div className="auth-card-heading">
                  <h1>Create Account</h1>
                  <p>Begin your premium university search in Germany.</p>
                </div>

                {serverError && (
                  <div className="auth-error-banner" role="alert">
                    <CheckCircle2 size={18} />
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                  <div className="auth-field">
                    <div className="auth-input-w-icon">
                      <span className="auth-field-icon" aria-hidden="true">
                        <User size={18} />
                      </span>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        value={form.name}
                        onChange={updateField('name')}
                        error={errors.name}
                        aria-invalid={errors.name ? true : undefined}
                      />
                    </div>
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>

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
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={form.email}
                        onChange={updateField('email')}
                        error={errors.email}
                        aria-invalid={errors.email ? true : undefined}
                      />
                    </div>
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <div className="auth-field">
                    <div className="auth-input-w-icon">
                      <span className="auth-field-icon" aria-hidden="true">
                        <Lock size={18} />
                      </span>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        label="Password"
                        placeholder="Create a password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={updateField('password')}
                        error={errors.password}
                        aria-invalid={errors.password ? true : undefined}
                      />
                      <button
                        type="button"
                        className="auth-toggle-btn"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <span className="field-error">{errors.password}</span>}
                    {form.password && (
                      <div className="auth-strength" aria-live="polite">
                        <div className="auth-strength-track">
                          <span className={`auth-strength-fill ${getPasswordStrength(form.password).cls}`} />
                        </div>
                        <span className={`auth-strength-label ${getPasswordStrength(form.password).cls}`}>
                          {getPasswordStrength(form.password).label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="auth-field">
                    <div className="auth-input-w-icon">
                      <span className="auth-field-icon" aria-hidden="true">
                        <Lock size={18} />
                      </span>
                      <Input
                        id="password_confirmation"
                        type={showPassword ? 'text' : 'password'}
                        name="password_confirmation"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        value={form.password_confirmation}
                        onChange={updateField('password_confirmation')}
                        error={errors.password_confirmation}
                        aria-invalid={errors.password_confirmation ? true : undefined}
                      />
                    </div>
                    {errors.password_confirmation && (
                      <span className="field-error">{errors.password_confirmation}</span>
                    )}
                  </div>

                  <div className="auth-field">
                    <label className="auth-check">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (errors.terms) {
                            setErrors((prev) => ({ ...prev, terms: '' }));
                          }
                        }}
                      />
                      I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service &amp; Privacy Policy</a>
                    </label>
                    {errors.terms && <span className="field-error">{errors.terms}</span>}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="auth-submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    {submitting ? 'Creating account…' : 'Create Account'}
                    {!submitting && <ArrowRight size={18} />}
                  </Button>
                </form>

                <div className="auth-divider">or</div>

                <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin('google')}>
                  <img
                    src="https://www.google.com/favicon.ico"
                    width={18}
                    height={18}
                    alt=""
                  />
                  Sign up with Google
                </button>

                <div className="auth-footer">
                  Already have an account? <Link to="/login">Sign In</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
