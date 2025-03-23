import apiClient from './services';

const prerequisiteService = {
  // Get all prerequisite
  getAll() {
    return apiClient.get(`/prerequisite`);
  },
  
  // Get all prerequisite for a specific task
  getAllForId(id) {
    return apiClient.get(`/prerequisite/${id}`);
  },
  
  // Get all prerequisite for a specific task
  getAllForTaskId(taskId, flightPlanId) {
    return apiClient.get(`/prerequisite/byTask/${taskId}/${flightPlanId}`);
  },

  // Get all prerequisite for a specific task
  getAllForPrerequisiteId(taskId) {
    return apiClient.get(`/prerequisite/byPrerequisite/${taskId}`);
  },
  
  // Create a new prerequisite
  create(prerequisiteData) {
    return apiClient.post('/prerequisite', prerequisiteData);
  },
  
  // Update a specific prerequisite
  update(id, prerequisiteData) {
    return apiClient.put(`/prerequisite/${id}`, prerequisiteData);
  },

  // Delete a specific prerequisite
  delete(taskId) {
    return apiClient.delete(`/prerequisite/${taskId}`);
  },
};

export default prerequisiteService;