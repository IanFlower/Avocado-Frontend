// permissionService.js
import apiClient from '../services/services';

const permission = {

    // Create a new permission
    createPermission(data) {
        return apiClient.post('/permission/', data);
    },
    // Get permissions by user ID
    findByUser(userId) {
        return apiClient.get(`/permission/${userId}`);
    },
    // Update permissions by user ID
    updateByUserId(userId, data) {
        return apiClient.put(`/permission/${userId}`, data);
    }
};

export default permission;