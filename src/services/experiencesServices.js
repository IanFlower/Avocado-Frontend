// experienceService.js
import apiClient from './services';

const experienceService = {
  // Get all experiences for a specific user
  getAllExperiences() {
    return apiClient.get(`/experience`);
  },
  
  // Get a specific experience by ID
  getExperienceById(id) {
    return apiClient.get(`/experience/${id}`);
  },
  
  // Create a new experience
  createExperience(experienceData) {
    return apiClient.post('/experience', experienceData);
  },
  
  // Update a specific experience
  updateExperience(id, experienceData) {
    return apiClient.put(`/experience/${id}`, experienceData);
  },

  // Delete a specific experience
  deleteExperience(id) {
    return apiClient.delete(`/experience/${id}`);
  },
};

export default experienceService;