import apiClient from '../services/services';

const studentInfoMajorService = {
  // Create a new studentInfoMajor
  create(data) {
    return apiClient.post("/studentInfoMajor", data);
  },

  // Get all studentInfoMajors for a specific studentInfo
  getAllByStudentInfoId(studentInfoId) {
    return apiClient.get(`/studentInfoMajor/${studentInfoId}`);
  },

  // Update a studentInfoMajor by ID
  update(id, data) {
    return apiClient.put(`/studentInfoMajor/${id}`, data);
  },

  // Delete a studentInfoMajor by studentInfoId
  delete(studentInfoId) {
    return apiClient.delete(`/studentInfoMajor/${studentInfoId}`);
  }
};

export default studentInfoMajorService;