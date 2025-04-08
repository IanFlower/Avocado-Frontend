import apiClient from '../services/services';

const studentPurchaseService = {
  // Get the last 3 purchases for a specific student
  async getRecentPurchases(userId) {
    try {
      const response = await apiClient.get(`/studentPurchase/recent/${userId}`);
      return response.data;  // Ensure you return the response data
    } catch (error) {
      console.error('Error fetching recent purchases:', error);
      throw error;  // Re-throw error to be handled by the calling code
    }
  },

  // Create a new reward purchase for a student
  async createPurchase(purchaseData) {
    try {
      const response = await apiClient.post('/studentPurchase', purchaseData);
      console.log('Purchase Response:', response);
      return response.data;  // Return only the response data
    } catch (error) {
      // Log detailed error info for debugging
      if (error.response) {
        console.error('Error Response:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      throw error;  // Re-throw the error to be handled in the calling code
    }
  },
};

export default studentPurchaseService;
