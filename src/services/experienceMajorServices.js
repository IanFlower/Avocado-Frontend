// experienceService.js
import apiClient from './services';

const experienceMajorService = {
  // Get all experiences for a specific user
  getAll() {
    return apiClient.get(`/experienceMajors`);
  },
  
  // Get all experienceMajors for a specific experience
  getAllForExperienceId(experienceId) {
    return apiClient.get(`/experienceMajors/${experienceId}`);
  },
  
  // Create a new experienceMajor
  create(experienceMajorData) {
    return apiClient.post('/experienceMajors', experienceMajorData);
  },
  
  // Update a specific experienceMajor
  update(id, experienceMajorData) {
    return apiClient.put(`/experienceMajors/${id}`, experienceMajorData);
  },

  // Delete a specific experienceMajor
  delete(experienceId) {
    return apiClient.delete(`/experienceMajors/${experienceId}`);
  },
};

export default experienceMajorService;