import apiClient from './services';
import Axios from 'axios';
import Utils from '../config/utils.js';
import {apiFileClient} from '../services/services';


var baseurl = "";
if (import.meta.env.DEV) {
  baseurl = "http://localhost:3032/flight-plan-t2/";
} else {
  baseurl = "/flight-plan-t2/";
}

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
  getDocumentByFlightPlanTaskId(id) {
    return apiFileClient.get(`/documents/${id}`);
  },

  // Update a Document by ID
  updateDocumentbyName(documentData) {
    return apiClient.put(`/documents/$`,documentData);
  },

  // Delete a Document by ID
  deleteDocument(id) {
    return apiClient.delete(`/documents/${id}`);
  },

  // Upload a Document (with file upload)
  uploadDocument(fileData) {
    const formData = new FormData();
    


    formData.append('file', fileData.file);
    formData.append('flightplanTaskId', fileData.flightPlanTaskId);
    console.log("FormData before sending:", formData); 

    return Axios.post(`${baseurl}documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${Utils.getStore('token')}`,
        'Access-Control-Allow-Origin': '*', 
        crossDomain: true
      }, 
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error during file upload:", error);
        throw error;
      });
  },
  
};

export default documentService;