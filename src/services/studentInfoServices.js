// studentInfoServices.js
import apiClient from '../services/services';

const studentInfoServices = {
  createStudentInfo(data) {
    return apiClient.post ('/studentInfo', data);   
  },

   getStudentInfoById(userId) {  
    return apiClient.get(`/studentInfo/user/${userId}`);
  }
};

export default studentInfoServices;