import { api } from './client';

/**
 * GET /v1/notifications -> Fetch notifications & unread count
 */
export function getNotifications() {
  return api('/notifications');
}

/**
 * POST /v1/notifications/{id}/read -> Mark a single notification as read
 */
export function markNotificationAsRead(id) {
  return api(`/notifications/${id}/read`, {
    method: 'POST',
  });
}

/**
 * POST /v1/notifications/mark-all-read -> Mark all notifications as read
 */
export function markAllNotificationsAsRead() {
  return api('/notifications/mark-all-read', {
    method: 'POST',
  });
}
