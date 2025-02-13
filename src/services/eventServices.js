// eventService.js
import apiClient from './services.js';

const eventService = {
  // Get all events
  getAllEvents() {
    return apiClient.get('/event');
  },

  // Get a specific event by ID
  getEventById(eventId) {
    return apiClient.get(`/event/${eventId}`);
  },

  // Get a specific event by ID
  createEvent(eventData) {
    return apiClient.post(`/event/`, eventData);
  }  
};

export default eventService;
