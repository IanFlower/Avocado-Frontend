import { Axios } from 'axios';
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
    formData.append('image', icon.image);
    formData.append('forBadge', icon.forBadge);

    return Axios.post('http://localhost:3032/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
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
