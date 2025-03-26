import Axios from 'axios';
import apiClient from '../services/services';

const iconService = {
  getAllIcons() {
    return apiClient.get('/icon');
  },

  getIconById(iconId) {
    return apiClient.get(`/icon/${iconId}`);
  },

  addIcon(icon) {
    const formData = new FormData();

    
    if (!icon.image || !(icon.image instanceof File)) {
      console.error("Invalid file object:", icon.image);
      throw new Error("Invalid file object");
    }

    formData.append('image', icon.image);
    formData.append('forBadge', icon.forBadge);

    console.log("FormData before sending:", formData);

    return Axios.post('http://localhost:3032/flight-plan-t2/icon/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error during file upload:", error);
        throw error;
      });
  },


  updateIcon(icon) {
    return apiClient.put(`/icon/${icon.id}`, icon);
  },

  DeleteIcon(iconId) {
    return apiClient.delete(`/icon/${iconId}`);
  }
};

export default iconService;
