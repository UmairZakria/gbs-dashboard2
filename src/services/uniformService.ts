import api from './api';
import { ApiResponse } from '../types';
import type { Uniform as UniformType } from '../types';

export type Uniform = UniformType;

export const uniformService = {
  async getUniforms(page = 1, limit = 20): Promise<ApiResponse<any>> {
    const response = await api.get(`/uniforms?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUniform(id: string): Promise<ApiResponse<Uniform>> {
    const response = await api.get(`/uniforms/${id}`);
    return response.data;
  },

  async getUniformBySlug(slug: string): Promise<ApiResponse<Uniform>> {
    const response = await api.get(`/uniforms/slug/${slug}`);
    return response.data;
  },

  async getUniformsBySchool(schoolName: string): Promise<ApiResponse<Uniform[]>> {
    const response = await api.get(`/uniforms/school/${encodeURIComponent(schoolName)}`);
    return response.data;
  },

  async getUniformsByGrade(gradeLevel: string): Promise<ApiResponse<Uniform[]>> {
    const response = await api.get(`/uniforms/grade/${gradeLevel}`);
    return response.data;
  },

  async getUniformsByType(type: string): Promise<ApiResponse<Uniform[]>> {
    const response = await api.get(`/uniforms/type/${type}`);
    return response.data;
  },

  async getUniformsByGender(gender: string): Promise<ApiResponse<Uniform[]>> {
    const response = await api.get(`/uniforms/gender/${gender}`);
    return response.data;
  },

  async getActiveUniforms(): Promise<ApiResponse<Uniform[]>> {
    const response = await api.get('/uniforms/active');
    return response.data;
  },

  async searchUniforms(searchTerm: string, page = 1, limit = 20): Promise<ApiResponse<any>> {
    const response = await api.get(`/uniforms/search?q=${searchTerm}&page=${page}&limit=${limit}`);
    return response.data;
  },

  async createUniform(data: Partial<Uniform>): Promise<ApiResponse<Uniform>> {
    const response = await api.post('/uniforms', data);
    return response.data;
  },

  async updateUniform(id: string, data: Partial<Uniform>): Promise<ApiResponse<Uniform>> {
    const response = await api.put(`/uniforms/${id}`, data);
    return response.data;
  },

  async deleteUniform(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/uniforms/${id}`);
    return response.data;
  },
};
