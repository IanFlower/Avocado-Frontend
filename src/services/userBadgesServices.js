// userBadges.js
import apiClient from './services.js';

const userBadgesServices = {
  // Get all userBadges
  getAll() {
    return apiClient.get('/studentInfoBadge');
  },
  checkUserBadges(studentInfo) {
    return apiClient.get(`/studentInfoBadge/checkUserBadges/${studentInfo}`);
  },
  // Get a specific userBadge by ID
  getByStudentId(studentInfoId) {
    return apiClient.get(`/studentInfoBadge/${studentInfoId}`);
  },

  createStudentBadge(userBadgeData) {
    return apiClient.post(`/studentInfoBadge/`, userBadgeData);
  },

  deleteType(userBadgeId) {
    return apiClient.delete(`/studentInfoBadge/${userBadgeId}`);
  }
};

export default userBadgesServices;
