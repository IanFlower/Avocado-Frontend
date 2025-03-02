// experienceService.js
import apiClient from './services';

const experienceService = {
  // Get all experiences for a specific user
  getAll() {
    return apiClient.get(`/experience`);
  },
  
  // Get a specific experience by ID
  getById(id) {
    return apiClient.get(`/experience/${id}`);
  },
  
  // Create a new experience
  create(experienceData) {
    return apiClient.post('/experience', experienceData);
  },
  
  // Update a specific experience
  update(id, experienceData) {
    return apiClient.put(`/experience/${id}`, experienceData);
  },

  // Delete a specific experience
  delete(id) {
    return apiClient.delete(`/experience/${id}`);
  },
};

export default experienceService;