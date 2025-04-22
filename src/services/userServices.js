// userService.js
import apiClient from './services.js';

const userService = {
  // Get all users
  getAllUsers() {
    return apiClient.get('/user');
  },
  UpdateUsersFirstLogin(userId) {
    return apiClient.get(`/user/firstLogin/${userId}`);
  },

  // Get all users that want to be admin
  getWantToBeAdminUsers() {
    return apiClient.get('/user/wantToBeAdmin/all');  
  },
  //get all the requests from users
  getAllRequestsFromUsers() {
    return apiClient.get('/user/get/requests/getAllRequests');  
  },

  // Get a specific user by ID
  getUserById(userId) {
    return apiClient.get(`/user/${userId}`);
  },
  changeTheme(){
    return apiClient.post(`/user/changeTheme`);
  } ,
  getApprovalUsers() {
    return apiClient.get('/user/get/approval/space/getAllApprovals');  
  },
};

export default userService;
