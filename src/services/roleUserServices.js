// roleUserService.js
import apiClient from '../services/services';

const roleUserServices = {
  // Create a new role user
  createRoleUser(data) {
    return apiClient.post('/roleUser', data);
  },

  // Get role information by user ID
  getRoleByUserId(userId) {
    return apiClient.get(`/roleUser/roleInfo/${userId}`);
  },

  // Get a specific user by ID
  getStudentInfoByUserId(userId) {
    return apiClient.get(`/roleUser/user/${userId}`);
  },

  // Get all users with a specific role ID
  getUsersByRoleId(roleId) { 
    return apiClient.get(`/roleUser/role/${roleId}/users`);
  },

  // Update user role
  updateUserRole(userId, roleId) {
    return apiClient.put(`/roleUser/${userId}/role`, { roleId });
  }
};

export default roleUserServices;