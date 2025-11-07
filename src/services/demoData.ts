// Demo data for development and testing
export const demoDashboardStats = {
  totalRevenue: 125000,
  totalOrders: 1247,
  totalProducts: 89,
  totalUsers: 456,
};

export const demoRevenueData = [
  { date: '2024-01-01', revenue: 8500 },
  { date: '2024-01-02', revenue: 9200 },
  { date: '2024-01-03', revenue: 7800 },
  { date: '2024-01-04', revenue: 10500 },
  { date: '2024-01-05', revenue: 11200 },
  { date: '2024-01-06', revenue: 9800 },
  { date: '2024-01-07', revenue: 13400 },
];

export const demoOrdersData = [
  { date: '2024-01-01', orders: 45 },
  { date: '2024-01-02', orders: 52 },
  { date: '2024-01-03', orders: 38 },
  { date: '2024-01-04', orders: 67 },
  { date: '2024-01-05', orders: 71 },
  { date: '2024-01-06', orders: 58 },
  { date: '2024-01-07', orders: 89 },
];

export const demoTopProducts = [
  { _id: '1', name: 'Wireless Headphones', sales: 234, revenue: 23400 },
  { _id: '2', name: 'Smart Watch', sales: 189, revenue: 37800 },
  { _id: '3', name: 'Laptop Stand', sales: 156, revenue: 7800 },
  { _id: '4', name: 'USB-C Cable', sales: 298, revenue: 2980 },
  { _id: '5', name: 'Wireless Mouse', sales: 145, revenue: 7250 },
];

export const demoRecentOrders = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    userId: { firstName: 'John', lastName: 'Doe' },
    totalAmount: 299.99,
    orderStatus: 'delivered',
    createdAt: '2024-01-07T10:30:00Z',
  },
  {
    _id: '2',
    orderNumber: 'ORD-002',
    userId: { firstName: 'Jane', lastName: 'Smith' },
    totalAmount: 149.50,
    orderStatus: 'shipped',
    createdAt: '2024-01-07T09:15:00Z',
  },
  {
    _id: '3',
    orderNumber: 'ORD-003',
    userId: { firstName: 'Mike', lastName: 'Johnson' },
    totalAmount: 89.99,
    orderStatus: 'processing',
    createdAt: '2024-01-07T08:45:00Z',
  },
  {
    _id: '4',
    orderNumber: 'ORD-004',
    userId: { firstName: 'Sarah', lastName: 'Wilson' },
    totalAmount: 199.99,
    orderStatus: 'pending',
    createdAt: '2024-01-07T08:00:00Z',
  },
  {
    _id: '5',
    orderNumber: 'ORD-005',
    userId: { firstName: 'David', lastName: 'Brown' },
    totalAmount: 399.99,
    orderStatus: 'delivered',
    createdAt: '2024-01-06T17:30:00Z',
  },
];

export const demoProducts = [
  {
    _id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    price: 99.99,
    stockQuantity: 45,
    status: 'active',
    category: { name: 'Electronics' },
    images: ['/placeholder-product.png'],
  },
  {
    _id: '2',
    name: 'Smart Watch',
    sku: 'SW-001',
    price: 199.99,
    stockQuantity: 23,
    status: 'active',
    category: { name: 'Electronics' },
    images: ['/placeholder-product.png'],
  },
  {
    _id: '3',
    name: 'Laptop Stand',
    sku: 'LS-001',
    price: 49.99,
    stockQuantity: 67,
    status: 'active',
    category: { name: 'Accessories' },
    images: ['/placeholder-product.png'],
  },
  {
    _id: '4',
    name: 'USB-C Cable',
    sku: 'UC-001',
    price: 9.99,
    stockQuantity: 234,
    status: 'active',
    category: { name: 'Accessories' },
    images: ['/placeholder-product.png'],
  },
  {
    _id: '5',
    name: 'Wireless Mouse',
    sku: 'WM-001',
    price: 49.99,
    stockQuantity: 89,
    status: 'active',
    category: { name: 'Accessories' },
    images: ['/placeholder-product.png'],
  },
];

export const demoCustomers = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    createdAt: '2024-01-01T00:00:00Z',
    orders: [
      { _id: '1', totalAmount: 299.99, orderStatus: 'delivered', createdAt: '2024-01-07T10:30:00Z' },
      { _id: '6', totalAmount: 149.50, orderStatus: 'delivered', createdAt: '2024-01-05T14:20:00Z' },
    ],
    addresses: [
      {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    ],
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    createdAt: '2024-01-02T00:00:00Z',
    orders: [
      { _id: '2', totalAmount: 149.50, orderStatus: 'shipped', createdAt: '2024-01-07T09:15:00Z' },
    ],
    addresses: [
      {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
      },
    ],
  },
  {
    _id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 345-6789',
    createdAt: '2024-01-03T00:00:00Z',
    orders: [
      { _id: '3', totalAmount: 89.99, orderStatus: 'processing', createdAt: '2024-01-07T08:45:00Z' },
    ],
    addresses: [
      {
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
      },
    ],
  },
];

export const demoOrders = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    userId: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    totalAmount: 299.99,
    orderStatus: 'delivered',
    createdAt: '2024-01-07T10:30:00Z',
    items: [
      { product: { name: 'Wireless Headphones', images: ['/placeholder-product.png'] }, quantity: 1, price: 99.99 },
      { product: { name: 'Smart Watch', images: ['/placeholder-product.png'] }, quantity: 1, price: 199.99 },
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
  },
  {
    _id: '2',
    orderNumber: 'ORD-002',
    userId: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
    totalAmount: 149.50,
    orderStatus: 'shipped',
    createdAt: '2024-01-07T09:15:00Z',
    items: [
      { product: { name: 'Laptop Stand', images: ['/placeholder-product.png'] }, quantity: 1, price: 49.99 },
      { product: { name: 'USB-C Cable', images: ['/placeholder-product.png'] }, quantity: 10, price: 9.99 },
    ],
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
  },
  {
    _id: '3',
    orderNumber: 'ORD-003',
    userId: { firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com' },
    totalAmount: 89.99,
    orderStatus: 'processing',
    createdAt: '2024-01-07T08:45:00Z',
    items: [
      { product: { name: 'Wireless Mouse', images: ['/placeholder-product.png'] }, quantity: 1, price: 49.99 },
      { product: { name: 'USB-C Cable', images: ['/placeholder-product.png'] }, quantity: 4, price: 9.99 },
    ],
    shippingAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
  },
]; 