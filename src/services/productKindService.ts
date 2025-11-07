import api from './api';
import { ApiResponse } from '../types';

export interface ProductKindField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'date';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ProductKindDto {
  _id: string;
  key: string;
  name: string;
  description?: string;
  isActive: boolean;
  fields: ProductKindField[];
}

export const productKindService = {
  async getKinds(page = 1, limit = 50): Promise<ApiResponse<{ data: ProductKindDto[] }>> {
    const response = await api.get(`/product-kinds?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createKind(payload: Partial<ProductKindDto>): Promise<ApiResponse<{ kind: ProductKindDto }>> {
    const response = await api.post('/product-kinds', payload);
    return response.data;
  },

  async updateKind(id: string, payload: Partial<ProductKindDto>): Promise<ApiResponse<{ kind: ProductKindDto }>> {
    const response = await api.put(`/product-kinds/${id}`, payload);
    return response.data;
  },

  async deleteKind(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/product-kinds/${id}`);
    return response.data;
  },
};

