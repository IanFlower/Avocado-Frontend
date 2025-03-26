// iconService.js
import apiClient from '../services/services';

const IconService = {
  // Get all icons
  getAllIcons() {
    return apiClient.get('/icon');
  },

  // Get a specific icon by ID
  getIconById(iconId) {
    return apiClient.get(`/icon/${iconId}`);
  },

  //creates a new icon
  addIcon(icon)
  {
    return apiClient.post(`/icon/`, icon);
  },

  updateIcon(icon) {
    return apiClient.put(`/icon/${icon.id}`, icon); 
  },
  

  DeleteIcon(iconId)
  {
    return apiClient.delete(`/icon/${iconId}`);
  }
};

export default IconService;