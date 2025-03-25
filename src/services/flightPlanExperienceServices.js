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

  // Create a new flightPlanExperience
  createFlightPlanExperience(flightPlanExperienceData) {
    return apiClient.post('/flightPlanExperience', flightPlanExperienceData);
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