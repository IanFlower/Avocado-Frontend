// eventService.js
import { apiClient } from './services.js';

const eventService = {
  // Get all events
  getAllEvents() {
    return apiClient.get('/event');
  },

  // Get a specific event by ID
  getEventById(eventId) {
    return apiClient.get(`/event/${eventId}`);
  },

  // Create new Event
  createEvent(eventData) {
    return apiClient.post(`/event/`, eventData);
  },
  
  // Edit a specific Event by ID and include new eventData
  editEvent(eventId, eventData) {
    return apiClient.put(`/event/${eventId}`, eventData)
  }
};

export default eventService;
