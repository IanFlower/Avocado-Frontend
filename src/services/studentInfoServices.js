// studentInfoServices.js
import apiClient from '../services/services';

const studentInfoServices = {
  createStudentInfo() {
    return apiClient.post ('/studentInfo');   
  },

   getStudentInfoById(userId) {  
    return apiClient.get(`/user/${userId}`);
  }
};

export default studentInfoServices;