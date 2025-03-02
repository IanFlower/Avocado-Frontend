// taskService.js
import apiClient from './services';

const taskMajorService = {
  // Get all tasks for a specific user
  getAll() {
    return apiClient.get(`/taskMajors`);
  },
  
  // Get all taskMajors for a specific task
  getAllForTaskId(taskId) {
    return apiClient.get(`/taskMajors/${taskId}`);
  },
  
  // Create a new taskMajor
  create(taskMajorData) {
    return apiClient.post('/taskMajors', taskMajorData);
  },
  
  // Update a specific taskMajor
  update(id, taskMajorData) {
    return apiClient.put(`/taskMajors/${id}`, taskMajorData);
  },

  // Delete a specific taskMajor
  delete(taskId) {
    return apiClient.delete(`/taskMajors/${taskId}`);
  },
};

export default taskMajorService;