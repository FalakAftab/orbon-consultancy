import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Trash2,
  RefreshCw,
  Mail,
  MapPin,
  GraduationCap,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import {
  fetchAdminStudents,
  updateAdminStudent,
  deleteAdminStudent,
  createAdminStudent,
} from '../../api/admin';
import {
  Button,
  Input,
  Modal,
  Dialog,
  Pagination,
  EmptyState,
  ErrorState,
} from '../../components/ui';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDegreeLevel } from '../../lib/format';
import { normalizePagination } from '../../lib/pagination';

const emptyNewStudent = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  country: '',
};

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Add Student
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState(emptyNewStudent);
  const [addErrors, setAddErrors] = useState({});
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAdminStudents({ search: debouncedSearch, per_page: 50, page });
      const data = Array.isArray(res?.data) ? res.data : [];
      setStudents(data);
      setMeta(normalizePagination(res));
    } catch (err) {
      setError(err.message || 'Could not load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  const openView = (student) => {
    setViewTarget(student);
    setActionMsg('');
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setActionMsg('Password must be at least 8 characters.');
      return;
    }
    setResetting(true);
    setActionMsg('');
    try {
      await updateAdminStudent(resetTarget.id, { password: newPassword });
      setActionMsg('Password updated successfully.');
      setNewPassword('');
      setResetTarget(null);
    } catch (err) {
      setActionMsg(err.message || 'Could not reset password.');
    } finally {
      setResetting(false);
    }
  };

  const openAddModal = () => {
    setNewStudent(emptyNewStudent);
    setAddErrors({});
    setAddSuccessMsg('');
    setShowAddModal(true);
  };

  const handleCreateStudent = async () => {
    setAddErrors({});
    setAddSuccessMsg('');

    const errors = {};
    if (!newStudent.first_name.trim()) errors.first_name = 'First name is required.';
    if (!newStudent.last_name.trim()) errors.last_name = 'Last name is required.';
    if (!newStudent.email.trim() || !/^\S+@\S+\.\S+$/.test(newStudent.email)) {
      errors.email = 'A valid email is required.';
    }
    if (!newStudent.password || newStudent.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (newStudent.password !== newStudent.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match.';
    }
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }

    setAddSubmitting(true);
    try {
      await createAdminStudent(newStudent);
      setAddSuccessMsg('Student created successfully.');
      setNewStudent(emptyNewStudent);
      load();
      setTimeout(() => setShowAddModal(false), 900);
    } catch (err) {
      const serverErrors = err?.data?.errors;
      if (serverErrors) {
        const flat = {};
        Object.entries(serverErrors).forEach(([key, messages]) => {
          flat[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        setAddErrors(flat);
      } else {
        setAddErrors({ general: err.message || 'Could not create student.' });
      }
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleStartRecommendation = (student) => {
    navigate('/admin/students/wizard', {
      state: { adminStudentId: student.id, adminStudentName: student.name },
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setDeleting(true);
    try {
      await deleteAdminStudent(targetId);
      setStudents((prev) => prev.filter((s) => s.id !== targetId));
      setDeleteTarget(null);
      await load();
    } catch (err) {
      alert(err.message || 'Could not delete student.');
      setError(err.message || 'Could not delete student.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-students flex flex-col gap-6">
      <div className="admin-page-header">
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
            Manage Students
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            View and manage registered student accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={load}><RefreshCw size={15} /> Refresh</Button>
          <Button variant="primary" onClick={openAddModal}><UserPlus size={15} /> Add Student</Button>
        </div>
      </div>

      <div className="search-bar" style={{ maxWidth: 360 }}>
        <Search size={16} className="search-icon" />
        <Input placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {error ? (
        <ErrorState title="Could not load students" description={error} onRetry={load} />
      ) : loading ? (
        <div className="grid" style={{ gap: 'var(--space-3)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : students.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No students found" description="No student accounts match your search." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Country</th>
                <th>Target Degree</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const profile = s.student_profile || {};
                return (
                  <tr key={s.id}>
                    <td>
                      <p className="font-medium" style={{ color: 'var(--color-charcoal)' }}>{s.name}</p>
                    </td>
                    <td className="text-muted">{s.email}</td>
                    <td className="text-muted">{s.country || profile.country || '—'}</td>
                    <td>
                      {profile.preferred_degree ? (
                        <span className="badge badge-neutral">{formatDegreeLevel(profile.preferred_degree)}</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openView(s)}>View</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.lastPage > 1 && (
        <Pagination currentPage={page} totalPages={meta.lastPage} onPageChange={setPage} />
      )}

      {/* View student detail modal */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title={viewTarget?.name || 'Student Details'} size="lg">
        {viewTarget && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-2 gap-4">
              <div>
                <span className="field-label">Email</span>
                <p className="text-sm flex items-center gap-2 mt-1"><Mail size={14} /> {viewTarget.email}</p>
              </div>
              <div>
                <span className="field-label">Country</span>
                <p className="text-sm flex items-center gap-2 mt-1"><MapPin size={14} /> {viewTarget.country || '—'}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2" style={{ color: 'var(--color-charcoal)' }}>Reset Password</h4>
              <div className="flex items-center gap-2">
                <Input type="password" placeholder="New password (min 8 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Button variant="secondary" onClick={() => { setResetTarget(viewTarget); handleResetPassword(); }} disabled={resetting}>
                  {resetting ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
              {actionMsg && <p className="text-xs mt-2" style={{ color: actionMsg.includes('success') ? 'var(--color-success)' : 'var(--color-danger)' }}>{actionMsg}</p>}
            </div>
          </div>
        )}
      </Modal>

      {/* Add student modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Student" size="md">
        <div className="flex flex-col gap-4">
          {addSuccessMsg && (
            <div className="p-3 rounded-lg text-sm font-medium" style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success)' }}>
              {addSuccessMsg}
            </div>
          )}
          {addErrors.general && (
            <div className="p-3 rounded-lg text-sm font-medium" style={{ background: 'var(--color-danger-subtle)', color: 'var(--color-danger)' }}>
              {addErrors.general}
            </div>
          )}

          <div className="grid grid-2 gap-3">
            <div>
              <label className="field-label">First Name</label>
              <Input value={newStudent.first_name} onChange={(e) => setNewStudent((s) => ({ ...s, first_name: e.target.value }))} placeholder="John" />
              {addErrors.first_name && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{addErrors.first_name}</p>}
            </div>
            <div>
              <label className="field-label">Last Name</label>
              <Input value={newStudent.last_name} onChange={(e) => setNewStudent((s) => ({ ...s, last_name: e.target.value }))} placeholder="Doe" />
              {addErrors.last_name && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{addErrors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="field-label">Email</label>
            <Input type="email" value={newStudent.email} onChange={(e) => setNewStudent((s) => ({ ...s, email: e.target.value }))} placeholder="student@example.com" />
            {addErrors.email && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{addErrors.email}</p>}
          </div>

          <div>
            <label className="field-label">Country (optional)</label>
            <Input value={newStudent.country} onChange={(e) => setNewStudent((s) => ({ ...s, country: e.target.value }))} placeholder="Country" />
          </div>

          <div className="grid grid-2 gap-3">
            <div>
              <label className="field-label">Password</label>
              <Input type="password" value={newStudent.password} onChange={(e) => setNewStudent((s) => ({ ...s, password: e.target.value }))} placeholder="Min 8 characters" />
              {addErrors.password && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{addErrors.password}</p>}
            </div>
            <div>
              <label className="field-label">Confirm Password</label>
              <Input type="password" value={newStudent.password_confirmation} onChange={(e) => setNewStudent((s) => ({ ...s, password_confirmation: e.target.value }))} placeholder="Repeat password" />
              {addErrors.password_confirmation && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{addErrors.password_confirmation}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateStudent} disabled={addSubmitting}>
            {addSubmitting ? 'Creating...' : 'Create Student'}
          </Button>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Dialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Student">
        <p className="text-sm text-muted">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This will permanently remove the student account and related data.
        </p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
