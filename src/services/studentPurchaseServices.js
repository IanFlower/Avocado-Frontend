import apiClient from '../services/services';

const studentPurchaseService = {

  getRecentPurchases(userId) {
     return apiClient.get(`/studentPurchase/recent/${userId}`);
  },

  // Create a new reward purchase for a student
  createPurchase(userId, rewardId) {
    return apiClient.post('/studentPurchase', userId, rewardId);
  }
  
};

export default studentPurchaseService;
