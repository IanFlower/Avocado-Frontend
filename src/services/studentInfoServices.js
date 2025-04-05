// studentInfoServices.js
import apiClient from '../services/services';

const studentInfoServices = {
  createStudentInfo(data) {
    return apiClient.post ('/studentInfo', data);   
  },
  updateStudentInfo(userId,data) {
    return apiClient.put (`/studentInfo/${userId}`, data); 
  },
  getStudentInfoBySID(sid) {  
    return apiClient.get(`/studentInfo/sid/${sid}`);
  },
   getStudentInfoById(userId) {  
    return apiClient.get(`/studentInfo/user/${userId}`);
  }
};

export default studentInfoServices;