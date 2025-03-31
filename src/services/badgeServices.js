import apiClient from '../services/services';

const badgeService = {
  getAllBadges() {
    return apiClient.get('/badge');
  },

  getbadgeById(badgeId) {
    return apiClient.get(`/badge/${badgeId}`);
  },

  addBadge(badge) {
    return apiClient.post('/badge', badge);
  },

  updateBadge(badge) {
    return apiClient.put(`/badge/${badge.id}`, badge);
  },

  deleteBadge(badgeId) {
    return apiClient.delete(`/badge/${badgeId}`);
  },
};

export default badgeService;
