// userService.js
import apiClient from './services.js';

const userService = {
  // Get all users
  getAllUsers() {
    return apiClient.get('/user');
  },

  // Get a specific user by ID
  getUserById(userId) {
    return apiClient.get(`/user/${userId}`);
  }
};

export default userService;
