// notificationService.js
import apiClient from './services';

const notificationService = {
  // Get all notifications for a specific user
  getAllNotifications() {
    return apiClient.get(`/notification`);
  },
  
  // Get a specific notification by ID
  getNotificationById(id) {
    return apiClient.get(`/notification/${id}`);
  },
  
  // Get a specific notification by ID
  getByUser() {
    return apiClient.get(`/notification/by/user/`);
  },

  // Create a new notification
  createNotification(notificationData) {
    return apiClient.post('/notification', notificationData);
  },
  
  // Update a specific notification
  updateNotification(id, notificationData) {
    return apiClient.put(`/notification/${id}`, notificationData);
  },

  // Delete a specific notification
  deleteNotification(id) {
    return apiClient.delete(`/notification/${id}`);
  },
};

export default notificationService;