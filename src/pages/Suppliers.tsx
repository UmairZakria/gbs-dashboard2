import React, { useState, useEffect } from 'react';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { supplierService, Supplier, PurchaseOrder } from '../services/supplierService';
import SupplierForm from '../components/products/SupplierForm';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'orders'>('suppliers');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (activeTab === 'suppliers') {
        const [suppliersRes, statsRes] = await Promise.all([
          supplierService.getActiveSuppliers(),
          supplierService.getSupplierStats()
        ]);
        setSuppliers(suppliersRes.data || []);
        setStats(statsRes.data);
      } else {
        const [ordersRes, statsRes] = await Promise.all([
          supplierService.getPurchaseOrders(),
          supplierService.getPurchaseOrderSummary()
        ]);
        const responseData = ordersRes.data;
        if (responseData && typeof responseData === 'object' && 'data' in responseData) {
          setPurchaseOrders(responseData.data || []);
        } else {
          setPurchaseOrders(Array.isArray(responseData) ? responseData : []);
        }
        setStats(statsRes.data);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'ordered': return 'text-indigo-600 bg-indigo-100';
      case 'partially_received': return 'text-orange-600 bg-orange-100';
      case 'received': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleDelete = async (supplier: Supplier) => {
    if (window.confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      try {
        await supplierService.deleteSupplier(supplier._id);
        await loadData();
      } catch (err) {
        console.error('Error deleting supplier:', err);
        alert('Failed to delete supplier');
      }
    }
  };

  const handleSubmit = async (data: Partial<Supplier>) => {
    try {
      if (editingSupplier?._id) {
        await supplierService.updateSupplier(editingSupplier._id, data);
      } else {
        await supplierService.createSupplier(data);
      }
      setShowForm(false);
      setEditingSupplier(null);
      await loadData();
    } catch (err) {
      console.error('Error saving supplier:', err);
      alert('Failed to save supplier');
    }
  };

  const supplierColumns = [
    {
      key: 'name',
      label: 'Name',
      render: (supplier: Supplier) => (
        <div>
          <div className="font-medium">{supplier.name}</div>
          <div className="text-sm text-gray-500">{supplier.code}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (supplier: Supplier) => (
        <div>
          {supplier.contactPerson && (
            <div className="text-sm">{supplier.contactPerson}</div>
          )}
          {supplier.email && (
            <div className="text-sm text-gray-500">{supplier.email}</div>
          )}
          {supplier.phone && (
            <div className="text-sm text-gray-500">{supplier.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (supplier: Supplier) => (
        <div className="flex items-center">
          {supplier.rating ? (
            <>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < supplier.rating! ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">({supplier.rating}/5)</span>
            </>
          ) : (
            <span className="text-gray-400">No rating</span>
          )}
        </div>
      ),
    },
    {
      key: 'leadTime',
      label: 'Lead Time',
      render: (supplier: Supplier) => (
        <div>{supplier.leadTime ? `${supplier.leadTime} days` : '-'}</div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (supplier: Supplier) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          supplier.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
        }`}>
          {supplier.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (supplier: Supplier) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle view */}}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(supplier)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(supplier)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const orderColumns = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      render: (order: PurchaseOrder) => (
        <div className="font-medium">{order.orderNumber}</div>
      ),
    },
    {
      key: 'supplierId',
      label: 'Supplier',
      render: (order: PurchaseOrder) => (
        <div>{order.supplierId}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: PurchaseOrder) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (order: PurchaseOrder) => (
        <div className="font-mono">${order.totalAmount.toFixed(2)}</div>
      ),
    },
    {
      key: 'expectedDeliveryDate',
      label: 'Expected Delivery',
      render: (order: PurchaseOrder) => (
        <div>{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : '-'}</div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (order: PurchaseOrder) => (
        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: PurchaseOrder) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle view */}}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle edit */}}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers & Purchase Orders</h1>
        {activeTab === 'suppliers' && (
          <Button onClick={handleAddNew}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Suppliers
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Purchase Orders
          </button>
        </nav>
      </div>

      {/* Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activeTab === 'suppliers' ? (
            <>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Suppliers</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalSuppliers}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Active Suppliers</div>
                  <div className="text-2xl font-bold text-green-600">{stats.activeSuppliers}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Top Rated</div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.topRatedSuppliers}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Avg Rating</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.averageRating?.toFixed(1) || '0.0'}</div>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Orders</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Pending Orders</div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Completed Orders</div>
                  <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Value</div>
                  <div className="text-2xl font-bold text-gray-900">${stats.totalValue?.toFixed(2) || '0.00'}</div>
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Data Table */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {activeTab === 'suppliers' ? 'Suppliers' : 'Purchase Orders'}
          </h2>
          <Table
            data={activeTab === 'suppliers' ? suppliers : purchaseOrders}
            columns={activeTab === 'suppliers' ? supplierColumns : orderColumns}
            emptyMessage={`No ${activeTab} found`}
          />
        </div>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <SupplierForm
          supplier={editingSupplier || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
        />
      )}
    </div>
  );
};

export default Suppliers;