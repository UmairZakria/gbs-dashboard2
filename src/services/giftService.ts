import api from './api';
import { ApiResponse } from '../types';

export interface GiftService {
  _id: string;
  name: string;
  description?: string;
  type: 'gift_wrap' | 'gift_message' | 'gift_box' | 'gift_card' | 'personalization';
  price: number;
  currency: string;
  isFree: boolean;
  freeThreshold?: number;
  options?: string[];
  maxCharacters?: number;
  isActive: boolean;
  sortOrder: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GiftCard {
  _id: string;
  code: string;
  originalAmount: number;
  currentBalance: number;
  currency: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  purchasedBy?: string;
  recipientEmail?: string;
  recipientName?: string;
  giftMessage?: string;
  expiryDate?: string;
  usedBy?: string;
  usedAt?: string;
  usedInOrder?: string;
  purchaseOrderId?: string;
  isDigital: boolean;
  deliveryMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const giftService = {
  // Gift Services
  async getGiftServices(page = 1, limit = 20): Promise<ApiResponse<{ data: GiftService[] }>> {
    const response = await api.get(`/gift-services?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getActiveServices(): Promise<ApiResponse<GiftService[]>> {
    const response = await api.get('/gift-services/active');
    return response.data;
  },

  async getAvailableServices(orderAmount = 0): Promise<ApiResponse<GiftService[]>> {
    const response = await api.get(`/gift-services/available?orderAmount=${orderAmount}`);
    return response.data;
  },

  async getFreeServices(): Promise<ApiResponse<GiftService[]>> {
    const response = await api.get('/gift-services/free');
    return response.data;
  },

  async getServicesByType(type: string): Promise<ApiResponse<GiftService[]>> {
    const response = await api.get(`/gift-services/type/${type}`);
    return response.data;
  },

  async calculateServicePrice(serviceId: string, orderAmount = 0): Promise<ApiResponse<number>> {
    const response = await api.get(`/gift-services/${serviceId}/price?orderAmount=${orderAmount}`);
    return response.data;
  },

  async createGiftService(data: Partial<GiftService>): Promise<ApiResponse<GiftService>> {
    const response = await api.post('/gift-services', data);
    return response.data;
  },

  async updateGiftService(id: string, data: Partial<GiftService>): Promise<ApiResponse<GiftService>> {
    const response = await api.put(`/gift-services/${id}`, data);
    return response.data;
  },

  async deleteGiftService(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/gift-services/${id}`);
    return response.data;
  },

  // Gift Cards
  async getGiftCards(page = 1, limit = 20): Promise<ApiResponse<{ data: GiftCard[] }>> {
    const response = await api.get(`/gift-cards?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getGiftCardStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/gift-cards/stats');
    return response.data;
  },

  async getActiveCards(): Promise<ApiResponse<GiftCard[]>> {
    const response = await api.get('/gift-cards/active');
    return response.data;
  },

  async getExpiredCards(): Promise<ApiResponse<GiftCard[]>> {
    const response = await api.get('/gift-cards/expired');
    return response.data;
  },

  async getUsedCards(): Promise<ApiResponse<GiftCard[]>> {
    const response = await api.get('/gift-cards/used');
    return response.data;
  },

  async getCardsByStatus(status: string): Promise<ApiResponse<GiftCard[]>> {
    const response = await api.get(`/gift-cards/status/${status}`);
    return response.data;
  },

  async getCardsByPurchasedBy(customerId: string): Promise<ApiResponse<GiftCard[]>> {
    const response = await api.get(`/gift-cards/purchased-by/${customerId}`);
    return response.data;
  },

  async getCardsByRecipientEmail(email: string): Promise<ApiResponse<GiftCard[]>> {
    const response = await api.get(`/gift-cards/recipient/${email}`);
    return response.data;
  },

  async getCardByCode(code: string): Promise<ApiResponse<GiftCard>> {
    const response = await api.get(`/gift-cards/code/${code}`);
    return response.data;
  },

  async validateGiftCard(code: string): Promise<ApiResponse<{ valid: boolean; balance: number; message?: string }>> {
    const response = await api.get(`/gift-cards/code/${code}/validate`);
    return response.data;
  },

  async generateGiftCardCode(): Promise<ApiResponse<string>> {
    const response = await api.post('/gift-cards/generate-code');
    return response.data;
  },

  async createGiftCard(data: Partial<GiftCard>): Promise<ApiResponse<GiftCard>> {
    const response = await api.post('/gift-cards', data);
    return response.data;
  },

  async updateGiftCard(id: string, data: Partial<GiftCard>): Promise<ApiResponse<GiftCard>> {
    const response = await api.put(`/gift-cards/${id}`, data);
    return response.data;
  },

  async useGiftCard(code: string, data: { usedBy: string; orderId: string; amount: number }): Promise<ApiResponse<GiftCard>> {
    const response = await api.put(`/gift-cards/code/${code}/use`, data);
    return response.data;
  },

  async refundGiftCard(code: string, amount: number): Promise<ApiResponse<GiftCard>> {
    const response = await api.put(`/gift-cards/code/${code}/refund`, { amount });
    return response.data;
  },

  async expireGiftCard(code: string): Promise<ApiResponse<GiftCard>> {
    const response = await api.put(`/gift-cards/code/${code}/expire`);
    return response.data;
  },

  async deleteGiftCard(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/gift-cards/${id}`);
    return response.data;
  },
};