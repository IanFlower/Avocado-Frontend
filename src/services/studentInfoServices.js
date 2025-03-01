// userService.js
import apiClient from '../services/services';

const studentInfoServices = {
  // Get all users
  createStudentInfo() {
    return apiClient.get('');
  },

  // Get a specific user by ID
  getStudentIfoByUserId(userId) {
    return apiClient.get(`/user/${userId}`);
  }
};

export default studentInfoServices;