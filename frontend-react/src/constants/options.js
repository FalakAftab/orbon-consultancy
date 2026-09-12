/* ============================================================
   Application constants and option lists
   Mirrors the option sets used by the old Vanilla frontend so the
   React app stays backend-compatible.
   ============================================================ */

/**
 * Academic subject taxonomy shown to students in the wizard.
 *
 * The parent categories are ONLY for UI organization.
 * The leaf `value`s are the EXACT `subject_category` values stored in the
 * database and expected by the backend RecommendationService matching logic.
 * We never submit the parent label as a fake subject — only real leaf DB
 * values are sent in `preferred_subjects`.
 *
 * This mirrors the full 38-category import taxonomy (DatasetImportService)
 * while preserving the legacy leaf values already present in the live DB
 * ("business", "humanities") so the existing ~2262 programs keep matching.
 * "business" and "business & management" are aliases under Business &
 * Economics; "humanities" and "linguistics & cultural studies" are aliases
 * under Social Sciences & Humanities.
 */
export const SUBJECT_CATEGORIES = [
  {
    category: 'Computer Science & IT',
    subcategories: [
      { value: 'computer science', label: 'Computer Science & Software' },
      { value: 'artificial intelligence', label: 'Artificial Intelligence (AI)' },
      { value: 'data science', label: 'Data Science & Big Data' },
      { value: 'cyber security', label: 'Cybersecurity' },
      { value: 'information technology', label: 'Information Technology (IT)' },
      { value: 'game & visual computing', label: 'Game Development & Graphics' },
    ],
  },
  {
    category: 'Engineering',
    subcategories: [
      { value: 'mechanical engineering', label: 'Mechanical & Automotive' },
      { value: 'electrical engineering', label: 'Electrical & Electronics' },
      { value: 'civil engineering', label: 'Civil & Structural' },
      { value: 'industrial engineering', label: 'Industrial & Production' },
      { value: 'robotics', label: 'Robotics & Automation' },
      { value: 'polymer', label: 'Chemical & Materials' },
      { value: 'aerospace', label: 'Aerospace Engineering' },
      { value: 'renewable energy', label: 'Renewable Energy' },
      { value: 'biomedical', label: 'Biomedical Engineering' },
      { value: 'environmental engineering', label: 'Environmental Engineering' },
      { value: 'water engineering', label: 'Water & Marine Resources' },
      { value: 'nanotechnology', label: 'Nanotechnology' },
      { value: 'maritime engineering', label: 'Maritime & Offshore' },
    ],
  },
  {
    category: 'Natural Sciences',
    subcategories: [
      { value: 'mathematics', label: 'Mathematics & Statistics' },
      { value: 'physics', label: 'Physics & Quantum Tech' },
      { value: 'chemistry', label: 'Chemistry & Biochemistry' },
      { value: 'biology', label: 'Biology & Life Sciences' },
      { value: 'agricultural science', label: 'Agriculture & Food Sciences' },
      { value: 'geosciences', label: 'Geosciences & Geography' },
      { value: 'environmental science', label: 'Environmental Science' },
      { value: 'nanoscience', label: 'Materials Science' },
    ],
  },
  {
    category: 'Medicine & Health',
    subcategories: [
      { value: 'medicine', label: 'Medicine & Pharmacy' },
      { value: 'biomedical sciences', label: 'Biomedical Sciences' },
      { value: 'public health', label: 'Public Health' },
      { value: 'sports science', label: 'Sports Science & Kinesiology' },
    ],
  },
  {
    category: 'Architecture & Design',
    subcategories: [
      { value: 'architecture', label: 'Architecture' },
      { value: 'urban planning', label: 'Urban & Landscape Planning' },
      { value: 'design', label: 'Product & Industrial Design' },
      { value: 'graphic design', label: 'Graphic & Visual Design' },
      { value: 'animation & game', label: 'Animation & Digital Media' },
    ],
  },
  {
    category: 'Law',
    subcategories: [
      { value: 'law', label: 'Law & International Legal Studies (LL.M.)' },
      { value: 'legal studies', label: 'European & Commercial Law' },
    ],
  },
  {
    category: 'Media & Communication',
    subcategories: [
      { value: 'media', label: 'Media, Journalism & Communications' },
    ],
  },
  {
    category: 'Business & Economics',
    subcategories: [
      { value: 'business', label: 'Business & Management' },
      { value: 'international trade', label: 'International Trade & Commerce' },
      { value: 'economics', label: 'Economics & Econometrics' },
      { value: 'finance', label: 'Finance & Banking' },
      { value: 'supply chain & logistics', label: 'Supply Chain & Logistics' },
      { value: 'marketing', label: 'Marketing & Digital Media' },
      { value: 'real estate', label: 'Real Estate Management' },
    ],
  },
  {
    category: 'Social Sciences & Humanities',
    subcategories: [
      { value: 'humanities', label: 'History & Philosophy' },
      { value: 'social sciences', label: 'Political Science & International Relations' },
      { value: 'psychology', label: 'Psychology' },
      { value: 'education', label: 'Education & Teaching' },
      { value: 'languages & translation', label: 'Languages & Translation' },
      { value: 'area studies', label: 'Regional & Global Studies' },
      { value: 'social work', label: 'Social Work' },
    ],
  },
  {
    category: 'German Language',
    subcategories: [
      { value: 'german', label: 'German Studies (Germanistik / DaF)' },
    ],
  },
  {
    category: 'Preparatory & Foundation Studies',
    subcategories: [
      { value: 'foundation & preparatory', label: 'Studienkolleg & Pathway Programs' },
      { value: 'interdisciplinary & research', label: 'Interdisciplinary Studies' },
    ],
  },
];

/** Parent category labels (for quick access). */
export const SUBJECT_PARENT_OPTIONS = SUBJECT_CATEGORIES.map((c) => c.category);

/**
 * Flat list of valid leaf `subject_category` values (the real DB values).
 * Kept for backwards-compatibility with code that expects a flat array.
 */
export const SUBJECT_OPTIONS = SUBJECT_CATEGORIES.flatMap((c) => c.subcategories.map((s) => s.value));

/** Map a leaf value -> human label. */
export const SUBJECT_VALUE_TO_LABEL = SUBJECT_CATEGORIES.reduce((acc, c) => {
  c.subcategories.forEach((s) => { acc[s.value] = s.label; });
  return acc;
}, {});

/** Shortlist / application tracking status options. */
export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'preparing_documents', label: 'Preparing Documents' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer_received', label: 'Offer Received' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'visa_process', label: 'Visa Process' },
  { value: 'enrolled', label: 'Enrolled' },
];

/** Preferred intake options. */
export const INTAKE_OPTIONS = [
  { value: 'winter', label: 'Winter' },
  { value: 'summer', label: 'Summer' },
  { value: 'both', label: 'Both' },
];

/** Degree level options. */
export const DEGREE_OPTIONS = [
  { value: 'bachelor', label: 'Bachelor of Science (B.Sc.)' },
  { value: 'bachelor_arts', label: 'Bachelor of Arts (B.A.)' },
  { value: 'bachelor_eng', label: 'Bachelor of Engineering (B.Eng.)' },
  { value: 'master', label: 'Master of Science (M.Sc.)' },
  { value: 'master_arts', label: 'Master of Arts (M.A.)' },
  { value: 'master_eng', label: 'Master of Engineering (M.Eng.)' },
  { value: 'mba', label: 'MBA (Master of Business Administration)' },
  { value: 'phd', label: 'Doctorate / Ph.D.' },
];

/** Qualification options for current / highest qualification. */
export const QUALIFICATION_OPTIONS = [
  { value: 'Bachelor of Science (B.Sc.)', label: 'Bachelor of Science (B.Sc.)' },
  { value: 'Bachelor of Arts (B.A.)', label: 'Bachelor of Arts (B.A.)' },
  { value: 'Bachelor of Engineering (B.Eng.)', label: 'Bachelor of Engineering (B.Eng.)' },
  { value: 'Bachelor of Business Administration (BBA)', label: 'Bachelor of Business Administration (BBA)' },
  { value: 'Bachelor of Computer Science (BSCS / BSIT)', label: 'Bachelor of Computer Science (BSCS / BSIT)' },
  { value: 'Bachelor of Medicine / Surgery (MBBS / BDS)', label: 'Bachelor of Medicine / Surgery (MBBS / BDS)' },
  { value: 'High School Diploma / A-Levels / F.Sc.', label: 'High School Diploma / A-Levels / F.Sc.' },
  { value: 'Master of Science (M.Sc.)', label: 'Master of Science (M.Sc.)' },
  { value: 'Master of Arts (M.A.)', label: 'Master of Arts (M.A.)' },
  { value: 'Master of Engineering (M.Eng.)', label: 'Master of Engineering (M.Eng.)' },
  { value: 'Master of Business Administration (MBA)', label: 'Master of Business Administration (MBA)' },
  { value: 'Doctorate / Ph.D.', label: 'Doctorate / Ph.D.' },
];



/** English test type options. */
export const ENGLISH_TEST_OPTIONS = [
  { value: 'ielts', label: 'IELTS' },
  { value: 'toefl', label: 'TOEFL' },
  { value: 'moi', label: 'MOI' },
];

/** Admission preference options. */
export const ADMISSION_PREFERENCE_OPTIONS = [
  { value: 'uni_assist_only', label: 'Uni-Assist' },
  { value: 'direct_portal_only', label: 'Direct Portal' },
  { value: 'both', label: 'Both' },
];

/** Tuition preference options. */
export const TUITION_PREFERENCE_OPTIONS = [
  { value: 'free_only', label: 'Free' },
  { value: 'paid_only', label: 'Paid' },
  { value: 'both', label: 'Both' },
];

/** Study language options. */
export const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'german', label: 'German' },
  { value: 'mixed', label: 'Mixed' },
];

/** German language levels. */
export const GERMAN_LEVEL_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'a1', label: 'A1' },
  { value: 'a2', label: 'A2' },
  { value: 'b1', label: 'B1' },
  { value: 'b2', label: 'B2' },
  { value: 'c1', label: 'C1' },
  { value: 'c2', label: 'C2' },
];

/** University tuition type options (admin forms). */
export const TUITION_TYPE_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
  { value: 'both', label: 'Both' },
];

/** Admission method options (admin forms). */
export const ADMISSION_METHOD_OPTIONS = [
  { value: 'uni_assist', label: 'Uni-Assist' },
  { value: 'direct_portal', label: 'Direct Portal' },
  { value: 'both', label: 'Both' },
];

/** Color-tone mapping helpers for badges. */
export const STATUS_TONE = {
  pending: 'warning',
  preparing_documents: 'info',
  applied: 'info',
  interview: 'info',
  offer_received: 'accent',
  rejected: 'danger',
  accepted: 'success',
  visa_process: 'info',
  enrolled: 'success',
};
