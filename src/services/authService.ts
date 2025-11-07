import api from './api';
import { ApiResponse, User, LoginForm, RegisterForm } from '../types';

export const authService = {
  // Login user
  async login(credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register user
  async register(userData: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  // Logout (client-side)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
}; 