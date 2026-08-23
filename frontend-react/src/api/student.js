import { api } from './client';

/**
 * Student data services mapping to real Laravel API endpoints (backend/routes/api.php).
 */

/** GET /v1/student/profile -> { profile } */
export function fetchStudentProfile() {
  return api('/student/profile');
}

/** POST /v1/student/profile -> update profile (multipart for MOI cert) */
export function updateStudentProfile(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, value);
      }
    }
  });
  return api('/student/profile', {
    method: 'POST',
    body: formData,
  });
}

/** GET /v1/recommendations/history?per_page=.. -> { data, meta } */
export function fetchRecommendationHistory(perPage = 5) {
  return api(`/recommendations/history?per_page=${perPage}`);
}

/** GET /v1/recommendations/history/{id} -> single history entry detail */
export function fetchRecommendationHistoryDetail(id) {
  return api(`/recommendations/history/${id}`);
}

/** POST /v1/recommendations -> real RecommendationService output */
export function submitRecommendation(payload) {
  return api('/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** GET /v1/shortlist -> { data } */
export function fetchShortlist() {
  return api('/shortlist');
}

/** POST /v1/shortlist -> add to shortlist */
export function saveShortlist(programId) {
  return api('/shortlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ program_id: programId }),
  });
}

/** DELETE /v1/shortlist/{id} -> remove from shortlist */
export function removeShortlist(shortlistId) {
  return api(`/shortlist/${shortlistId}`, {
    method: 'DELETE',
  });
}

/** PATCH /v1/shortlist/{id}/status -> update status */
export function updateShortlistStatus(shortlistId, status) {
  return api(`/shortlist/${shortlistId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

/** GET /v1/favorites -> paginated favorites */
export function fetchFavorites(perPage = 50) {
  return api(`/favorites?per_page=${perPage}`);
}

/** POST /v1/favorites -> add university favorite */
export function saveFavorite(universityId) {
  return api('/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ university_id: universityId }),
  });
}

/** DELETE /v1/favorites/{id} -> remove favorite */
export function removeFavorite(favoriteId) {
  return api(`/favorites/${favoriteId}`, {
    method: 'DELETE',
  });
}

/** GET /v1/programs?per_page=.. -> paginated programs */
export function fetchPrograms(perPage = 50) {
  return api(`/programs?per_page=${perPage}`);
}

/** GET /v1/programs?params -> search programs with filters */
export function searchPrograms(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/programs${query ? `?${query}` : ''}`);
}

/** GET /v1/programs/{id} -> single program with university */
export function fetchProgramDetail(id) {
  return api(`/programs/${id}`);
}

/** GET /v1/universities?per_page=.. -> paginated universities */
export function fetchUniversities(perPage = 50) {
  return api(`/universities?per_page=${perPage}`);
}

/** GET /v1/universities?params -> search universities with filters */
export function searchUniversities(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/universities${query ? `?${query}` : ''}`);
}

/** GET /v1/universities/{id} -> single university with programs */
export function fetchUniversityDetail(id) {
  return api(`/universities/${id}`);
}

/** POST /v1/shortlist/{id}/notes -> add note */
export function addShortlistNote(shortlistId, note) {
  return api(`/shortlist/${shortlistId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });
}
