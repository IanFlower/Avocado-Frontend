import apiClient from './services';

const documentService = {
  // Create a new Document
  createDocument(documentData) {
    return apiClient.post('/documents', documentData);
  },

  // Retrieve all Documents
  getAllDocuments() {
    return apiClient.get('/documents');
  },

  // Retrieve a single Document by ID
  getDocumentById(id) {
    return apiClient.get(`/documents/${id}`);
  },

  // Update a Document by ID
  updateDocument(id, documentData) {
    return apiClient.put(`/documents/${id}`, documentData);
  },

  // Delete a Document by ID
  deleteDocument(id) {
    return apiClient.delete(`/documents/${id}`);
  },

  // Upload a Document (with file upload)
  uploadDocument(fileData) {
    return apiClient.post('/documents/upload', fileData,  {

    });
  },
};

export default documentService;