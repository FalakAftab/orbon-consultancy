import { useCallback, useEffect, useState } from 'react';
import {
  User,
  GraduationCap,
  Globe2,
  Settings,
  CheckCircle2,
  Save,
  X,
  BookOpen,
} from 'lucide-react';
import { fetchStudentProfile, updateStudentProfile } from '../../api/student';
import { ErrorState, Button, Input, Select, Textarea } from '../../components/ui';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';


function Section({ icon: Icon, title, children }) {
  return (
    <section className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.75rem 2rem' }}>
      <h2 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
        <Icon size={18} style={{ color: 'var(--color-forest)' }} /> {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchStudentProfile();
      const p = res?.profile || null;
      setProfile(p);
      if (p) {
        setForm({
          first_name: p.first_name || '',
          last_name: p.last_name || '',
          email: p.email || '',
          phone: p.phone || '',
          address: p.address || '',
        });
      }
    } catch (err) {
      setError(err.message || 'Could not load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    if (message) setMessage('');
  };

  const validate = () => {
    const errs = {};
    if (!form.first_name?.trim()) errs.first_name = 'First name is required.';
    if (!form.last_name?.trim()) errs.last_name = 'Last name is required.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        address: form.address,
      };
      const res = await updateStudentProfile(payload);
      if (res?.profile) {
        setProfile(res.profile);
        setMessage('Profile saved successfully.');
      }
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Could not save profile.');
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-2xl)' }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-2xl)' }} />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Could not load profile" description={error} onRetry={load} />;
  }

  const accountComplete = Boolean(
    profile?.first_name &&
    profile?.last_name &&
    profile?.phone &&
    profile?.address
  );

  const PROFILE_FIELD_KEYS = [
    'first_name', 'last_name', 'phone', 'address'
  ];
  const filledCount = PROFILE_FIELD_KEYS.filter((k) => Boolean(form[k])).length;
  const profileCompletionPercent = Math.round((filledCount / PROFILE_FIELD_KEYS.length) * 100);

  const field = (label, name, value, options, placeholder) => (
    <div className="field">
      <label className="field-label">{label}</label>
      <select
        className="input select"
        value={value}
        onChange={(e) => updateField(name, e.target.value)}
        disabled={!editing}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {fieldErrors[name] && <span className="field-error">{fieldErrors[name]}</span>}
    </div>
  );

  return (
    <div className="student-profile-page flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: 'var(--color-charcoal)',
            }}
          >
            Your Profile
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage your academic, language and preference details
          </p>
        </div>
        {!editing ? (
          <Button variant="primary" onClick={() => setEditing(true)}>
            <Settings size={15} /> Edit profile
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => { setEditing(false); setFieldErrors({}); load(); }}>
            <X size={15} /> Cancel
          </Button>
        )}
      </div>

      {/* Profile summary card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.75rem 2rem' }}>
        <div className="flex items-center gap-5 flex-wrap">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#0e1b2e',
              color: 'var(--color-ivory)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              flexShrink: 0,
            }}
          >
            {(form.first_name?.[0] || '') + (form.last_name?.[0] || '') || 'S'}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
              {[form.first_name, form.last_name].filter(Boolean).join(' ') || 'Your Profile'}
            </h2>
            <div className="flex items-center gap-2 mt-2" style={{ maxWidth: 420 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--color-surface-subtle)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${profileCompletionPercent}%`, background: 'var(--color-gold)', borderRadius: 'var(--radius-full)' }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-charcoal)', whiteSpace: 'nowrap' }}>
                {profileCompletionPercent}% Profile Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-success-50)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#15803d',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} /> {message}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr minmax(280px, 340px)', gap: 'var(--space-6)', alignItems: 'start' }}>
        <form className="flex flex-col gap-6" onSubmit={handleSave} noValidate>
          {/* Personal */}
          <Section icon={User} title="Personal Information">
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="field">
                <label className="field-label">First Name *</label>
                <Input value={form.first_name} onChange={(e) => updateField('first_name', e.target.value)} disabled={!editing} error={fieldErrors.first_name} />
              </div>
              <div className="field">
                <label className="field-label">Last Name *</label>
                <Input value={form.last_name} onChange={(e) => updateField('last_name', e.target.value)} disabled={!editing} error={fieldErrors.last_name} />
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <Input value={form.email} disabled={true} style={{ opacity: 0.7 }} />
              </div>
              <div className="field">
                <label className="field-label">Phone</label>
                <PhoneInput
                  international
                  defaultCountry="PK"
                  value={form.phone}
                  onChange={(value) => updateField('phone', value)}
                  disabled={!editing}
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Address</label>
                <Input value={form.address} onChange={(e) => updateField('address', e.target.value)} disabled={!editing} />
              </div>
            </div>
          </Section>

          {editing && (
            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => { setEditing(false); setFieldErrors({}); load(); }} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={saving}>
                <Save size={15} /> Save changes
              </Button>
            </div>
          )}
        </form>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.5rem' }}>
            <h3 className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-1 mb-3">
              <BookOpen size={13} /> Summary
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">Name</span><strong className="text-charcoal">{profile?.first_name} {profile?.last_name}</strong></div>
              <div className="flex justify-between"><span className="text-muted">Phone</span><strong className="text-charcoal">{profile?.phone || 'Not set'}</strong></div>
              <div className="flex justify-between"><span className="text-muted">Profile</span><strong className="text-charcoal">{accountComplete ? 'Complete' : 'Incomplete'}</strong></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
