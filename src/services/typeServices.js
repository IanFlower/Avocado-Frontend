// typeService.js
import apiClient from './services.js';

const typeService = {
  // Get all types
  getAllTypes() {
    return apiClient.get('/type');
  },

  // Get a specific type by ID
  getTypeById(typeId) {
    return apiClient.get(`/type/${typeId}`);
  },

  // Create new Type
  createType(typeData) {
    return apiClient.post(`/type/`, typeData);
  },
  
  // Edit a specific Type by ID and include new typeData
  editType(typeId, typeData) {
    return apiClient.put(`/type/${typeId}`, typeData)
  }
};

export default typeService;
