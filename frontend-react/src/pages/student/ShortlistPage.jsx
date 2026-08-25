import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookmarkCheck,
  ExternalLink,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  fetchShortlist,
  removeShortlist,
  updateShortlistStatus,
  addShortlistNote,
} from '../../api/student';
import { EmptyState, ErrorState, Button, Dialog, Modal, Textarea } from '../../components/ui';
import { STATUS_OPTIONS } from '../../constants/options';
import { formatDate } from '../../lib/format';

/**
 * My Shortlist & Applications — real shortlist endpoints with status
 * tracking, notes, status history, and program navigation.
 */
export default function ShortlistPage() {
  const navigate = useNavigate();
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  const [noteTarget, setNoteTarget] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadShortlist = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchShortlist();
      setShortlist(res?.data || []);
    } catch (err) {
      setError(err.message || 'Could not load shortlist.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShortlist();
  }, [loadShortlist]);

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await removeShortlist(removeTarget.id);
      setShortlist((prev) => prev.filter((item) => item.id !== removeTarget.id));
      setRemoveTarget(null);
    } catch (err) {
      alert(err.message || 'Could not remove item.');
      setRemoveTarget(null);
    } finally {
      setRemoving(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!newStatus) return;
    try {
      const res = await updateShortlistStatus(id, newStatus);
      const updated = res?.data;
      if (updated) {
        setShortlist((prev) => prev.map((item) => (item.id === id ? updated : item)));
      } else {
        setShortlist((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
      }
    } catch (err) {
      alert(err.message || 'Could not update status.');
    }
  };

  const handleSaveNote = async () => {
    if (!noteTarget || !noteText.trim()) return;
    setSavingNote(true);
    try {
      await addShortlistNote(noteTarget, noteText.trim());
      await loadShortlist();
      setNoteTarget(null);
      setNoteText('');
    } catch (err) {
      alert(err.message || 'Could not save note.');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="shortlist-page flex flex-col gap-6">
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
            My Shortlist & Applications
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Real-time status tracking for your saved German university programs
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={loadShortlist}>
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-2xl)' }} />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Could not load shortlist" description={error} onRetry={loadShortlist} />
      ) : shortlist.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="Your shortlist is empty"
          description="Save programs from the Recommendation Wizard or Program search to track your application process."
          action={<Button variant="primary" onClick={() => navigate('/student/programs')}><ExternalLink size={14} /> Explore programs</Button>}
        />
      ) : (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 0, overflow: 'hidden' }}>
          <table className="shortlist-table">
            <thead>
              <tr>
                <th>Program & University</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shortlist.map((item) => {
                const program = item.program || {};
                const university = item.university || program.university || {};
                const currentStatus = item.status || 'pending';
                const programId = program.id || item.program_id;
                const deadline = program.deadline_winter || program.deadline_summer || item.deadline;

                return (
                  <tr key={item.id}>
                    <td>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
                        {program.name || item.program_name || 'Degree Program'}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {university.name || item.university_name || 'German University'}
                        {university.city ? ` · ${university.city}` : ''}
                      </p>
                    </td>
                    <td className="text-sm">{deadline ? formatDate(deadline) : '—'}</td>
                    <td>
                      <select
                        className="input select"
                        style={{ maxWidth: 170, padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        aria-label="Application status"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => { setNoteTarget(item.id); setNoteText(''); }}
                        >
                          <Plus size={13} /> Note
                        </button>
                        {programId && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => navigate(`/student/programs/${programId}`)}
                          >
                            Compare
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-danger"
                          onClick={() => setRemoveTarget(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Remove confirm dialog */}
      <Dialog
        isOpen={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        variant="danger"
        title="Remove from shortlist?"
        description="This will remove the program from your shortlist and application tracking."
        confirmText="Remove"
        loading={removing}
      />

      {/* Add note modal */}
      <Modal
        isOpen={Boolean(noteTarget)}
        onClose={() => setNoteTarget(null)}
        title="Add application note"
        description="Keep a private note about this program or your application."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNoteTarget(null)} disabled={savingNote}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveNote} loading={savingNote} disabled={!noteText.trim()}>
              Save note
            </Button>
          </>
        }
      >
        <Textarea
          label="Note"
          placeholder="e.g. Sent transcript via uni-assist on 3 June..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  );
}
