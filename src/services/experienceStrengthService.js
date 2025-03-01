// experienceService.js
import apiClient from './services';

const experienceStrengthService = {
  // Get all experiences for a specific user
  getAll() {
    return apiClient.get(`/experienceStrengths`);
  },
  
  // Get all experienceStrengths for a specific experience
  getAllForExperienceId(experienceId) {
    return apiClient.get(`/experienceStrengths/${experienceId}`);
  },
  
  // Create a new experienceStrength
  create(experienceStrengthData) {
    return apiClient.post('/experienceStrengths', experienceStrengthData);
  },
  
  // Update a specific experienceStrength
  update(id, experienceStrengthData) {
    return apiClient.put(`/experienceStrengths/${id}`, experienceStrengthData);
  },

  // Delete a specific experienceStrength
  delete(experienceId) {
    return apiClient.delete(`/experienceStrengths/${experienceId}`);
  },
};

export default experienceStrengthService;