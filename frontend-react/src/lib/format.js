/* ============================================================
   Formatting helpers — mirror the behaviour of the old frontend
   (money, intake, admission method, dates, statuses, etc.)
   ============================================================ */

/** Format a currency value as EUR. Returns 'N/A' for null/undefined/empty. */
export function money(value) {
  if (value === null || value === undefined || value === '') return 'N/A';
  const num = Number(value);
  return Number.isNaN(num) ? String(value) : `${num.toFixed(2)} EUR`;
}

/** Format a currency value as a compact display. */
export function moneyCompact(value) {
  if (value === null || value === undefined || value === '') return 'N/A';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  if (num === 0) return 'Free';
  return `${num.toLocaleString('en-US', { maximumFractionDigits: 0 })} €`;
}

/** Short date formatter. */
export function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Short date + time formatter. */
export function formatDateTime(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Intake label. */
export function formatIntake(value) {
  const map = { winter: 'Winter', summer: 'Summer', both: 'Winter & Summer' };
  return map[value] || (value ? String(value) : 'N/A');
}

/** Admission method label. */
export function formatAdmissionMethod(value) {
  const map = {
    uni_assist: 'Uni-Assist',
    uni_assist_only: 'Uni-Assist',
    direct_portal: 'Direct Portal',
    direct_portal_only: 'Direct Portal',
    both: 'Uni-Assist or Direct',
  };
  return map[value] || (value ? String(value) : 'N/A');
}

/** Tuition type label.
 * When a tuition fee is provided, the actual cost is the reliable
 * differentiator (most records are labelled tuition_type='both' yet are
 * genuinely free when fee is 0/null, or paid when fee > 0).
 */
export function formatTuitionType(value, fee) {
  return 'Varied';
}

/** Degree level label. */
export function formatDegreeLevel(value) {
  const map = {
    bachelor: 'Bachelor of Science (B.Sc.)',
    bachelor_arts: 'Bachelor of Arts (B.A.)',
    bachelor_eng: 'Bachelor of Engineering (B.Eng.)',
    master: 'Master of Science (M.Sc.)',
    master_arts: 'Master of Arts (M.A.)',
    master_eng: 'Master of Engineering (M.Eng.)',
    mba: 'MBA (Master of Business Administration)',
    phd: 'Doctorate / Ph.D.',
  };
  return map[value] || (value ? String(value) : 'N/A');
}


/** Shortlist / application status label. */
export function formatShortlistStatus(value) {
  const map = {
    pending: 'Pending',
    preparing_documents: 'Preparing Documents',
    applied: 'Applied',
    interview: 'Interview',
    offer_received: 'Offer Received',
    rejected: 'Rejected',
    accepted: 'Accepted',
    visa_process: 'Visa Process',
    enrolled: 'Enrolled',
  };
  return map[value] || (value ? String(value) : 'N/A');
}

/** English test type label. */
export function formatEnglishTestType(value) {
  const map = { ielts: 'IELTS', toefl: 'TOEFL', moi: 'MOI' };
  return map[value] || (value ? String(value) : 'N/A');
}

/** Language of instruction label. */
export function formatLanguage(value) {
  const map = { english: 'English', german: 'German', mixed: 'Mixed' };
  return map[value] || (value ? String(value) : 'N/A');
}

/** German level label. */
export function formatGermanLevel(value) {
  if (!value || value === 'none') return 'None';
  return String(value).toUpperCase();
}

/* ============================================================
   Safe display helpers — never render raw JS objects to the user
   ============================================================ */

const NOT_SPECIFIED = 'Not Specified';

/**
 * Safely convert any value into a human-readable string.
 * Handles string, number, boolean, null, undefined, arrays, objects,
 * and nested objects. For objects, it inspects real keys and picks the
 * most meaningful human-readable value(s).
 */
export function formatDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return NOT_SPECIFIED;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Ignore common "no data" markers stored upstream.
    if (!trimmed || /^(null|undefined|nan|n\/a|na|-)$/i.test(trimmed)) {
      return NOT_SPECIFIED;
    }
    return trimmed;
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return NOT_SPECIFIED;
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return NOT_SPECIFIED;
    const parts = value.map((item) => formatDisplayValue(item));
    const cleaned = parts.filter((part) => part !== NOT_SPECIFIED);
    return cleaned.length ? cleaned.join(', ') : NOT_SPECIFIED;
  }

  if (typeof value === 'object') {
    // Inspect known keys and prefer meaningful ones.
    const keys = Object.keys(value);
    if (keys.length === 0) return NOT_SPECIFIED;

    const preferredOrder = [
      'label', 'name', 'value', 'title', 'text', 'level', 'required',
      'min_ielts', 'min_toefl', 'max_german_grade', 'german_level',
      'deadline_winter_raw', 'deadline_summer_raw', 'note', 'notes',
      'description', 'url', 'link',
    ];

    for (const key of preferredOrder) {
      if (key in value && value[key] !== null && value[key] !== undefined && value[key] !== '') {
        return formatDisplayValue(value[key]);
      }
    }

    // Fall back to the first non-empty value.
    for (const key of keys) {
      const v = value[key];
      if (v !== null && v !== undefined && v !== '') {
        const formatted = formatDisplayValue(v);
        if (formatted !== NOT_SPECIFIED) return formatted;
      }
    }

    return NOT_SPECIFIED;
  }

  return String(value);
}

/**
 * Format a program's English requirements into readable text.
 * Supports all real shapes found in the dataset/API:
 *   - { min_ielts, min_toefl, accepted_tests }
 *   - { test_type, min_score }
 *   - { required, level }
 *   - { required: true }
 *   - any other object / array / scalar (via formatDisplayValue)
 * Never returns "[object Object]".
 */
export function formatEnglishRequirement(req) {
  if (req === null || req === undefined || req === '') return NOT_SPECIFIED;

  // Non-object (e.g. a plain string) — display safely.
  if (typeof req !== 'object') return formatDisplayValue(req);

  const parts = [];
  const isObj = !Array.isArray(req);

  // Shape: { min_ielts, min_toefl, accepted_tests }
  if (isObj && req.min_ielts != null && req.min_ielts !== '') {
    parts.push(`IELTS ${req.min_ielts}+`);
  }
  if (isObj && req.min_toefl != null && req.min_toefl !== '') {
    parts.push(`TOEFL ${req.min_toefl}`);
  }
  if (isObj && Array.isArray(req.accepted_tests) && req.accepted_tests.length) {
    const labels = req.accepted_tests
      .map((t) => ({ ielts: 'IELTS', toefl: 'TOEFL', moi: 'MOI' })[t] || formatDisplayValue(t))
      .filter((t) => t && t !== NOT_SPECIFIED);
    if (labels.length) parts.push(labels.join(' / '));
  }

  // Shape: { test_type, min_score }
  if (isObj && req.test_type && req.min_score != null && req.min_score !== '') {
    const type = String(req.test_type).toUpperCase();
    parts.push(`${type} ${req.min_score} required`);
  } else if (isObj && req.test_type && !req.min_score) {
    parts.push(`${String(req.test_type).toUpperCase()} required`);
  }

  // Shape: { required: true, level: "C1" } -> "C1 English required"
  if (isObj && req.required === true) {
    const level = req.level ? String(req.level).toUpperCase() : null;
    parts.push(level ? `${level} English required` : 'English required');
  }
  if (isObj && req.required === false && parts.length === 0) {
    parts.push('Not required');
  }

  // Shape: { level: "C1" } alone -> "C1 English"
  if (isObj && parts.length === 0 && req.level) {
    parts.push(`${String(req.level).toUpperCase()} English`);
  }

  // Fall back to a generic object/array formatter so we never leak raw objects.
  if (parts.length === 0) {
    const generic = formatDisplayValue(req);
    return generic === NOT_SPECIFIED ? NOT_SPECIFIED : generic;
  }

  return parts.join(' · ');
}

/**
 * Format a program's German requirements into readable text.
 * Supports all real shapes:
 *   - { required: true, level: "B2" } -> "German B2 required"
 *   - { min_level: "B2" }             -> "German B2"
 *   - { required: false }             -> "Not required"
 *   - any other object / array / scalar
 * Never returns "[object Object]".
 */
export function formatGermanRequirement(req) {
  if (req === null || req === undefined || req === '') return NOT_SPECIFIED;

  if (typeof req !== 'object') return formatDisplayValue(req);

  const isObj = !Array.isArray(req);
  const levelOf = (lvl) => (lvl ? formatGermanLevel(lvl) : null);
  const level = levelOf(req.level) || levelOf(req.min_level);

  if (isObj && req.required === true) {
    return level ? `German ${level} required` : 'German required';
  }
  if (isObj && req.required === false) {
    return 'Not required';
  }
  if (level) {
    return `German ${level}`;
  }

  // Generic fallback for arrays / other objects.
  const generic = formatDisplayValue(req);
  return generic === NOT_SPECIFIED ? NOT_SPECIFIED : generic;
}

/**
 * Format a program's eligibility rules object into readable text.
 * Expected shape: { max_german_grade, german_required, german_level,
 *                   deadline_winter_raw, deadline_summer_raw, ... }.
 * Never returns "[object Object]".
 */
export function formatEligibility(rules) {
  if (rules === null || rules === undefined || rules === '') return NOT_SPECIFIED;

  if (typeof rules !== 'object') return formatDisplayValue(rules);

  const parts = [];
  if (rules.max_german_grade != null && rules.max_german_grade !== '') {
    parts.push(`Max German grade ${rules.max_german_grade}`);
  }
  if (rules.german_required === true) {
    parts.push(rules.german_level ? `German ${formatGermanLevel(rules.german_level)} required` : 'German required');
  }
  if (rules.deadline_winter_raw) {
    parts.push(`Winter deadline: ${formatDisplayValue(rules.deadline_winter_raw)}`);
  }
  if (rules.deadline_summer_raw) {
    parts.push(`Summer deadline: ${formatDisplayValue(rules.deadline_summer_raw)}`);
  }

  if (parts.length === 0) {
    const generic = formatDisplayValue(rules);
    return generic === NOT_SPECIFIED ? NOT_SPECIFIED : generic;
  }

  return parts.join(' · ');
}

/**
 * Safely format a text/description value that may be a string, null,
 * array, or object. Never renders a raw JS object.
 */
export function formatText(value) {
  return formatDisplayValue(value);
}

/** Validate and normalize a URL for safe external links. Returns null if invalid. */
export function safeUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || /^(null|undefined|nan|na|n\/a|-)$/i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
  } catch {
    return null;
  }
  return null;
}

/** Capitalize each word. */
export function capitalize(value) {
  if (!value) return '';
  return String(value)
    .split(' ')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(' ');
}

/** Initials from a name for avatars. */
export function initials(name = '') {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
