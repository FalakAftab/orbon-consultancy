import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Globe,
  DollarSign,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { submitRecommendation } from '../../api/student';
import { createRecommendationForStudent } from '../../api/admin';
import { SUBJECT_CATEGORIES, SUBJECT_VALUE_TO_LABEL, QUALIFICATION_OPTIONS } from '../../constants/options';

import { WizardStepper } from '../../components/student/wizard/WizardStepper';
import { WizardTipPanel } from '../../components/student/wizard/WizardTipPanel';

/**
 * Recommendation Wizard — 5-Step Form Integrated directly with Laravel API.
 * Captures all fields validated by RecommendationRequest.php.
 */

const STEPS = [
  { id: 'academic', number: 1, title: 'Academic Profile', icon: GraduationCap },
  { id: 'language', number: 2, title: 'Language Proficiency', icon: Globe },
  { id: 'subjects', number: 3, title: 'Subject & Degree', icon: BookOpen },
  { id: 'preferences', number: 4, title: 'Intake & Location', icon: DollarSign },
  { id: 'review', number: 5, title: 'Review & Match', icon: Sparkles },
];

const DEGREE_OPTIONS = [
  { value: 'bachelor', label: 'Bachelor of Science (B.Sc.)' },
  { value: 'bachelor_arts', label: 'Bachelor of Arts (B.A.)' },
  { value: 'bachelor_eng', label: 'Bachelor of Engineering (B.Eng.)' },
  { value: 'master', label: 'Master of Science (M.Sc.)' },
  { value: 'master_arts', label: 'Master of Arts (M.A.)' },
  { value: 'master_eng', label: 'Master of Engineering (M.Eng.)' },
  { value: 'mba', label: 'MBA (Master of Business Administration)' },
  { value: 'phd', label: 'Doctorate / Ph.D.' },
];


const GERMAN_LEVELS = [
  { value: 'none', label: 'None / Beginner' },
  { value: 'a1', label: 'A1' },
  { value: 'a2', label: 'A2' },
  { value: 'b1', label: 'B1' },
  { value: 'b2', label: 'B2' },
  { value: 'c1', label: 'C1' },
  { value: 'c2', label: 'C2 Native/Bilingual' },
];

const INTAKE_OPTIONS = [
  { value: 'winter', label: 'Winter Semester (Sept/Oct)' },
  { value: 'summer', label: 'Summer Semester (Mar/Apr)' },
  { value: 'both', label: 'Either Semester' },
];

const MATCHING_MESSAGES = [
  'Analyzing your academic profile...',
  'Evaluating GPA conversion against German Bavarian Formula...',
  'Checking language & subject eligibility against DAAD dataset...',
  'Ranking programs by matching confidence score...',
];

const CRITERIA_STORAGE_KEY = 'studypath_recommendation_criteria';

const getSavedCriteria = () => {
  try {
    const raw = localStorage.getItem(CRITERIA_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export default function RecommendationWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Priority: 1. Router state (Refine Criteria) -> 2. Saved localStorage -> 3. Default empty
  const routerCriteria = location.state?.criteria || null;
  const savedCriteria = getSavedCriteria();
  const refineCriteria = routerCriteria || savedCriteria || null;

  // Admin mode (Part 2): when the wizard is opened from Admin → Students →
  // "Start Recommendation", the admin selected a target student. Everything
  // else about the wizard is identical — only where the result is submitted
  // and where we navigate afterwards changes.
  const adminStudentId = location.state?.adminStudentId || null;
  const adminStudentName = location.state?.adminStudentName || null;

  const [step, setStep] = useState(1);
  const previousSubjects = Array.isArray(refineCriteria?.preferred_subjects)
    ? refineCriteria.preferred_subjects
    : [];
  const [activeCategory, setActiveCategory] = useState(() => {
    if (previousSubjects.length > 0) {
      const found = SUBJECT_CATEGORIES.find(
        (c) => c.subcategories.some((s) => previousSubjects.includes(s.value))
      );
      if (found) return found.category;
    }
    return SUBJECT_CATEGORIES[0]?.category || '';
  });
  const [submitting, setSubmitting] = useState(false);
  const [matchingMsgIdx, setMatchingMsgIdx] = useState(0);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Compute initial names from user context or admin target student
  const nameParts = (adminStudentName || user?.name || '').trim().split(' ');
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  // Form State matching RecommendationRequest.php requirements exactly
  const [form, setForm] = useState(() => ({
    first_name: refineCriteria?.first_name || initialFirstName,
    last_name: refineCriteria?.last_name || initialLastName,
    last_degree: refineCriteria?.last_degree || '',
    obtained_gpa: refineCriteria?.obtained_gpa ?? '',
    maximum_gpa: refineCriteria?.maximum_gpa ?? '',
    passing_gpa: refineCriteria?.passing_gpa ?? '',

    english_test_type: refineCriteria?.english_test_type || 'ielts',
    english_test_score: refineCriteria?.english_test_score ?? '',
    german_level: refineCriteria?.german_level || 'none',

    preferred_degree: refineCriteria?.preferred_degree || 'master',
    preferred_subjects: previousSubjects.length > 0 ? previousSubjects : [],

    preferred_intake: refineCriteria?.preferred_intake || 'winter',
    admission_preference: refineCriteria?.admission_preference || 'both',
    tuition_preference: refineCriteria?.tuition_preference || 'free_only',
    preferred_language: refineCriteria?.preferred_language || 'english',
    preferred_city: refineCriteria?.preferred_city || '',
    preferred_state: refineCriteria?.preferred_state || '',
    tuition_fee_max: refineCriteria?.tuition_fee_max ?? '',
  }));

  // Automatically sync name from user context when available
  useEffect(() => {
    const rawName = (adminStudentName || user?.name || '').trim();
    if (rawName) {
      const parts = rawName.split(' ');
      const fn = parts[0] || '';
      const ln = parts.slice(1).join(' ') || '';
      setForm((prev) => ({
        ...prev,
        first_name: prev.first_name || fn,
        last_name: prev.last_name || ln,
      }));
    }
  }, [user, adminStudentName]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
  };

  const toggleSubject = (subject) => {
    setForm((prev) => {
      const exists = prev.preferred_subjects.includes(subject);
      const next = exists
        ? prev.preferred_subjects.filter((s) => s !== subject)
        : [...prev.preferred_subjects, subject];
      return { ...prev, preferred_subjects: next };
    });
    if (fieldErrors.preferred_subjects) setFieldErrors((prev) => ({ ...prev, preferred_subjects: '' }));
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    if (fieldErrors.preferred_subjects) setFieldErrors((prev) => ({ ...prev, preferred_subjects: '' }));
  };

  // The active parent category's subcategory options.
  const activeSubcategories =
    SUBJECT_CATEGORIES.find((c) => c.category === activeCategory)?.subcategories || [];

  // Step-by-step validation
  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!form.first_name.trim()) errs.first_name = 'First name is required.';
      if (!form.last_name.trim()) errs.last_name = 'Last name is required.';
      if (!form.last_degree) errs.last_degree = 'Qualification / degree is required.';
      if (!form.obtained_gpa || isNaN(form.obtained_gpa)) errs.obtained_gpa = 'Obtained GPA must be a number.';
      if (!form.maximum_gpa || isNaN(form.maximum_gpa)) errs.maximum_gpa = 'Maximum GPA is required.';
      if (!form.passing_gpa || isNaN(form.passing_gpa)) errs.passing_gpa = 'Passing GPA is required.';

      const obtained = Number(form.obtained_gpa);
      const max = Number(form.maximum_gpa);
      const passing = Number(form.passing_gpa);

      if (!isNaN(obtained) && !isNaN(max) && obtained > max) {
        errs.obtained_gpa = 'GPA cannot exceed Maximum GPA.';
      }
      if (!isNaN(passing) && !isNaN(max) && passing >= max) {
        errs.passing_gpa = 'Passing GPA must be less than Maximum GPA.';
      }
      if (!isNaN(obtained) && !isNaN(passing) && obtained < passing) {
        errs.obtained_gpa = 'Obtained GPA is below minimum passing GPA.';
      }
    } else if (currentStep === 2) {
      if (form.english_test_type !== 'moi' && !form.english_test_score) {
        errs.english_test_score = 'English score is required for IELTS/TOEFL.';
      }
    } else if (currentStep === 3) {
      if (!form.preferred_subjects.length) {
        errs.preferred_subjects = 'Select at least one preferred subject area.';
      }
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 5) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setServerError('');
    setSubmitting(true);

    // Sequential matching message ticker
    const interval = setInterval(() => {
      setMatchingMsgIdx((idx) => (idx + 1) % MATCHING_MESSAGES.length);
    }, 1000);

    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        last_degree: form.last_degree,
        obtained_gpa: parseFloat(form.obtained_gpa),
        maximum_gpa: parseFloat(form.maximum_gpa),
        passing_gpa: parseFloat(form.passing_gpa),

        english_test_type: form.english_test_type,
        english_test_score: form.english_test_score ? parseFloat(form.english_test_score) : null,
        german_level: form.german_level,

        preferred_degree: form.preferred_degree,
        preferred_subjects: form.preferred_subjects,

        preferred_intake: form.preferred_intake,
        admission_preference: form.admission_preference,
        tuition_preference: form.tuition_preference,
        preferred_language: form.preferred_language,
        preferred_city: form.preferred_city || null,
        preferred_state: form.preferred_state || null,
        tuition_fee_max: form.tuition_fee_max ? parseFloat(form.tuition_fee_max) : null,
      };

      const result = adminStudentId
        ? await createRecommendationForStudent(adminStudentId, payload)
        : await submitRecommendation(payload);
      clearInterval(interval);

      // Persist criteria locally so wizard pre-fills when opened directly
      try {
        localStorage.setItem(CRITERIA_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        /* ignore localStorage error */
      }

      // Navigate to results with the real API response AND the exact
      // criteria payload that was just submitted, so "Refine Criteria" on
      // the Results page has something to prefill from immediately —
      // the backend's recommend() response doesn't echo the criteria back,
      // so without this the wizard would reopen blank right after a fresh
      // submission (it only had data on subsequent visits loaded from
      // history, where criteria_snapshot does come back from the API).
      const resultsPath = adminStudentId ? '/admin/students/results' : '/student/results';
      navigate(resultsPath, {
        state: {
          recommendationResult: result,
          criteria: payload,
          adminStudentId,
          adminStudentName,
        },
      });
    } catch (err) {
      clearInterval(interval);
      setSubmitting(false);
      setServerError(err.message || 'Could not generate recommendations. Check input values.');
    }
  };

  return (
    <div className="wizard-page">
      {/* Breadcrumb */}
      <div className="wizard-breadcrumb">
        Recommendations <span>&gt;</span> <strong>{STEPS[step - 1].title}</strong>
      </div>

      {adminStudentId && (
        <div
          style={{
            background: 'var(--color-gold-soft, #FFF7E6)',
            border: '1px solid var(--color-gold, #D4A93A)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.6rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            color: 'var(--color-charcoal)',
          }}
        >
          Admin mode — generating a recommendation for <strong>{adminStudentName || `student #${adminStudentId}`}</strong>. This result will be saved to their account, not yours.
        </div>
      )}

      {/* Numbered stepper */}
      <WizardStepper steps={STEPS} currentStep={step} />

      {/* Two-column: form + contextual tip panel */}
      <div className="wizard-grid">
        <div className="wizard-card">
          {/* Server Error Alert */}
          {serverError && (
            <div
              style={{
                margin: '0 0 1.5rem',
                padding: '0.875rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-danger-50)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: 'var(--color-danger-600)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.875rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} noValidate>

          {/* STEP 1: Academic Profile */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
                  Personal & Academic Records
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  Enter your name and GPA details to calculate Bavarian Formula scores.
                </p>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="field">
                  <label className="field-label">First Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Alexander"
                    value={form.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                  />
                  {fieldErrors.first_name && <span className="field-error">{fieldErrors.first_name}</span>}
                </div>

                <div className="field">
                  <label className="field-label">Last Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Weber"
                    value={form.last_name}
                    onChange={(e) => updateField('last_name', e.target.value)}
                  />
                  {fieldErrors.last_name && <span className="field-error">{fieldErrors.last_name}</span>}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Current / Highest Qualification *</label>
                <select
                  className="input select"
                  value={form.last_degree}
                  onChange={(e) => updateField('last_degree', e.target.value)}
                >
                  <option value="">Select your qualification...</option>
                  {QUALIFICATION_OPTIONS.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.last_degree && <span className="field-error">{fieldErrors.last_degree}</span>}
              </div>


              <div className="grid grid-3" style={{ gap: '1rem' }}>
                <div className="field">
                  <label className="field-label">Obtained GPA *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    placeholder="3.4"
                    value={form.obtained_gpa}
                    onChange={(e) => updateField('obtained_gpa', e.target.value)}
                  />
                  {fieldErrors.obtained_gpa && <span className="field-error">{fieldErrors.obtained_gpa}</span>}
                </div>

                <div className="field">
                  <label className="field-label">Maximum GPA *</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    placeholder="4.0"
                    value={form.maximum_gpa}
                    onChange={(e) => updateField('maximum_gpa', e.target.value)}
                  />
                  {fieldErrors.maximum_gpa && <span className="field-error">{fieldErrors.maximum_gpa}</span>}
                </div>

                <div className="field">
                  <label className="field-label">Passing GPA *</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    placeholder="2.0"
                    value={form.passing_gpa}
                    onChange={(e) => updateField('passing_gpa', e.target.value)}
                  />
                  {fieldErrors.passing_gpa && <span className="field-error">{fieldErrors.passing_gpa}</span>}
                </div>
              </div>

              {/* Live Bavarian Formula German Grade Display */}
              {(() => {
                const obtained = parseFloat(form.obtained_gpa);
                const max = parseFloat(form.maximum_gpa);
                const passing = parseFloat(form.passing_gpa);
                if (isNaN(obtained) || isNaN(max) || isNaN(passing) || max <= passing || obtained > max || obtained < passing) {
                  return null;
                }
                const rawGrade = 1 + 3 * ((max - obtained) / (max - passing));
                const grade = (Math.round(rawGrade * 100) / 100).toFixed(2);
                let label = 'Good (Gut)';
                let color = '#0369a1';
                let bg = 'rgba(2, 132, 199, 0.08)';

                if (rawGrade <= 1.5) {
                  label = '1.0 – 1.5 Very Good (Sehr gut)';
                  color = '#15803d';
                  bg = 'rgba(34, 197, 94, 0.08)';
                } else if (rawGrade <= 2.5) {
                  label = '1.6 – 2.5 Good (Gut)';
                  color = '#0369a1';
                  bg = 'rgba(2, 132, 199, 0.08)';
                } else if (rawGrade <= 3.5) {
                  label = '2.6 – 3.5 Satisfactory (Befriedigend)';
                  color = '#b45309';
                  bg = 'rgba(245, 158, 11, 0.08)';
                } else if (rawGrade <= 4.0) {
                  label = '3.6 – 4.0 Sufficient (Ausreichend)';
                  color = '#c2410c';
                  bg = 'rgba(249, 115, 22, 0.08)';
                } else {
                  label = '> 4.0 Ineligible (Nicht ausreichend)';
                  color = '#b91c1c';
                  bg = 'rgba(239, 68, 68, 0.08)';
                }

                return (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-xl)',
                      background: bg,
                      border: `1.5px solid ${color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--color-muted)',
                        }}
                      >
                        Calculated German Grade (Bavarian Formula)
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color, marginTop: '0.2rem' }}>
                        Your German grade is <strong>{grade}</strong> ({label})
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color,
                        background: 'var(--color-surface)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      {grade}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}


          {/* STEP 2: Language Proficiency */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
                  Language Proficiency
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  English and German proficiency levels used for course eligibility.
                </p>
              </div>

              <div className="field">
                <label className="field-label">English Test Type</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'ielts', label: 'IELTS Academic' },
                    { id: 'toefl', label: 'TOEFL iBT' },
                    { id: 'moi', label: 'Medium of Instruction (MOI)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateField('english_test_type', t.id)}
                      style={{
                        padding: '0.65rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${form.english_test_type === t.id ? 'var(--color-forest)' : 'var(--color-border)'}`,
                        background: form.english_test_type === t.id ? 'rgba(11, 59, 54, 0.08)' : 'var(--color-surface)',
                        color: form.english_test_type === t.id ? 'var(--color-forest)' : 'var(--color-charcoal)',
                        fontSize: '0.875rem',
                        fontWeight: form.english_test_type === t.id ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.english_test_type !== 'moi' && (
                <div className="field">
                  <label className="field-label">
                    {form.english_test_type === 'ielts' ? 'IELTS Band Score' : 'TOEFL iBT Score'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    className="input"
                    placeholder={form.english_test_type === 'ielts' ? '7.5' : '95'}
                    value={form.english_test_score}
                    onChange={(e) => updateField('english_test_score', e.target.value)}
                  />
                  {fieldErrors.english_test_score && <span className="field-error">{fieldErrors.english_test_score}</span>}
                </div>
              )}

              <div className="field">
                <label className="field-label">German Language Level (CEFR)</label>
                <select
                  className="input select"
                  value={form.german_level}
                  onChange={(e) => updateField('german_level', e.target.value)}
                >
                  {GERMAN_LEVELS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Subject & Degree */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
                  Subject & Degree Preference
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  Select the level of study and specific academic subjects.
                </p>
              </div>

              <div className="field">
                <label className="field-label">Target Degree Level *</label>
                <select
                  className="input select"
                  value={form.preferred_degree}
                  onChange={(e) => updateField('preferred_degree', e.target.value)}
                >
                  {DEGREE_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>


              {/* Parent category selection */}
              <div className="field">
                <label className="field-label">What would you like to study? *</label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '0.6rem',
                    marginTop: '0.25rem',
                  }}
                >
                  {SUBJECT_CATEGORIES.map((parent) => {
                    const isActive = activeCategory === parent.category;
                    return (
                      <button
                        key={parent.category}
                        type="button"
                        onClick={() => handleSelectCategory(parent.category)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${isActive ? 'var(--color-forest)' : 'rgba(31,41,39,0.12)'}`,
                          background: isActive ? 'rgba(11, 59, 54, 0.08)' : 'rgba(255,255,255,0.7)',
                          color: isActive ? 'var(--color-forest)' : 'var(--color-charcoal)',
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 600 : 500,
                          cursor: 'pointer',
                          boxShadow: isActive ? 'inset 0 0 0 1px rgba(11,59,54,0.25)' : 'none',
                        }}
                      >
                        {parent.category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subcategory selection for the active parent */}
              <div className="field">
                <label className="field-label">
                  Choose your specialization in <strong style={{ color: 'var(--color-forest)' }}>{activeCategory}</strong> *
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.25rem' }}>
                  {/* Option to select the entire Parent Category */}
                  {(() => {
                    const isParentSelected = form.preferred_subjects.includes(activeCategory);
                    return (
                      <button
                        type="button"
                        onClick={() => toggleSubject(activeCategory)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          border: `1px solid ${isParentSelected ? 'var(--color-forest)' : 'var(--color-gold, #D4A93A)'}`,
                          background: isParentSelected ? 'var(--color-forest)' : 'var(--color-gold-soft, #FFF7E6)',
                          color: isParentSelected ? '#FFFFFF' : 'var(--color-charcoal)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isParentSelected ? `✓ Entire ${activeCategory} Selected` : `All ${activeCategory}`}
                      </button>
                    );
                  })()}

                  {activeSubcategories.map((sub) => {
                    const selected = form.preferred_subjects.includes(sub.value);
                    return (
                      <button
                        key={sub.value}
                        type="button"
                        onClick={() => toggleSubject(sub.value)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          border: `1px solid ${selected ? 'var(--color-forest)' : 'rgba(31,41,39,0.14)'}`,
                          background: selected ? 'rgba(11, 59, 54, 0.08)' : 'rgba(255,255,255,0.7)',
                          color: selected ? 'var(--color-forest)' : 'var(--color-charcoal)',
                          fontSize: '0.85rem',
                          fontWeight: selected ? 600 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.preferred_subjects && (
                  <span className="field-error" style={{ marginTop: '0.5rem' }}>
                    {fieldErrors.preferred_subjects}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Intake & Location */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
                  Intake & Financial Parameters
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  Set your intake semester, tuition filter, and city preferences.
                </p>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="field">
                  <label className="field-label">Preferred Intake Semester</label>
                  <select
                    className="input select"
                    value={form.preferred_intake}
                    onChange={(e) => updateField('preferred_intake', e.target.value)}
                  >
                    {INTAKE_OPTIONS.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field-label">Tuition Preference</label>
                  <select
                    className="input select"
                    value={form.tuition_preference}
                    onChange={(e) => updateField('tuition_preference', e.target.value)}
                  >
                    <option value="free_only">Tuition-Free Only (Public Universities)</option>
                    <option value="paid_only">Paid Programs</option>
                    <option value="both">Both Free & Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="field">
                  <label className="field-label">Preferred City (Optional)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Munich, Berlin"
                    value={form.preferred_city}
                    onChange={(e) => updateField('preferred_city', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="field-label">Max Tuition per Year (€) (Optional)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="e.g. 3000"
                    value={form.tuition_fee_max}
                    onChange={(e) => updateField('tuition_fee_max', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div>
              {submitting ? (
                /* Cinematic Matching calculation screen */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '320px',
                    gap: '1.75rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ position: 'relative', width: 90, height: 90 }}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '1px solid rgba(11, 59, 54, 0.2)',
                        animation: 'orbitSpin 6s linear infinite',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: '25%',
                        borderRadius: '50%',
                        background: 'var(--color-forest)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-ivory)',
                      }}
                    >
                      <GraduationCap size={22} />
                    </div>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        fontWeight: 400,
                        color: 'var(--color-charcoal)',
                      }}
                    >
                      {MATCHING_MESSAGES[matchingMsgIdx]}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.35rem' }}>
                      Executing backend RecommendationService algorithm
                    </p>
                  </div>
                </div>
              ) : (
                /* Review Summary */
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
                      Review Your Parameters
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                      Verify your profile before submitting to the recommendation engine.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'var(--color-surface-subtle)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.25rem 1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    <div>
                      <span className="text-muted">Student Name:</span>
                      <strong className="block" style={{ color: 'var(--color-charcoal)' }}>{form.first_name} {form.last_name}</strong>
                    </div>
                    <div>
                      <span className="text-muted">GPA:</span>
                      <strong className="block" style={{ color: 'var(--color-charcoal)' }}>{form.obtained_gpa} / {form.maximum_gpa}</strong>
                    </div>
                    <div>
                      <span className="text-muted">English Level:</span>
                      <strong className="block" style={{ color: 'var(--color-charcoal)' }}>{form.english_test_type.toUpperCase()} ({form.english_test_score || 'MOI'})</strong>
                    </div>
                    <div>
                      <span className="text-muted">Target Degree:</span>
                      <strong className="block text-capitalize" style={{ color: 'var(--color-charcoal)' }}>{form.preferred_degree}</strong>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span className="text-muted">Selected Subjects:</span>
                      <strong className="block" style={{ color: 'var(--color-forest)' }}>
                        {form.preferred_subjects.map((s) => SUBJECT_VALUE_TO_LABEL[s] || s).join(', ')}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions Footer */}
          {!submitting && (
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="btn btn-ghost"
                style={{ opacity: step === 1 ? 0.4 : 1 }}
              >
                <ArrowLeft size={15} /> Back
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-full)' }}
                  id="wizard-continue-btn"
                >
                  Continue <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-full)' }}
                  id="wizard-submit-btn"
                >
                  Submit & Generate Matches <Sparkles size={15} />
                </button>
              )}
            </div>
          )}
          </form>
        </div>

        <WizardTipPanel step={step} />
      </div>
    </div>
  );
}