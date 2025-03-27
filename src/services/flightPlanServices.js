// flightPlanService.js
import apiClient from './services';

const flightPlanService = {
  // Get all flightPlans for a specific user
  getAllFlightPlans() {
    return apiClient.get(`/flightPlan`);
  },

  // Get a specific flightPlan by ID
  getFlightPlanById(id) {
    return apiClient.get(`/flightPlan/${id}`);
  },

   // Get a specific flightPlan by userId
   getFlightPlanByUserId(id) {
    return apiClient.get(`/flightPlan/byUser/${id}`);
  },

  // Create a new flightPlan
  createFlightPlan() {
    return apiClient.post('/flightPlan');
  },

  // Update a specific flightPlan
  updateFlightPlan(id, flightPlanData) {
    return apiClient.put(`/flightPlan/${id}`, flightPlanData);
  },

  // Delete a specific flightPlan
  deleteFlightPlan(id) {
    return apiClient.delete(`/flightPlan/${id}`);
  },
};

export default flightPlanService;