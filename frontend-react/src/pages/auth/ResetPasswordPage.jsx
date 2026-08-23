import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, GraduationCap, Lock } from 'lucide-react';
import { resetPassword } from '../../api/auth';
import { Button, Input } from '../../components/ui';
import '../../styles/login.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const emailQuery = searchParams.get('email');

  const [form, setForm] = useState({
    email: emailQuery || '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  // If no token, maybe redirect or show error? For now just render normally but it will fail.
  useEffect(() => {
    if (!token) {
      setServerError('Invalid or missing password reset token.');
    }
  }, [token]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
    if (success) setSuccess('');
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters.';
    
    if (form.password !== form.password_confirmation) {
      next.password_confirmation = 'Passwords do not match.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setServerError('');
    setSuccess('');
    if (!validate()) return;

    if (!token) {
      setServerError('Missing reset token. Please check your email link again.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({
        token,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setSuccess('Your password has been successfully reset!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.errors) {
        const nextErrors = {};
        for (const [key, msgs] of Object.entries(err.errors)) {
          nextErrors[key] = Array.isArray(msgs) ? msgs[0] : msgs;
        }
        setErrors(nextErrors);
      } else {
        setServerError(err.message || 'Failed to reset password. The link might be expired.');
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
            Set your new password.
          </h1>
          <p className="auth-hero-sub">
            Please enter your email and a strong new password to regain access to your account.
          </p>
        </div>
      </section>

      {/* ===== RIGHT: RESET PASSWORD CARD ===== */}
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
              <p>Create a new, strong password that you don't use for other websites.</p>
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
                <div className="auth-field" style={{ marginBottom: '1rem' }}>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    label="Email address"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={errors.email}
                    disabled={!!emailQuery} // Disable if passed from query param
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="auth-field" style={{ marginBottom: '1rem' }}>
                  <div className="auth-input-w-icon">
                    <span className="auth-field-icon" aria-hidden="true">
                      <Lock size={18} />
                    </span>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      label="New Password"
                      placeholder="Enter new password"
                      value={form.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      error={errors.password}
                    />
                  </div>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>

                <div className="auth-field" style={{ marginBottom: '1.5rem' }}>
                  <div className="auth-input-w-icon">
                    <span className="auth-field-icon" aria-hidden="true">
                      <Lock size={18} />
                    </span>
                    <Input
                      id="password_confirmation"
                      type="password"
                      name="password_confirmation"
                      label="Confirm Password"
                      placeholder="Confirm new password"
                      value={form.password_confirmation}
                      onChange={(e) => updateField('password_confirmation', e.target.value)}
                      error={errors.password_confirmation}
                    />
                  </div>
                  {errors.password_confirmation && <span className="field-error">{errors.password_confirmation}</span>}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="auth-submit"
                  loading={submitting}
                  disabled={submitting || !token}
                >
                  {submitting ? 'Resetting…' : 'Reset Password'}
                  {!submitting && <ArrowRight size={18} />}
                </Button>
              </form>
            ) : (
              <div className="auth-resend">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
