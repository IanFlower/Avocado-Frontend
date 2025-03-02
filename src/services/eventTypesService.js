// eventService.js
import apiClient from './services';

const eventTypeService = {
  // Get all events type for a specific user
  getAll() {
    return apiClient.get(`/eventType`);
  },
  
  // Get a specific event type by ID
  getById(id) {
    return apiClient.get(`/eventType/${id}`);
  },
  
  // Create a new event type
  create(eventData) {
    return apiClient.post('/eventType', eventData);
  },
  
  // Update a specific event type
  update(id, eventData) {
    return apiClient.put(`/eventType/${id}`, eventData);
  },

  // Delete a specific event type
  delete(id) {
    return apiClient.delete(`/eventType/${id}`);
  },
};

export default eventTypeService;