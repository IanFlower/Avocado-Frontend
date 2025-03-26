import apiClient from '../services/services';

const badgeService = {
  getAllBadges() {
    return apiClient.get('/badge');
  },

  getBadgeById(badgeId) {
    return apiClient.get(`/badge/${badgeId}`);
  },

  addBadge(badge) {
    // Send the badge data along with the icon URL (which you will get from the icon upload)
    return apiClient.post('/badge', {
      name: badge.name,
      desc: badge.desc,
      iconUrl: badge.iconUrl,  
    });
  },

  updateBadge(badge) {
    return apiClient.put(`/badge/${badge.id}`, badge);
  },

  deleteBadge(badgeId) {
    return apiClient.delete(`/badge/${badgeId}`);
  },
};

export default badgeService;
