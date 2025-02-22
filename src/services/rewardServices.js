// rewardService.js
import apiClient from '../services/services';

const rewardService = {
  // Get all rewards
  createReward(rewardData)
  {
    return apiClient.post('/reward', rewardData);
  },

  getAllrewards() {
    return apiClient.get('/reward');
  },

  getrewardById(rewardId) {
    return apiClient.get(`/reward/${rewardId}`);
  },

  updateRewardById(rewardId, rewardData)
  {
    return apiClient.put(`/reward/${rewardId}`, rewardData);
  },

  deleteRewardById(rewardId)
  {
    return apiClient.delete(`/reward/${rewardId}`);
  }
};

export default rewardService;
