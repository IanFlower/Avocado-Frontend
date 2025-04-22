// flightPlanTaskService.js
import apiClient from './services';

const flightPlanTaskService = {
  // Get all flightPlanTasks for a specific user
  getAllFlightPlanTasks() {
    return apiClient.get(`/flightPlanTask`);
  },

  // Get all flightPlanTasks for a specific user
  getAllPendingFlightPlanTasks() {
    return apiClient.get(`/flightPlanTask/pending/tasks`);
  },

  // Get a specific flightPlanTask by ID
  getFlightPlanTaskById(id) {
    return apiClient.get(`/flightPlanTask/${id}`);
  },

  // Get a specific flightPlanTask by userId
  getFlightPlanTaskByUserId(id) {
    return apiClient.get(`/flightPlanTask/byUser/${id}`);
  },

  // Get all tasks from selected semester through current
  getFlightPlanTaskByUserIdFromSemester(id, semester) {
    return apiClient.get(`/flightPlanTask/byUser/${id}/fromSemester?semester=${semester}`);
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
