// rewardService.js
import apiClient from '../services/services';

const rewardService = {
  // Get all rewards
  getAllrewards() {
    return apiClient.get('/reward');
  },

  // Get a specific reward by ID
  getrewardById(rewardId) {
    return apiClient.get(`/reward/${rewardId}`);
  },

  AddReward(reward)
  {
    return apiClient.post(`/reward/`, reward);
  }
};

export default rewardService;