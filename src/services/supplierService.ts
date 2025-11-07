import api from './api';
import { ApiResponse } from '../types';

export interface Supplier {
  _id: string;
  name: string;
  code: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  paymentTerms?: string;
  creditLimit?: number;
  currency: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  rating?: number;
  leadTime?: number;
  minimumOrderAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  _id: string;
  orderNumber: string;
  supplierId: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    quantityReceived: number;
    unitCost: number;
    totalCost: number;
    expectedDeliveryDate?: string;
    notes?: string;
  }>;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  orderedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const supplierService = {
  async getSuppliers(page = 1, limit = 20): Promise<ApiResponse<{ data: Supplier[] }>> {
    const response = await api.get(`/suppliers?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getActiveSuppliers(): Promise<ApiResponse<Supplier[]>> {
    const response = await api.get('/suppliers/active');
    return response.data;
  },

  async getSupplierStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/suppliers/stats');
    return response.data;
  },

  async searchSuppliers(searchTerm: string): Promise<ApiResponse<Supplier[]>> {
    const response = await api.get(`/suppliers/search?q=${searchTerm}`);
    return response.data;
  },

  async getSuppliersByRating(minRating: number): Promise<ApiResponse<Supplier[]>> {
    const response = await api.get(`/suppliers/rating/${minRating}`);
    return response.data;
  },

  async createSupplier(data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
    const response = await api.post('/suppliers', data);
    return response.data;
  },

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },

  async deleteSupplier(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },

  // Purchase Order methods
  async getPurchaseOrders(page = 1, limit = 20): Promise<ApiResponse<{ data: PurchaseOrder[] }>> {
    const response = await api.get(`/purchase-orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPurchaseOrderSummary(): Promise<ApiResponse<any>> {
    const response = await api.get('/purchase-orders/summary');
    return response.data;
  },

  async getPendingOrders(): Promise<ApiResponse<PurchaseOrder[]>> {
    const response = await api.get('/purchase-orders/pending');
    return response.data;
  },

  async getOverdueOrders(): Promise<ApiResponse<PurchaseOrder[]>> {
    const response = await api.get('/purchase-orders/overdue');
    return response.data;
  },

  async getOrdersBySupplier(supplierId: string): Promise<ApiResponse<PurchaseOrder[]>> {
    const response = await api.get(`/purchase-orders/supplier/${supplierId}`);
    return response.data;
  },

  async getOrdersByStatus(status: string): Promise<ApiResponse<PurchaseOrder[]>> {
    const response = await api.get(`/purchase-orders/status/${status}`);
    return response.data;
  },

  async createPurchaseOrder(data: Partial<PurchaseOrder>): Promise<ApiResponse<PurchaseOrder>> {
    const response = await api.post('/purchase-orders', data);
    return response.data;
  },

  async updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>): Promise<ApiResponse<PurchaseOrder>> {
    const response = await api.put(`/purchase-orders/${id}`, data);
    return response.data;
  },

  async approveOrder(id: string, approvedBy: string): Promise<ApiResponse<PurchaseOrder>> {
    const response = await api.put(`/purchase-orders/${id}/approve`, { approvedBy });
    return response.data;
  },

  async markAsOrdered(id: string): Promise<ApiResponse<PurchaseOrder>> {
    const response = await api.put(`/purchase-orders/${id}/order`);
    return response.data;
  },

  async receiveOrder(id: string, receivedItems: Array<{ itemIndex: number; quantity: number }>): Promise<ApiResponse<PurchaseOrder>> {
    const response = await api.put(`/purchase-orders/${id}/receive`, { receivedItems });
    return response.data;
  },

  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<PurchaseOrder>> {
    const response = await api.put(`/purchase-orders/${id}/cancel`, { reason });
    return response.data;
  },

  async deletePurchaseOrder(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/purchase-orders/${id}`);
    return response.data;
  },
};