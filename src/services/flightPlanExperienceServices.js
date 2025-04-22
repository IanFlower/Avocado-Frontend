// flightPlanExperienceService.js
import apiClient from './services';

const flightPlanExperienceService = {
  // Get all flightPlanExperiences for a specific user
  getAllFlightPlanExperiences() {
    return apiClient.get(`/flightPlanExperience`);
  },

  // Get a specific flightPlanExperience by ID
  getFlightPlanExperienceById(id) {
    return apiClient.get(`/flightPlanExperience/${id}`);
  },

   // Get a specific flightPlanExperience by userId
   getFlightPlanExperienceByUserId(id) {
    return apiClient.get(`/flightPlanExperience/byUser/${id}`);
  },
  
  // Get all flightPlanTasks for a specific user
  getAllPendingFlightPlanExperiences() {
    return apiClient.get(`/flightPlanExperience/pending/experiences`);
  },
  
   // Get specific events by experience
   getEventsByExperience(id) {
    return apiClient.get(`/flightPlanExperience/events/byExperience/${id}`);
  },

  // Set attended in flightplanexperiences to true for this eventType
  attendExperiencesByEvent(type) {
    return apiClient.put(`/flightPlanExperience/byEventType/${type}}`);
  },

  // Create a new flightPlanExperience
  createFlightPlanExperience(flightPlanExperienceData) {
    return apiClient.post('/flightPlanExperience', flightPlanExperienceData);
  },

  // Create a new flightPlanExperience
  approveFlightPlanExperience(id) {
    return apiClient.post(`/flightPlanExperience/approve/${id}`);
  },

  // Update a specific flightPlanExperience
  updateFlightPlanExperience(id, flightPlanExperienceData) {
    return apiClient.put(`/flightPlanExperience/${id}`, flightPlanExperienceData);
  },

  // Delete a specific flightPlanExperience
  deleteFlightPlanExperience(id) {
    return apiClient.delete(`/flightPlanExperience/${id}`);
  },
};

export default flightPlanExperienceService;