import api from './api';
import { ApiResponse, DashboardStats } from '../types';

export const dashboardService = {
  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.warn('Analytics dashboard endpoint not available:', error);
      return { success: false, message: 'Analytics endpoint not available', data: undefined };
    }
  },

  // Get revenue chart data
  async getRevenueChart(period: string = '7d'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/analytics/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      console.warn('Revenue analytics endpoint not available:', error);
      return { success: false, message: 'Revenue analytics endpoint not available', data: null };
    }
  },

  // Get orders chart data
  async getOrdersChart(period: string = '7d'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/analytics/orders?period=${period}`);
      return response.data;
    } catch (error) {
      console.warn('Orders analytics endpoint not available:', error);
      return { success: false, message: 'Orders analytics endpoint not available', data: null };
    }
  },

  // Get top products
  async getTopProducts(limit: number = 5): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/analytics/top-products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn('Top products analytics endpoint not available:', error);
      return { success: false, message: 'Top products analytics endpoint not available', data: null };
    }
  },

  // Get recent orders
  async getRecentOrders(limit: number = 5): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/orders?limit=${limit}&sort=-createdAt`);
      return response.data;
    } catch (error) {
      console.warn('Recent orders endpoint not available:', error);
      return { success: false, message: 'Recent orders endpoint not available', data: null };
    }
  },

  // Get customer growth data
  async getCustomerGrowth(period: string = '7d'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/analytics/customer-growth?period=${period}`);
      return response.data;
    } catch (error) {
      console.warn('Customer growth analytics endpoint not available:', error);
      return { success: false, message: 'Customer growth analytics endpoint not available', data: null };
    }
  },

  // Get product performance data
  async getProductPerformance(period: string = '7d'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/analytics/product-performance?period=${period}`);
      return response.data;
    } catch (error) {
      console.warn('Product performance analytics endpoint not available:', error);
      return { success: false, message: 'Product performance analytics endpoint not available', data: null };
    }
  },

  // Get category performance data
  async getCategoryPerformance(period: string = '7d'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/analytics/category-performance?period=${period}`);
      return response.data;
    } catch (error) {
      console.warn('Category performance analytics endpoint not available:', error);
      return { success: false, message: 'Category performance analytics endpoint not available', data: null };
    }
  },

  // Get conversion rates data
  async getConversionRates(period: string = '7d'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/analytics/conversion-rates?period=${period}`);
      return response.data;
    } catch (error) {
      console.warn('Conversion rates analytics endpoint not available:', error);
      return { success: false, message: 'Conversion rates analytics endpoint not available', data: null };
    }
  },
}; 