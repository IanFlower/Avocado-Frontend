// taskService.js
import apiClient from './services';

const taskService = {
  // Get all tasks for a specific user
  getAll() {
    return apiClient.get(`/task`);
  },
  
  // Get a specific task by ID
  getById(id) {
    return apiClient.get(`/task/${id}`);
  },
  
  // Create a new task
  create(taskData) {    
    return apiClient.post('/task', taskData);
  },
  
  // Update a specific task
  update(id, taskData) {
    return apiClient.put(`/task/${id}`, taskData);
  },

  // Delete a specific task
  delete(id) {
    return apiClient.delete(`/task/${id}`);
  },
};

export default taskService;