import api from './api';
import { ApiResponse } from '../types';

import type { Warehouse as WarehouseType } from '../types';

export type Warehouse = WarehouseType & {
  _id?: any;
  status?: 'active' | 'inactive' | 'maintenance';
  utilization?: number;
  operatingHours?: any;
};

export interface InventoryItem {
  _id: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStockLevel?: number;
  costPrice?: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastRestockedAt?: string;
  lastSoldAt?: string;
  location?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

export const inventoryService = {
  async getInventory(page = 1, limit = 20): Promise<ApiResponse<{ data: InventoryItem[] }>> {
    const response = await api.get(`/inventory?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getInventorySummary(): Promise<ApiResponse<any>> {
    const response = await api.get('/inventory/summary');
    return response.data;
  },

  async getLowStockItems(threshold = 10): Promise<ApiResponse<InventoryItem[]>> {
    const response = await api.get(`/inventory/low-stock?threshold=${threshold}`);
    return response.data;
  },

  async getInventoryByProduct(productId: string): Promise<ApiResponse<InventoryItem[]>> {
    const response = await api.get(`/inventory/product/${productId}`);
    return response.data;
  },

  async getInventoryByWarehouse(warehouseId: string): Promise<ApiResponse<InventoryItem[]>> {
    const response = await api.get(`/inventory/warehouse/${warehouseId}`);
    return response.data;
  },

  async updateStock(inventoryId: string, data: {
    quantity: number;
    operation: 'add' | 'subtract';
    referenceId?: string;
    referenceType?: string;
    notes?: string;
    userId?: string;
  }): Promise<ApiResponse<InventoryItem>> {
    const response = await api.post(`/inventory/${inventoryId}/stock`, data);
    return response.data;
  },

  async reserveStock(inventoryId: string, quantity: number): Promise<ApiResponse<InventoryItem>> {
    const response = await api.post(`/inventory/${inventoryId}/reserve`, { quantity });
    return response.data;
  },

  async releaseReservedStock(inventoryId: string, quantity: number): Promise<ApiResponse<InventoryItem>> {
    const response = await api.post(`/inventory/${inventoryId}/release`, { quantity });
    return response.data;
  },

  // Warehouse methods
  async getWarehouses(page = 1, limit = 20): Promise<ApiResponse<{ data: Warehouse[] }>> {
    const response = await api.get(`/warehouses?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getActiveWarehouses(): Promise<ApiResponse<Warehouse[]>> {
    const response = await api.get('/warehouses/active');
    return response.data;
  },

  async getPrimaryWarehouse(): Promise<ApiResponse<Warehouse>> {
    const response = await api.get('/warehouses/primary');
    return response.data;
  },

  async createWarehouse(data: Partial<Warehouse>): Promise<ApiResponse<Warehouse>> {
    const response = await api.post('/warehouses', data);
    return response.data;
  },

  async updateWarehouse(id: string, data: Partial<Warehouse>): Promise<ApiResponse<Warehouse>> {
    const response = await api.put(`/warehouses/${id}`, data);
    return response.data;
  },

  async deleteWarehouse(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  },
};