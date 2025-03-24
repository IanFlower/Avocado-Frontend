// flightPlanTaskService.js
import apiClient from './services';

const flightPlanTaskService = {
  // Get all flightPlanTasks for a specific user
  getAllFlightPlanTasks() {
    return apiClient.get(`/flightPlanTask`);
  },
  
  // Get a specific flightPlanTask by ID
  getFlightPlanTaskById(id) {
    return apiClient.get(`/flightPlanTask/${id}`);
  },

   // Get a specific flightPlanTask by userId
   getFlightPlanTaskByUserId(id) {
    return apiClient.get(`/flightPlanTask/byUser/${id}`);
  },
  
  // Create a new flightPlanTask
  createFlightPlanTask(flightPlanTaskData) {
    return apiClient.post('/flightPlanTask', flightPlanTaskData);
  },
  
  // Update a specific flightPlanTask
  updateFlightPlanTask(id, flightPlanTaskData) {
    return apiClient.put(`/flightPlanTask/${id}`, flightPlanTaskData);
  },

  // Delete a specific flightPlanTask
  deleteFlightPlanTask(id) {
    return apiClient.delete(`/flightPlanTask/${id}`);
  },
};

export default flightPlanTaskService;