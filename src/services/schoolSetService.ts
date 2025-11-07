import api from './api';
import { ApiResponse } from '../types';

import type { SchoolSet as SchoolSetType } from '../types';

export interface SchoolSet extends SchoolSetType {
  shortDescription?: string;
  type?: 'grade_set' | 'subject_set' | 'uniform_set' | 'stationery_set' | 'complete_set';
  status?: 'active' | 'inactive' | 'seasonal' | 'discontinued';
  schoolName?: string;
  schoolLogoUrl?: string;
  academicYear?: string;
  subject?: string;
  season?: string;
  gender?: string;
  originalPrice?: number;
  discountPercentage?: number;
  currency?: string;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  notes?: string;
  keyFeatures?: string[];
  benefits?: string[];
  usageInstructions?: string;
  careInstructions?: string;
  warranty?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  customFields?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
}

export const schoolSetService = {
  async getSchoolSets(page = 1, limit = 20): Promise<ApiResponse<any>> {
    const response = await api.get(`/school-sets?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getSchoolSet(id: string): Promise<ApiResponse<SchoolSet>> {
    const response = await api.get(`/school-sets/${id}`);
    return response.data;
  },

  async getSchoolSetBySlug(slug: string): Promise<ApiResponse<SchoolSet>> {
    const response = await api.get(`/school-sets/slug/${slug}`);
    return response.data;
  },

  async getSchoolSetsBySchool(schoolName: string): Promise<ApiResponse<SchoolSet[]>> {
    const response = await api.get(`/school-sets/school/${encodeURIComponent(schoolName)}`);
    return response.data;
  },

  async getSchoolSetsByGrade(gradeLevel: string): Promise<ApiResponse<SchoolSet[]>> {
    const response = await api.get(`/school-sets/grade/${gradeLevel}`);
    return response.data;
  },

  async getSchoolSetsByBoard(board: string): Promise<ApiResponse<SchoolSet[]>> {
    const response = await api.get(`/school-sets/board/${board}`);
    return response.data;
  },

  async getSchoolSetsByType(type: string): Promise<ApiResponse<SchoolSet[]>> {
    const response = await api.get(`/school-sets/type/${type}`);
    return response.data;
  },

  async getSchoolSetsByStatus(status: string): Promise<ApiResponse<SchoolSet[]>> {
    const response = await api.get(`/school-sets/status/${status}`);
    return response.data;
  },

  async getFeaturedSchoolSets(): Promise<ApiResponse<SchoolSet[]>> {
    const response = await api.get('/school-sets/featured');
    return response.data;
  },

  async searchSchoolSets(searchTerm: string, page = 1, limit = 20): Promise<ApiResponse<any>> {
    const response = await api.get(`/school-sets/search?q=${searchTerm}&page=${page}&limit=${limit}`);
    return response.data;
  },

  async createSchoolSet(data: Partial<SchoolSet>): Promise<ApiResponse<SchoolSet>> {
    const response = await api.post('/school-sets', data);
    return response.data;
  },

  async updateSchoolSet(id: string, data: Partial<SchoolSet>): Promise<ApiResponse<SchoolSet>> {
    const response = await api.put(`/school-sets/${id}`, data);
    return response.data;
  },

  async deleteSchoolSet(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/school-sets/${id}`);
    return response.data;
  },
};
