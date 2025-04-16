// logService.js
import apiClient from './services';

const logService = {
    // Create a new notification
    createLog(data) {
      return apiClient.post('/log', data);
    },
  // Get all notifications for a specific user
  getAllLogs() {
    return apiClient.get(`/log`);
  },


  // Delete a specific notification
  deleteLog(id) {
    return apiClient.delete(`/log/${id}`);
  },
};

export default logService;