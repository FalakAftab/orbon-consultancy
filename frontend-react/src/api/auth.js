import { api, API_BASE } from './client';

export function setSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export async function login(payload) {
  return api('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  try {
    await api('/auth/logout', { method: 'POST' });
  } catch {
    // ignore and still clear client-side session
  }
}

export async function fetchMe() {
  return api('/auth/me');
}

/**
 * Perform an authenticated mutation against the auth endpoints.
 * Captures the full JSON body so field-level validation errors (422) and
 * the HTTP status code are available to the caller.
 */
async function authMutation(path, payload) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token') || '';
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(body && typeof body === 'object' && body.message
      ? body.message
      : `Request failed (${response.status})`);
    if (body && typeof body === 'object') {
      error.errors = body.errors || null;
    }
    error.statusCode = response.status;
    throw error;
  }

  return body;
}

export async function register(payload) {
  return authMutation('/auth/register', payload);
}

export async function forgotPassword(email) {
  return authMutation('/auth/forgot-password', { email });
}

export async function resetPassword(payload) {
  return authMutation('/auth/reset-password', payload);
}

/**
 * Public resend of the verification email, keyed by email address.
 * Works even when the user has no token (unverified users never get one).
 */
export async function resendVerificationEmail(email) {
  return authMutation('/auth/email/resend', { email });
}

export async function getSocialAuthUrl(provider) {
  return api(`/auth/${provider}/redirect`);
}
