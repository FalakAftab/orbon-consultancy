import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { resendVerificationEmail, getSocialAuthUrl, setSession, fetchMe } from '../../api/auth';
import { Button, Input } from '../../components/ui';
import '../../styles/login.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDeviceName() {
  return navigator.userAgent || navigator.platform || 'Orbon Consultancy Web';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, refreshUser, loginWithToken } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const errParam = params.get('error');
    if (errParam) {
      setServerError(decodeURIComponent(errParam));
    }
    if (token) {
      fetchMe()
        .then((meRes) => {
          if (meRes?.user) {
            if (loginWithToken) loginWithToken(token, meRes.user);
            else setSession(token, meRes.user);
            const target = meRes.user.role === 'admin' ? '/admin' : '/student';
            navigate(target, { replace: true });
          }
        })
        .catch(() => {
          if (loginWithToken) loginWithToken(token, { role: 'student' });
          navigate('/student', { replace: true });
        });
    }
  }, [navigate, loginWithToken]);

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
    if (needsVerification) setNeedsVerification(false);
    if (resendMessage) setResendMessage('');
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) {
      next.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      next.password = 'Password is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return; // prevent double submit

    setServerError('');
    setNeedsVerification(false);
    setResendMessage('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Device name is sent automatically; the user never sees this field.
      await signIn({ ...form, device_name: getDeviceName() });
      const target = location.state?.fromResults
        ? '/student/results'
        : location.state?.fromEligibility
        ? '/student/wizard'
        : (user?.role === 'admin' ? '/admin' : '/student');
      navigate(target, { replace: true });
    } catch (err) {
      if (err.statusCode === 403 && err.body?.needs_verification) {
        setNeedsVerification(true);
        setServerError(err.message || 'Please verify your email address before logging in.');
      } else {
        setServerError(err.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (resending) return;
    setResending(true);
    setResendMessage('');
    try {
      const result = await resendVerificationEmail(form.email.trim());
      setResendMessage(result?.message || 'Verification link sent.');
    } catch (err) {
      setResendMessage(err.message || 'Could not resend the email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-shell login-bg">
      {/* ===== LEFT: HERO ===== */}
      <section className="auth-hero">
        <div className="auth-hero-top">
          <Link to="/" className="auth-hero-brand" aria-label="Orbon Consultancy home">
            <span className="auth-hero-brand-name">Orbon Consultancy</span>
          </Link>
        </div>

        <div className="auth-hero-photo">
          <img
            src="/figma_assets/login___Image_Container.png"
            alt="Historic German university courtyard"
            width={960}
            height={640}
          />
        </div>

        <div className="auth-hero-body">
          <span className="auth-hero-eyebrow">Welcome Back</span>
          <h1 className="auth-hero-title">
            Continue your journey to Germany.
          </h1>
          <p className="auth-hero-sub">
            Sign in to access your custom university matches, program shortlists, and
            academic profile.
          </p>
        </div>
      </section>

      {/* ===== RIGHT: LOGIN CARD ===== */}
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          {/* Brand header */}
          <Link to="/" className="auth-mobile-brand" aria-label="Orbon Consultancy Home">
            <span className="auth-hero-brand-mark">
              <GraduationCap size={20} />
            </span>
            <span className="auth-hero-brand-name">Orbon Consultancy</span>
          </Link>

          <div className="auth-card">
            <div className="auth-card-heading">
              <h1>Sign In</h1>
              <p>Access your personalized German university advisor.</p>
            </div>

            {serverError && (
              <div className="auth-error-banner" role="alert">
                <CheckCircle2 size={18} />
                <span>{serverError}</span>
              </div>
            )}

            {needsVerification && (
              <>
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
              </>
            )}

            <form onSubmit={onSubmit} noValidate>
              <div className="auth-field">
                <label className="field-label" htmlFor="email">Email address</label>
                <div className="auth-input-w-icon">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={form.email}
                    onChange={updateField('email')}
                    error={errors.email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <span id="email-error" className="field-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="auth-field">
                <label className="field-label" htmlFor="password">Password</label>
                <div className="auth-input-w-icon">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={updateField('password')}
                    error={errors.password}
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={errors.password ? 'password-error' : undefined}
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
                {errors.password && (
                  <span id="password-error" className="field-error">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="auth-row">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="auth-link">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="auth-submit"
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? 'Signing in…' : 'Sign In'}
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
              Continue with Google
            </button>
          </div>

          <div className="auth-footer">
            Don&rsquo;t have an account?{' '}
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
