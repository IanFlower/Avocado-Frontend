import apiClient from '../services/services';

const studentPurchaseService = {
  // Get the last 3 purchases for a specific student
  getRecentPurchases(userId) {
    return apiClient.get(`/studentPurchases/recent/${userId}`);
  },
};

export default studentPurchaseService;
