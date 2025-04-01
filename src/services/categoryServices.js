// categoryService.js
import { apiClient } from './services.js';

const categoryService = {
  // Get all categorys for a specific user
  getAllCategories() {
    return apiClient.get(`/category`);
  },
  
  // Get a specific category by ID
  getCategoryById(id) {
    return apiClient.get(`/category/${id}`);
  },
  
  // Create a new category
  createCategory(categoryData) {
    return apiClient.post('/category', categoryData);
  },
  
  // Update a specific category
  updateCategory(id, categoryData) {
    return apiClient.put(`/category/${id}`, categoryData);
  },

  // Delete a specific category
  deleteCategory(id) {
    return apiClient.delete(`/category/${id}`);
  },
};

export default categoryService;