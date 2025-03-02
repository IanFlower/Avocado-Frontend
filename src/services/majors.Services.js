// majorService.js
import apiClient from './services';

const majorService = {
  // Get all majors for a specific user
  getAllMajors() {
    return apiClient.get(`/major`);
  },
  
  // Get a specific major by ID
  getMajorById(id) {
    return apiClient.get(`/major/${id}`);
  },
  
  // Create a new major
  createMajor(majorData) {
    return apiClient.post('/major', majorData);
  },
  
  // Update a specific major
  updateMajor(id, majorData) {
    return apiClient.put(`/major/${id}`, majorData);
  },

  // Delete a specific major
  deleteMajor(id) {
    return apiClient.delete(`/major/${id}`);
  },
};

export default majorService;