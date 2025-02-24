// rewardService.js
import apiClient from '../services/services';

const rewardService = {
  // Get all rewards
  getAllrewards() {
    return apiClient.get('/reward');
  },

  // Get a specific reward by ID
  getrRewardById(rewardId) {
    return apiClient.get(`/reward/${rewardId}`);
  },

  //creates a new reward
  addReward(reward)
  {
    return apiClient.post(`/reward/`, reward);
  },

  updateReward(rewardId)
  {
    return apiClient.put(`/reward/${rewardId}`);
  },

  DeleteReward(rewardId)
  {
    return apiClient.delete(`/reward/${rewardId}`);
  }
};

export default rewardService;