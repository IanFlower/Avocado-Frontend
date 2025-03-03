// taskService.js
import apiClient from './services';
const taskStrengthService = {
  // Get all tasks for a specific user
  getAll() {
    return apiClient.get(`/taskStrengths`);
  },
  
  // Get all taskStrengths for a specific task
  getAllForTaskId(taskId) {
    return apiClient.get(`/taskStrengths/${taskId}`);
  },
  
  // Create a new taskStrength
  create(taskStrengthData) {
    return apiClient.post('/taskStrengths', taskStrengthData);
  },
  
  // Update a specific taskStrength
  update(id, taskStrengthData) {
    return apiClient.put(`/taskStrengths/${id}`, taskStrengthData);
  },

  // Delete a specific taskStrength
  delete(taskId) {
    return apiClient.delete(`/taskStrengths/${taskId}`);
  },
};

export default taskStrengthService;