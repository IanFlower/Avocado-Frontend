import apiClient from '../services/services';

const studentInfoEventService = {
  // Create a new studentInfoEvent
  create(data) {
    return apiClient.post("/studentInfoEvent", data);
  },

  // Get all studentInfoEvents for a specific studentInfo
  getAllByStudentInfoId(studentInfoId) {
    return apiClient.get(`/studentInfoEvent/${studentInfoId}`);
  },

  // Update a studentInfoEvent by ID
  update(id, data) {
    return apiClient.put(`/studentInfoEvent/${id}`, data);
  },

  // Delete a studentInfoEvent by studentInfoId
  delete(studentInfoId) {
    return apiClient.delete(`/studentInfoEvent/${studentInfoId}`);
  }
};

export default studentInfoEventService;