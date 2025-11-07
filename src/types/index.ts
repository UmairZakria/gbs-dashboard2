// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'moderator' | 'admin';
  isActive: boolean;
  profileImage?: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  street?: string; // Alias for addressLine1
  city: string;
  state: string;
  postalCode: string;
  zipCode?: string; // Alias for postalCode
  country: string;
  phone: string;
  isDefault: boolean;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: Category;
  brandId?: Brand;
  variants: ProductVariant[];
  images: string[];
  tags: string[];
  rating: number;
  seo: SEOData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional properties used in the UI
  sku?: string;
  price?: number;
  stockQuantity?: number;
  status?: string;
  category?: Category; // Alias for categoryId
}

export interface ProductVariant {
  _id: string;
  sku: string;
  name: string;
  price: number;
  comparePrice?: number;
  costPrice: number;
  stockQuantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  attributes: Record<string, string>;
  isActive: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  children?: Category[];
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  website?: string;
  mainCompany?: string;
  level: 'main' | 'sub';
  industry?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  isActive: boolean;
  isFeatured: boolean;
}

export interface Uniform {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  schoolName: string;
  gradeLevel: string;
  type: 'school' | 'sports' | 'formal' | 'casual';
  gender: 'boys' | 'girls' | 'unisex';
  sizes: string[];
  colors: string[];
  materials: string[];
  careInstructions: string;
  season: string;
  price: number;
  costPrice: number;
  sku: string;
  barcode: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  specifications: Record<string, string>;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolSet {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  gradeLevel: string;
  board: string;
  syllabusYear: string;
  ageGroup: string;
  price: number;
  costPrice: number;
  sku: string;
  barcode: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  specifications: Record<string, string>;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  items: {
    productId: string;
    productName?: string;
    quantity: number;
    isRequired?: boolean;
    notes?: string;
    unitPrice: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

import { ReactElement } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  header?: string;
  render: (item: T) => ReactElement;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  slug?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
}

// Order Types
export interface Order {
  _id: string;
  userId: User;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingMethod: string;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  status: string;
}

export interface Warehouse {
  _id?: string;
  name: string;
  code: string;
  description?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  contact: {
    name?: string;
    email?: string;
    phone?: string;
    manager?: string;
  };
  capacity: number;
  isPrimary?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

}

// Payment Types
export interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gatewayResponse?: any;
  refundAmount?: number;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  productId: string;
  userId: User;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: Product;
  variantId: ProductVariant;
  quantity: number;
  price: number;
}

// Coupon Types
export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  applicableUsers?: string[];
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface Inventory {
  _id: string;
  productId: Product;
  variantId: ProductVariant;
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  costPrice: number;
  lastUpdated: string;
  movements: InventoryMovement[];
}

export interface InventoryMovement {
  _id: string;
  type: 'purchase' | 'sale' | 'return' | 'adjustment' | 'transfer';
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  notes?: string;
  createdAt: string;
}

// Shipping Types
export interface ShippingZone {
  _id: string;
  name: string;
  countries: string[];
  states?: string[];
  cities?: string[];
  postalCodes?: string[];
  methods: ShippingMethod[];
  isActive: boolean;
}

export interface ShippingMethod {
  _id: string;
  name: string;
  description?: string;
  baseRate: number;
  perItemRate: number;
  perWeightRate: number;
  freeShippingThreshold?: number;
  estimatedDays: string;
  restrictions?: {
    maxWeight?: number;
    maxDimensions?: number;
    excludedProducts?: string[];
    excludedCategories?: string[];
  };
  isActive: boolean;
}

// Analytics Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Product[];
  recentOrders: Order[];
  revenueChart: RevenueData[];
  orderChart: OrderData[];
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderData {
  date: string;
  orders: number;
  revenue: number;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  channel: 'email' | 'push' | 'sms' | 'in_app';
  isRead: boolean;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: PaginationData;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProductForm {
  name: string;
  description: string;
  categoryId: string;
  brandId?: string;
  tags: string[];
  variants: Omit<ProductVariant, '_id'>[];
  images: string[];
}

// Filter Types
export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

// Customer Types
export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
  orders?: Array<{
    _id: string;
    orderNumber: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
  }>;
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
} 