// cliftonStrengthService.js
import { apiClient } from './services.js';

const cliftonStrengthService = {
  // Get all clifton strengths for a specific user
  getAllCliftonStrengths() {
    return apiClient.get(`/strength`);
  },
  
  // Get a specific clifton strength by ID
  getCliftonStrengthById(id) {
    return apiClient.get(`/strength/${id}`);
  },
  
  // Create a new clifton strength
  createCliftonStrength(cliftonStrengthData) {
    return apiClient.post('/strength', cliftonStrengthData);
  },
  
  // Update a specific clifton strength
  updateCliftonStrength(id, cliftonStrengthData) {
    return apiClient.put(`/strength/${id}`, cliftonStrengthData);
  },

  // Delete a specific clifton strength
  deleteCliftonStrength(id) {
    return apiClient.delete(`/strength/${id}`);
  },
};

export default cliftonStrengthService;