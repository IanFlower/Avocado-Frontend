// eventTypeService.js
import apiClient from '../services/services';

const eventTypeServices = {
  // Create a new type event
  createEventType(data) {
    return apiClient.post('/eventType', data);
  },
  
  // Get type information by event ID
  getAllEventTypes() {
    return apiClient.get(`/eventType/`);
  },

  // Get type information by event ID
  getTypeByEventId(eventId) {
    return apiClient.get(`/eventType/typeInfo/${eventId}`);
  },

  // Get all events with a specific type ID
  getEventsByTypeId(typeId) { 
    return apiClient.get(`/eventType/type/${typeId}/events`);
  },
  
  // Get all events with a specific type ID
  getEventTypeByEventId(eventId) { 
    return apiClient.get(`/eventType/event/${eventId}/`);
  },

  // Update event type
  updateEventType(eventId, typeId) {
    return apiClient.put(`/eventType/${eventId}/type`, { typeId });
  },

  // Delete event type
  deleteEventType(eventTypeId) {
    return apiClient.delete(`/eventType/${eventTypeId}`);
  },

  // Delete all event type for a given type
  deleteEventTypeByEventId(eventId) {
    return apiClient.delete(`/eventType/byEvent/${eventId}`);
  }
};

export default eventTypeServices;