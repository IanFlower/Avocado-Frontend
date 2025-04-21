// experienceService.js
import apiClient from './services';

const badgeSpecificExperienceService = {
  // Get all experienceMajors for a specific experience
  getAllForBadgeId(badgeId) {
    return apiClient.get(`/badgeSpecificExperience/${badgeId}`);
  },
  
  // Create a new prerequisite experience for a badge
  create(badgeSpecificExperienceData) {
    return apiClient.post('/badgeSpecificExperience', badgeSpecificExperienceData);
  },
  
  // Delete a specific badge
  deleteByBadgeId(badgeId) {
    return apiClient.delete(`/badgeSpecificExperience/${badgeId}`);
  },
};

export default badgeSpecificExperienceService;