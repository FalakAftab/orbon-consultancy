import { api } from './client';

/**
 * Admin data services mapping to real Laravel admin endpoints
 * (backend/routes/api.php — admin prefix, auth:sanctum + admin middleware).
 */

/** GET /v1/admin/dashboard -> { students, admins, universities, programs, ... } */
export function fetchAdminDashboard() {
  return api('/admin/dashboard');
}

export function clearSystemCache() {
  return api('/admin/settings/clear-cache', { method: 'POST' });
}

export function updateAdminProfile(payload) {
  return api('/admin/settings/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

/** GET /v1/admin/students?search=&per_page= -> paginated students */
export function fetchAdminStudents(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/admin/students${query ? `?${query}` : ''}`);
}

/** POST /v1/admin/students -> admin creates a student account */
export function createAdminStudent(payload) {
  return api('/admin/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** POST /v1/admin/students/{id}/recommendations -> run the recommendation
 * engine for the selected student (result is associated with that student,
 * not the logged-in admin). Reuses the same RecommendationService. */
export function createRecommendationForStudent(studentId, payload) {
  return api(`/admin/students/${studentId}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** PUT /v1/admin/students/{id} -> update student */
export function updateAdminStudent(id, payload) {
  return api(`/admin/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** DELETE /v1/admin/students/{id} -> delete student */
export function deleteAdminStudent(id) {
  return api(`/admin/students/${id}`, { method: 'DELETE' });
}

/** GET /v1/universities?params -> admin uses same index endpoint */
export function fetchAdminUniversities(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/universities${query ? `?${query}` : ''}`);
}

/** POST /v1/admin/universities -> create university */
export function createUniversity(payload) {
  return api('/admin/universities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** PUT /v1/admin/universities/{id} -> update university */
export function updateUniversity(id, payload) {
  return api(`/admin/universities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** DELETE /v1/admin/universities/{id} -> delete university */
export function deleteUniversity(id) {
  return api(`/admin/universities/${id}`, { method: 'DELETE' });
}

/** GET /v1/programs?params -> admin uses same index endpoint */
export function fetchAdminPrograms(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/programs${query ? `?${query}` : ''}`);
}

/** POST /v1/admin/programs -> create program */
export function createProgram(payload) {
  return api('/admin/programs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** PUT /v1/admin/programs/{id} -> update program */
export function updateProgram(id, payload) {
  return api(`/admin/programs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** DELETE /v1/admin/programs/{id} -> delete program */
export function deleteProgram(id) {
  return api(`/admin/programs/${id}`, { method: 'DELETE' });
}

/**
 * POST /v1/admin/imports -> upload DAAD/Excel workbook (multipart).
 * Returns { message, import, errors }.
 */
export function uploadImport(file) {
  const formData = new FormData();
  formData.append('file', file);
  return api('/admin/imports', {
    method: 'POST',
    body: formData,
  });
}

/** POST /v1/admin/imports/temporary -> import the bundled temporary dataset */
export function uploadTemporaryImport() {
  return api('/admin/imports/temporary', { method: 'POST' });
}

/** GET /v1/admin/exports?type=universities|programs -> download (returns blob) */
export async function exportData(type) {
  const token = localStorage.getItem('token') || '';
  const response = await fetch(`http://127.0.0.1:8000/api/v1/admin/exports?type=${type}`, {
    method: 'GET',
    headers: {
      Accept:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Export failed (${response.status})`);
  }
  return response.blob();
}
