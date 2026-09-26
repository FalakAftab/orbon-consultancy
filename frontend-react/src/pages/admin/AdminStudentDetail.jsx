import { useEffect, useState } from 'react';
import { ArrowLeft, Bookmark, ClipboardList, GraduationCap, LoaderCircle, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAdminStudent } from '../../api/admin';

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'selected', label: 'Selected programs', icon: Bookmark },
  { id: 'recommended', label: 'Recommendations', icon: GraduationCap },
  { id: 'requests', label: 'Requests', icon: ClipboardList },
];

const programName = (item) => item?.program?.name || item?.university?.name || 'Program unavailable';
const universityName = (item) => item?.program?.university?.name || item?.university?.name || 'University unavailable';

export default function AdminStudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [tab, setTab] = useState('profile');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchAdminStudent(id)
      .then((response) => { if (active) setStudent(response.data); })
      .catch((requestError) => { if (active) setError(requestError.message || 'Could not load this student record.'); });
    return () => { active = false; };
  }, [id]);

  if (error) return <div className="admin-page-container"><p className="admin-record-error">{error}</p></div>;
  if (!student) return <div className="admin-page-container admin-record-loading"><LoaderCircle size={24} /> Loading student record...</div>;

  const profile = student.student_profile || {};
  const selected = student.favorites || [];
  const recommendations = student.recommendations || [];
  const requests = student.premium_applications || [];

  return (
    <main className="admin-page-container admin-student-record">
      <button type="button" className="admin-record-back" onClick={() => navigate('/admin/students')}><ArrowLeft size={16} /> Students</button>
      <header className="admin-record-header">
        <div className="admin-record-avatar">{student.name?.slice(0, 1)?.toUpperCase()}</div>
        <div>
          <h1>{student.name}</h1>
          <p>{student.email}{student.student_id ? ` · ${student.student_id}` : ''}</p>
        </div>
        <span className={`admin-record-status admin-record-status--${student.subscription_status || 'free'}`}>{student.subscription_status || 'free'}</span>
      </header>
      <nav className="admin-record-tabs" aria-label="Student record sections">
        {TABS.map(({ id: tabId, label, icon: Icon }) => <button type="button" key={tabId} onClick={() => setTab(tabId)} className={tab === tabId ? 'active' : ''}><Icon size={15} /> {label}</button>)}
      </nav>

      {tab === 'profile' && <section className="admin-record-panel admin-record-profile">
        <div><span>Email</span><strong>{student.email}</strong></div><div><span>Country</span><strong>{student.country || 'Not added'}</strong></div>
        <div><span>Qualification</span><strong>{profile.last_degree || 'Not added'}</strong></div><div><span>Target degree</span><strong>{profile.preferred_degree || 'Not added'}</strong></div>
        <div><span>GPA</span><strong>{profile.obtained_gpa || 'Not added'}</strong></div><div><span>English proof</span><strong>{profile.english_test_type || 'Not added'}</strong></div>
      </section>}
      {tab === 'selected' && <ProgramList items={selected} empty="This student has not selected any programs yet." showStatus />}
      {tab === 'recommended' && <ProgramList items={recommendations} empty="No recommendations have been generated yet." showScore />}
      {tab === 'requests' && <section className="admin-record-list">{requests.length ? requests.map((request) => <article className="admin-record-item" key={request.id}><div><strong>{programName(request)}</strong><small>{universityName(request)}</small></div><span className="admin-record-status">{(request.status || 'pending').replaceAll('_', ' ')}</span></article>) : <p className="admin-record-empty">No Apply-for-Me requests yet.</p>}</section>}
    </main>
  );
}

function ProgramList({ items, empty, showStatus = false, showScore = false }) {
  return <section className="admin-record-list">{items.length ? items.map((item) => <article className="admin-record-item" key={item.id}><div><strong>{programName(item)}</strong><small>{universityName(item)}</small></div>{showStatus && <span className="admin-record-status">{(item.status || 'saved').replaceAll('_', ' ')}</span>}{showScore && <span className="admin-record-score">{item.score ?? 0}% match</span>}</article>) : <p className="admin-record-empty">{empty}</p>}</section>;
}