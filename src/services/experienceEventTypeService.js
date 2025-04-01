// experienceService.js
import { apiClient } from './services.js';

const experienceEventTypeService = {
  // Get all experiences for a specific user
  getAll() {
    return apiClient.get(`/experienceEventType`);
  },
  
  // Get all experienceEventTypes for a specific experience
  getAllForExperienceId(experienceId) {
    return apiClient.get(`/experienceEventType/${experienceId}`);
  },
  
  // Create a new experienceEventType
  create(experienceEventTypeData) {
    return apiClient.post('/experienceEventType', experienceEventTypeData);
  },
  
  // Update a specific experienceEventType
  update(id, experienceEventTypeData) {
    return apiClient.put(`/experienceEventType/${id}`, experienceEventTypeData);
  },

  // Delete a specific experienceEventType
  delete(experienceId) {
    return apiClient.delete(`/experienceEventType/${experienceId}`);
  },
};

export default experienceEventTypeService;