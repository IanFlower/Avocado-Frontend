// experienceService.js
import apiClient from './services';

const leaderboardService = {
  getSortedStudentsByClass(userId) {
    return apiClient.get(`/leaderboard/${userId}`);
  },
};

export default leaderboardService; 