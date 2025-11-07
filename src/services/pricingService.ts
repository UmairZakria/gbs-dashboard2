import api from './api';
import { ApiResponse } from '../types';

export interface PricingRule {
  _id: string;
  name: string;
  description?: string;
  type: 'bulk_discount' | 'customer_group' | 'seasonal' | 'product_category' | 'brand' | 'quantity_break';
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  minQuantity?: number;
  maxQuantity?: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  productIds?: string[];
  categoryIds?: string[];
  brandIds?: string[];
  customerGroupIds?: string[];
  validFrom?: string;
  validTo?: string;
  priority: number;
  isActive: boolean;
  usageLimitPerCustomer?: number;
  totalUsageLimit?: number;
  usageCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export const pricingService = {
  async getPricingRules(page = 1, limit = 20): Promise<ApiResponse<{ data: PricingRule[] }>> {
    const response = await api.get(`/pricing-rules?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getActiveRules(): Promise<ApiResponse<PricingRule[]>> {
    const response = await api.get('/pricing-rules/active');
    return response.data;
  },

  async getRuleStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/pricing-rules/stats');
    return response.data;
  },

  async getRulesByType(type: string): Promise<ApiResponse<PricingRule[]>> {
    const response = await api.get(`/pricing-rules/type/${type}`);
    return response.data;
  },

  async getRulesByProduct(productId: string): Promise<ApiResponse<PricingRule[]>> {
    const response = await api.get(`/pricing-rules/product/${productId}`);
    return response.data;
  },

  async getRulesByCategory(categoryId: string): Promise<ApiResponse<PricingRule[]>> {
    const response = await api.get(`/pricing-rules/category/${categoryId}`);
    return response.data;
  },

  async getRulesByBrand(brandId: string): Promise<ApiResponse<PricingRule[]>> {
    const response = await api.get(`/pricing-rules/brand/${brandId}`);
    return response.data;
  },

  async getRulesByCustomerGroup(customerGroupId: string): Promise<ApiResponse<PricingRule[]>> {
    const response = await api.get(`/pricing-rules/customer-group/${customerGroupId}`);
    return response.data;
  },

  async getApplicableRules(params: {
    productIds?: string;
    categoryIds?: string;
    brandIds?: string;
    customerGroupIds?: string;
    quantity?: number;
    orderAmount?: number;
  }): Promise<ApiResponse<PricingRule[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    const response = await api.get(`/pricing-rules/applicable?${queryParams.toString()}`);
    return response.data;
  },

  async calculateDiscount(data: {
    productIds: string[];
    categoryIds: string[];
    brandIds: string[];
    customerGroupIds: string[];
    quantity: number;
    orderAmount: number;
  }): Promise<ApiResponse<{ rule: PricingRule; discount: number } | null>> {
    const response = await api.post('/pricing-rules/calculate-discount', data);
    return response.data;
  },

  async createPricingRule(data: Partial<PricingRule>): Promise<ApiResponse<PricingRule>> {
    const response = await api.post('/pricing-rules', data);
    return response.data;
  },

  async updatePricingRule(id: string, data: Partial<PricingRule>): Promise<ApiResponse<PricingRule>> {
    const response = await api.put(`/pricing-rules/${id}`, data);
    return response.data;
  },

  async validateRule(id: string): Promise<ApiResponse<boolean>> {
    const response = await api.get(`/pricing-rules/${id}/validate`);
    return response.data;
  },

  async deletePricingRule(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/pricing-rules/${id}`);
    return response.data;
  },
};