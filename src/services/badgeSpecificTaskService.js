// taskService.js
import apiClient from './services';

const badgeSpecificTaskService = {
  // Get all taskMajors for a specific task
  getAllForBadgeId(badgeId) {
    return apiClient.get(`/badgeSpecificTask/${badgeId}`);
  },
  
  // Create a new prerequisite task for a badge
  create(badgeSpecificTaskData) {
    return apiClient.post('/badgeSpecificTask', badgeSpecificTaskData);
  },
  
  // Delete a specific badge
  deleteByBadgeId(badgeId) {
    return apiClient.delete(`/badgeSpecificTask/${badgeId}`);
  },
};

export default badgeSpecificTaskService;