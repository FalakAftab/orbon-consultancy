export const API_BASE = 'http://127.0.0.1:8000/api/v1';

function getToken() {
  return localStorage.getItem('token') || '';
}

export async function api(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (getToken()) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === 'object' && body ? body.message || JSON.stringify(body) : body;
    const error = new Error(message || `Request failed (${response.status})`);
    error.statusCode = response.status;
    if (typeof body === 'object' && body) {
      // Surface extra fields (e.g. needs_verification, email, errors) so
      // callers can branch on them instead of just the message string.
      error.body = body;
    }
    throw error;
  }

  return body;
}
