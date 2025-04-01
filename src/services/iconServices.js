import Axios from 'axios';
import Utils from '../config/utils.js';
import {apiImageClient} from '../services/services';

var baseurl = "";
if (import.meta.env.DEV) {
  baseurl = "http://localhost:3032/flight-plan-t2/";
} else {
  baseurl = "/flight-plan-t2/";
}

const iconService = {


  getIconByFile(iconId) {
    return apiImageClient.get(`/icon/${iconId}`);
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

    return Axios.post(`${baseurl}icon/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${Utils.getStore('token')}`,
        'Access-Control-Allow-Origin': '*',
        crossDomain: true
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
