// roleUserService.js
import apiClient from '../services/services';

const roleUser = {
  // Create a new role user
  createRoleUser(data) {
    return apiClient.post('/roleUser', data);
  },

  // Get a specific user by ID
  getStudentInfoByUserId(userId) {
    return apiClient.get(`/roleUser/user/${userId}`);
  },

  // Get all users with a specific role ID
  getUsersByRoleId(roleId) {
    return apiClient.get(`/roleUser/role/${roleId}/users`);
  }
};

export default roleUser;