import { api } from './client';

/**
 * Student Premium API calls
 */
export function getStudentPremiumStatus() {
  return api('/student/premium/status');
}

export function requestStudentPremiumSubscription() {
  return api('/student/premium/subscribe', {
    method: 'POST',
  });
}

export function getStudentPremiumApplications() {
  return api('/student/premium-applications');
}

export function createStudentPremiumApplication(payload) {
  return api('/student/premium-applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function getStudentPremiumApplicationDetail(id) {
  return api(`/student/premium-applications/${id}`);
}

export function postStudentApplicationMessage(id, message) {
  return api(`/student/premium-applications/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}

export function getStudentVault() {
  return api('/student/premium-vault');
}

export function updateStudentVault(document_vault) {
  return api('/student/premium-vault', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_vault }),
  });
}

export function getStudentPaymentStatus() {
  return api('/student/payment/status');
}

export function submitStudentPayment(payload) {
  return api('/student/payment/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Admin Premium & Admin Management API calls
 */
export function getAdminMetrics() {
  return api('/admin/premium/dashboard');
}

export function getAdminList() {
  return api('/admin/admins');
}

export function createAdminUser(payload) {
  return api('/admin/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminUser(id) {
  return api(`/admin/admins/${id}`, {
    method: 'DELETE',
  });
}

export function updateStudentFeeStatus(userId, fee_status) {
  return api(`/admin/students/${userId}/fee-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fee_status }),
  });
}

export function getAdminPremiumMetrics() {
  return api('/admin/premium/dashboard');
}

export function getAdminPremiumApplications(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/admin/premium-applications${query ? `?${query}` : ''}`);
}


export function updateAdminApplicationStatus(id, payload) {
  return api(`/admin/premium-applications/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function postAdminApplicationMessage(id, message) {
  return api(`/admin/premium-applications/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}

export function getAdminPremiumSubscriptions(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/admin/premium-subscriptions${query ? `?${query}` : ''}`);
}

export function updateAdminUserSubscription(userId, payload) {
  return api(`/admin/premium-subscriptions/${userId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

