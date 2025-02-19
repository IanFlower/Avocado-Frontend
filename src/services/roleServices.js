// roleUserService.js
import apiClient from '../services/services';

const role = {
    // Create a new role user
    createRole(data) {
        return apiClient.post('/role', data);
    },
    // Get a role by ID
    getRoleById(roleId) {
        return apiClient.get(`role/${roleId}`);
    },
    // Get all roles
    getRoles() {
        return apiClient.get('/roles')
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching roles:", error); 
                throw error;
            });
    },
};

export default role;