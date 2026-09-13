import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import {
  fetchAdminUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from '../../api/admin';
import {
  Button,
  Input,
  Textarea,
  Select,
  Modal,
  Dialog,
  Pagination,
  EmptyState,
  ErrorState,
} from '../../components/ui';
import { useDebounce } from '../../hooks/useDebounce';
import { formatTuitionType } from '../../lib/format';
import { normalizePagination } from '../../lib/pagination';

const EMPTY = {
  name: '',
  city: '',
  state: '',
  country: 'Germany',
  ranking: '',
  tuition_type: '',
  tuition_fee: '',
  admission_method: '',
  application_link: '',
  website_url: '',
  application_deadline_winter: '',
  application_deadline_summer: '',
  description: '',
  scholarship_available: false,
  is_featured: false,
};

export default function AdminUniversities() {
  const [universities, setUniversities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
const res = await fetchAdminUniversities({ search: debouncedSearch, per_page: 50, page });
const data = Array.isArray(res?.data) ? res.data : res?.items || [];
      setUniversities(data);
      setMeta(normalizePagination(res));
    } catch (err) {
      setError(err.message || 'Could not load universities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (uni) => {
    setEditing(uni);
    setForm({
      name: uni.name || '',
      city: uni.city || '',
      state: uni.state || '',
      country: uni.country || 'Germany',
      ranking: uni.ranking || '',
      tuition_type: uni.tuition_type || '',
      tuition_fee: uni.tuition_fee ?? '',
      admission_method: uni.admission_method || '',
      application_link: uni.application_link || '',
      website_url: uni.website_url || '',
      application_deadline_winter: uni.application_deadline_winter?.slice(0, 10) || '',
      application_deadline_summer: uni.application_deadline_summer?.slice(0, 10) || '',
      description: uni.description || '',
      scholarship_available: !!uni.scholarship_available,
      is_featured: !!uni.is_featured,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError('');
    const payload = {
      ...form,
      tuition_fee: form.tuition_fee ? Number(form.tuition_fee) : undefined,
      scholarship_available: form.scholarship_available,
      is_featured: form.is_featured,
    };
    // Remove empty strings
    Object.keys(payload).forEach((k) => {
      if (payload[k] === '' || payload[k] === undefined) delete payload[k];
    });
    try {
      if (editing) {
        await updateUniversity(editing.id, payload);
      } else {
        await createUniversity(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.message || 'Could not save university.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUniversity(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.message || 'Could not delete university.');
    } finally {
      setDeleting(false);
    }
  };

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="admin-page-container flex flex-col gap-6">
      <div className="admin-header-responsive">
        <div className="admin-header-titles">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 600,
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-charcoal)',
            }}
          >
            Manage Universities
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Create, edit, and remove universities from the catalogue
          </p>
        </div>
        <div className="admin-header-actions">
          <Button variant="secondary" onClick={load}><RefreshCw size={15} /> Refresh</Button>
          <Button variant="primary" onClick={openCreate}><Plus size={15} /> Add University</Button>
        </div>
      </div>

      <div className="search-bar" style={{ maxWidth: 420, width: '100%' }}>
        <Search size={16} className="search-icon" />
        <Input placeholder="Search universities..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {error ? (
        <ErrorState title="Could not load universities" description={error} onRetry={load} />
      ) : loading ? (
        <div className="grid" style={{ gap: 'var(--space-3)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : universities.length === 0 ? (
        <EmptyState icon={MapPin} title="No universities found" description="Try adjusting your search or add a new university." />
      ) : (
        <div className="admin-table-card-standalone">
          <table className="table" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                <th>University</th>
                <th>Location</th>
                <th>Tuition</th>
                <th>Programs</th>
                <th>Featured</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((u) => (
                <tr key={u.id}>
                  <td>
                    <p className="font-medium" style={{ color: 'var(--color-charcoal)' }}>{u.name}</p>
                    {u.ranking && <span className="text-xs text-muted">Rank {u.ranking}</span>}
                  </td>
                  <td className="text-muted">{u.city}{u.state ? `, ${u.state}` : ''}</td>
                  <td><span className="badge badge-neutral">{formatTuitionType(u.tuition_type)}</span></td>
                  <td className="text-muted">{u.program_count ?? '—'}</td>
                  <td>
                    {u.is_featured ? <span className="badge badge-gold">Featured</span> : <span className="badge badge-neutral">No</span>}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(u)} title="Edit"><Pencil size={14} /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(u)} title="Delete" className="text-danger"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

<Pagination
        currentPage={meta ? meta.current_page : page}
        totalPages={meta ? meta.last_page : 1}
        totalItems={meta ? meta.total : undefined}
onPageChange={setPage}
        pageSize={50}
      />

      {/* Create/Edit Modal */}
<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit University' : 'Add University'}>
        <div className="flex flex-col gap-4" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {formError && <p className="text-danger text-sm">{formError}</p>}
          <div className="grid grid-2 gap-3">
            <div className="field">
              <label className="field-label">Name *</label>
              <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Technical University of Munich" />
            </div>
            <div className="field">
              <label className="field-label">Ranking</label>
              <Input value={form.ranking} onChange={(e) => update('ranking', e.target.value)} placeholder="e.g. 1" />
            </div>
          </div>
          <div className="grid grid-2 gap-3">
            <div className="field">
              <label className="field-label">City *</label>
              <Input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Munich" />
            </div>
            <div className="field">
              <label className="field-label">State</label>
              <Input value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="Bavaria" />
            </div>
          </div>
          <div className="grid grid-2 gap-3">
            <div className="field">
              <label className="field-label">Tuition Type *</label>
              <Select value={form.tuition_type} onChange={(e) => update('tuition_type', e.target.value)}>
                <option value="">Select</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="both">Both</option>
              </Select>
            </div>
            <div className="field">
              <label className="field-label">Admission Method *</label>
              <Select value={form.admission_method} onChange={(e) => update('admission_method', e.target.value)}>
                <option value="">Select</option>
                <option value="uni_assist">Uni-Assist</option>
                <option value="direct_portal">Direct Portal</option>
                <option value="both">Both</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-2 gap-3">
            <div className="field">
              <label className="field-label">Website URL</label>
              <Input value={form.website_url} onChange={(e) => update('website_url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="field">
              <label className="field-label">Application Link</label>
              <Input value={form.application_link} onChange={(e) => update('application_link', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Description</label>
            <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} placeholder="About the university" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.scholarship_available} onChange={(e) => update('scholarship_available', e.target.checked)} />
              Scholarships available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} />
              Featured
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create University'}
          </Button>
        </div>
      </Modal>

      {/* Delete confirmation */}
<Dialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete University">
        <p className="text-sm text-muted">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone and may affect associated programs.
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
