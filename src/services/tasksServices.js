// taskService.js
import apiClient from './services';

const taskService = {
  // Get all tasks for a specific user
  getAllTasks() {
    return apiClient.get(`/task`);
  },
  
  // Get a specific task by ID
  getTaskById(id) {
    return apiClient.get(`/task/${id}`);
  },
  
  // Create a new task
  createTask(taskData) {    
    return apiClient.post('/task', taskData);
  },
  
  // Update a specific task
  updateTask(id, taskData) {
    return apiClient.put(`/task/${id}`, taskData);
  },

  // Delete a specific task
  deleteTask(id) {
    return apiClient.delete(`/task/${id}`);
  },
};

export default taskService;