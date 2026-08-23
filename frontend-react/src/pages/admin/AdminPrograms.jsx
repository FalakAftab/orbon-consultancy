import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';
import {
  fetchAdminPrograms,
  fetchAdminUniversities,
  createProgram,
  updateProgram,
  deleteProgram,
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
import { formatDegreeLevel, formatLanguage, formatIntake, formatTuitionType } from '../../lib/format';
import { normalizePagination } from '../../lib/pagination';

const EMPTY = {
  university_id: '',
  name: '',
  degree_level: '',
  field: '',
  subject_category: '',
  intake: '',
  language_of_instruction: '',
  admission_method: '',
  tuition_type: '',
  tuition_fee: '',
  scholarship_amount: '',
  description: '',
  application_link: '',
  daad_program_link: '',
  deadline_winter: '',
  deadline_summer: '',
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
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
const res = await fetchAdminPrograms({ search: debouncedSearch, per_page: 50, page });
      const data = Array.isArray(res?.data) ? res.data : [];
      setPrograms(data);
      setMeta(normalizePagination(res));
    } catch (err) {
      setError(err.message || 'Could not load programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // load universities for the create/edit form dropdown
    fetchAdminUniversities({ per_page: 100 })
      .then((res) => setUniversities(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (prog) => {
    setEditing(prog);
    const uni = prog.university || {};
    setForm({
      university_id: prog.university_id || '',
      name: prog.name || '',
      degree_level: prog.degree_level || '',
      field: prog.field || '',
      subject_category: prog.subject_category || '',
      intake: prog.intake || '',
      language_of_instruction: prog.language_of_instruction || '',
      admission_method: prog.admission_method || '',
      tuition_type: prog.tuition_type || '',
      tuition_fee: prog.tuition_fee ?? '',
      scholarship_amount: prog.scholarship_amount ?? '',
      description: prog.description || '',
      application_link: prog.application_link || '',
      daad_program_link: prog.daad_program_link || '',
      deadline_winter: prog.deadline_winter?.slice(0, 10) || '',
      deadline_summer: prog.deadline_summer?.slice(0, 10) || '',
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
      scholarship_amount: form.scholarship_amount ? Number(form.scholarship_amount) : undefined,
    };
    Object.keys(payload).forEach((k) => {
      if (payload[k] === '' || payload[k] === undefined) delete payload[k];
    });
    try {
      if (editing) {
        await updateProgram(editing.id, payload);
      } else {
        await createProgram(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.message || 'Could not save program.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProgram(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.message || 'Could not delete program.');
    } finally {
      setDeleting(false);
    }
  };

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="admin-programs flex flex-col gap-6">
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
            Manage Programs
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Create, edit, and remove degree programs in the catalogue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={load}><RefreshCw size={15} /> Refresh</Button>
          <Button variant="primary" onClick={openCreate}><Plus size={15} /> Add Program</Button>
        </div>
      </div>

      <div className="search-bar" style={{ maxWidth: 360 }}>
        <Search size={16} className="search-icon" />
        <Input placeholder="Search programs..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {error ? (
        <ErrorState title="Could not load programs" description={error} onRetry={load} />
      ) : loading ? (
        <div className="grid" style={{ gap: 'var(--space-3)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 84, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : programs.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No programs found" description="Try adjusting your search or add a new program." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Program</th>
                <th>University</th>
                <th>Degree</th>
                <th>Language</th>
                <th>Intake</th>
                <th>Tuition</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id}>
                  <td>
                    <p className="font-medium" style={{ color: 'var(--color-charcoal)' }}>{p.name}</p>
                    {p.field && <span className="text-xs text-muted">{p.field}</span>}
                  </td>
                  <td className="text-muted">{p.university?.name || '—'}</td>
                  <td><span className="badge badge-neutral">{formatDegreeLevel(p.degree_level)}</span></td>
                  <td className="text-muted">{formatLanguage(p.language_of_instruction)}</td>
                  <td className="text-muted">{formatIntake(p.intake)}</td>
                  <td><span className="badge badge-primary">{formatTuitionType(p.tuition_type)}</span></td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)} title="Edit"><Pencil size={14} /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(p)} title="Delete" className="text-danger"><Trash2 size={14} /></Button>
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

      {/* Create/Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Program' : 'Add Program'} size="lg">
        <div className="flex flex-col gap-4" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {formError && <p className="text-danger text-sm">{formError}</p>}
          <div className="grid grid-2 gap-3">
            <div className="field">
              <label className="field-label">University *</label>
              <Select value={form.university_id} onChange={(e) => update('university_id', e.target.value)}>
                <option value="">Select university</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </Select>
            </div>
            <div className="field">
              <label className="field-label">Program Name *</label>
              <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="M.Sc. Data Engineering" />
            </div>
          </div>
          <div className="grid grid-3 gap-3">
            <div className="field">
              <label className="field-label">Degree Level *</label>
              <Select value={form.degree_level} onChange={(e) => update('degree_level', e.target.value)}>
                <option value="">Select</option>
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
              </Select>
            </div>
            <div className="field">
              <label className="field-label">Field *</label>
              <Input value={form.field} onChange={(e) => update('field', e.target.value)} placeholder="Engineering" />
            </div>
            <div className="field">
              <label className="field-label">Subject Category</label>
              <Input value={form.subject_category} onChange={(e) => update('subject_category', e.target.value)} placeholder="Computer Science" />
            </div>
          </div>
          <div className="grid grid-3 gap-3">
            <div className="field">
              <label className="field-label">Intake *</label>
              <Select value={form.intake} onChange={(e) => update('intake', e.target.value)}>
                <option value="">Select</option>
                <option value="winter">Winter</option>
                <option value="summer">Summer</option>
                <option value="both">Both</option>
              </Select>
            </div>
            <div className="field">
              <label className="field-label">Language *</label>
              <Select value={form.language_of_instruction} onChange={(e) => update('language_of_instruction', e.target.value)}>
                <option value="">Select</option>
                <option value="english">English</option>
                <option value="german">German</option>
                <option value="mixed">Mixed</option>
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
          <div className="grid grid-3 gap-3">
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
              <label className="field-label">Tuition Fee (€)</label>
              <Input type="number" value={form.tuition_fee} onChange={(e) => update('tuition_fee', e.target.value)} placeholder="0" />
            </div>
            <div className="field">
              <label className="field-label">Scholarship Amount (€)</label>
              <Input type="number" value={form.scholarship_amount} onChange={(e) => update('scholarship_amount', e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="grid grid-2 gap-3">
            <div className="field">
              <label className="field-label">Application Link</label>
              <Input value={form.application_link} onChange={(e) => update('application_link', e.target.value)} placeholder="https://..." />
            </div>
            <div className="field">
              <label className="field-label">DAAD Link</label>
              <Input value={form.daad_program_link} onChange={(e) => update('daad_program_link', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Description</label>
            <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} placeholder="Program description" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Program'}
          </Button>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Dialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Program">
        <p className="text-sm text-muted">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This will remove it from the catalogue.
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
