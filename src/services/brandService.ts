import api from './api';
import { ApiResponse, Brand } from '../types';

export const brandService = {
  // Get all brands
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await api.get('/brands');
    return response.data;
  },

  // Get brand by ID
  async getBrand(id: string): Promise<ApiResponse<Brand>> {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  // Create new brand
  async createBrand(brandData: Partial<Brand>): Promise<ApiResponse<Brand>> {
    const response = await api.post('/brands', brandData);
    return response.data;
  },

  // Update brand
  async updateBrand(id: string, brandData: Partial<Brand>): Promise<ApiResponse<Brand>> {
    const response = await api.put(`/brands/${id}`, brandData);
    return response.data;
  },

  // Delete brand
  async deleteBrand(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
}; 