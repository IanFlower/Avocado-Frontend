// rewardService.js
import apiClient from '../services/services';

const rewardService = {
  // Get all rewards
  getAllRewards() {
    return apiClient.get('/reward');
  },

  // Get a specific reward by ID
  getRewardById(rewardId) {
    return apiClient.get(`/reward/${rewardId}`);
  },

  //creates a new reward
  addReward(reward)
  {
    return apiClient.post(`/reward/`, reward);
  },

  updateReward(reward) {
    return apiClient.put(`/reward/${reward.id}`, reward); 
  },
  

  DeleteReward(rewardId)
  {
    return apiClient.delete(`/reward/${rewardId}`);
  }
};

export default rewardService;