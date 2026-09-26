import { useCallback, useEffect, useState } from 'react';
import {
  User,
  GraduationCap,
  Globe2,
  Settings,
  CheckCircle2,
  Save,
  X,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';
import { fetchStudentProfile, updateStudentProfile } from '../../api/student';
import { getStudentVault, updateStudentVault } from '../../api/premium';
import { useAuth } from '../../contexts/AuthContext';
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
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({});
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Sync avatar from local storage or backend PRO vault
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`user_avatar_${user.id}`);
    if (stored) {
      setAvatarUrl(stored);
    } else {
      getStudentVault()
        .then((res) => {
          if (res?.data?.profile_picture) {
            setAvatarUrl(res.data.profile_picture);
            localStorage.setItem(`user_avatar_${user.id}`, res.data.profile_picture);
            window.dispatchEvent(new Event('user-avatar-updated'));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB. Please choose a smaller photo.');
      return;
    }

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize & resize image on canvas (max dimension 600px)
        const maxDim = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.88);
        setAvatarUrl(compressedBase64);

        if (user?.id) {
          localStorage.setItem(`user_avatar_${user.id}`, compressedBase64);
        }
        window.dispatchEvent(new Event('user-avatar-updated'));

        getStudentVault()
          .then((res) => {
            const vault = res.data || {};
            return updateStudentVault({ ...vault, profile_picture: compressedBase64 });
          })
          .then(() => {
            setMessage('Profile picture updated successfully!');
            setTimeout(() => setMessage(''), 3500);
          })
          .catch((err) => {
            console.warn('Could not sync avatar to backend vault', err);
            setMessage('Profile picture updated locally.');
            setTimeout(() => setMessage(''), 3500);
          })
          .finally(() => {
            setUploadingPhoto(false);
          });
      };
      img.onerror = () => {
        alert('Could not process image file.');
        setUploadingPhoto(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;
    setAvatarUrl('');
    if (user?.id) {
      localStorage.removeItem(`user_avatar_${user.id}`);
    }
    window.dispatchEvent(new Event('user-avatar-updated'));

    getStudentVault()
      .then((res) => {
        const vault = res.data || {};
        delete vault.profile_picture;
        return updateStudentVault(vault);
      })
      .then(() => {
        setMessage('Profile picture removed.');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => console.warn('Could not remove avatar from backend', err));
  };

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
              fontWeight: 600,
              letterSpacing: 'var(--letter-spacing-tight)',
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
        <div className="flex items-center gap-6 flex-wrap">
          {/* Avatar Photo Container with Upload Badge */}
          <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #C49746',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  border: '3px solid rgba(196, 151, 70, 0.4)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
              >
                {(form.first_name?.[0] || '') + (form.last_name?.[0] || '') || 'S'}
              </div>
            )}

            {/* Camera badge trigger */}
            <label
              htmlFor="avatar-file-input"
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: '#0F172A',
                border: '2px solid #FFFFFF',
                color: '#C49746',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                transition: 'transform 150ms ease',
              }}
              title="Upload Profile Picture"
            >
              <Camera size={15} />
            </label>
            <input
              id="avatar-file-input"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              disabled={uploadingPhoto}
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 600, color: 'var(--color-charcoal)', margin: 0 }}>
                  {[form.first_name, form.last_name].filter(Boolean).join(' ') || 'Your Profile'}
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '0.2rem', marginBottom: 0 }}>
                  Student Account &bull; German Admissions Track
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="avatar-file-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    background: '#FAF7F2',
                    border: '1px solid rgba(0,0,0,0.12)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#161D2B',
                    cursor: uploadingPhoto ? 'wait' : 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <Upload size={14} />
                  {uploadingPhoto ? 'Processing...' : avatarUrl ? 'Change Picture' : 'Upload Picture'}
                </label>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.8rem',
                      borderRadius: '8px',
                      background: '#FEE2E2',
                      border: 'none',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: '#B91C1C',
                      cursor: 'pointer',
                    }}
                    title="Remove profile picture"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3" style={{ maxWidth: 420 }}>
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

      <div>
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

      </div>
    </div>
  );
}
