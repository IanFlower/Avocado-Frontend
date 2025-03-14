// experienceService.js
import apiClient from './services';

const leaderboardService = {
  getAll() {
    return apiClient.get(`/leaderboard`);
  },
};

export default leaderboardService;