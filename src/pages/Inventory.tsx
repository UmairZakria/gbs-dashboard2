import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { inventoryService, InventoryItem, Warehouse } from '../services/inventoryService';
import WarehouseForm from '../components/products/WarehouseForm';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'warehouses'>('inventory');
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [inventoryRes, warehousesRes, summaryRes] = await Promise.all([
        selectedWarehouse === 'all' 
          ? inventoryService.getInventory()
          : inventoryService.getInventoryByWarehouse(selectedWarehouse),
        inventoryService.getActiveWarehouses(),
        inventoryService.getInventorySummary()
      ]);

      const responseData = inventoryRes.data;
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        setInventory(responseData.data || []);
      } else {
        setInventory(Array.isArray(responseData) ? responseData : []);
      }
      setWarehouses(warehousesRes.data || []);
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to load inventory data');
      console.error('Error loading inventory:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWarehouse]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      case 'discontinued': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      case 'discontinued': return 'Discontinued';
      default: return status;
    }
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setShowWarehouseForm(true);
  };

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    setShowWarehouseForm(true);
  };

  const handleDeleteWarehouse = async (warehouse: Warehouse) => {
    if (window.confirm(`Are you sure you want to delete ${warehouse.name}?`)) {
      try {
        await inventoryService.deleteWarehouse(warehouse._id);
        await loadData();
      } catch (err) {
        console.error('Error deleting warehouse:', err);
        alert('Failed to delete warehouse');
      }
    }
  };

  const handleWarehouseSubmit = async (data: Partial<Warehouse>) => {
    try {
      if (editingWarehouse?._id) {
        await inventoryService.updateWarehouse(editingWarehouse._id, data);
      } else {
        await inventoryService.createWarehouse(data);
      }
      setShowWarehouseForm(false);
      setEditingWarehouse(null);
      await loadData();
    } catch (err) {
      console.error('Error saving warehouse:', err);
      alert('Failed to save warehouse');
    }
  };

  const inventoryColumns = [
    {
      key: 'productId',
      label: 'Product',
      render: (item: InventoryItem) => (
        <div className="font-medium">{item.productId}</div>
      ),
    },
    {
      key: 'warehouseId',
      label: 'Warehouse',
      render: (item: InventoryItem) => {
        const warehouse = warehouses.find(w => w._id === item.warehouseId);
        return <div>{warehouse?.name || item.warehouseId}</div>;
      },
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
      render: (item: InventoryItem) => (
        <div className="font-mono">{item.currentStock}</div>
      ),
    },
    {
      key: 'availableStock',
      label: 'Available',
      render: (item: InventoryItem) => (
        <div className="font-mono">{item.availableStock}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: InventoryItem) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
    {
      key: 'costPrice',
      label: 'Cost Price',
      render: (item: InventoryItem) => (
        <div>{item.costPrice ? `$${item.costPrice.toFixed(2)}` : '-'}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: InventoryItem) => (
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle delete */}}
          >
            <TrashIcon className="h-4 w-4" />
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
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        {activeTab === 'warehouses' && (
          <Button onClick={handleAddWarehouse}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'warehouses'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Warehouses
          </button>
        </nav>
      </div>

      {/* Summary Cards */}
      {summary && activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="p-4">
              <div className="text-sm font-medium text-gray-500">Total Items</div>
              <div className="text-2xl font-bold text-gray-900">{summary.totalItems}</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="text-sm font-medium text-gray-500">Low Stock Items</div>
              <div className="text-2xl font-bold text-yellow-600">{summary.lowStockItems}</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="text-sm font-medium text-gray-500">Out of Stock</div>
              <div className="text-2xl font-bold text-red-600">{summary.outOfStockItems}</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="text-sm font-medium text-gray-500">Total Value</div>
              <div className="text-2xl font-bold text-gray-900">${summary.totalValue?.toFixed(2) || '0.00'}</div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      {activeTab === 'inventory' && (
        <Card>
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Warehouse</label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Warehouses</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      )}

      {/* Inventory Table */}
      {activeTab === 'inventory' && (
        <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory Items</h2>
          <Table
            data={inventory}
            columns={inventoryColumns}
            emptyMessage="No inventory items found"
          />
        </div>
      </Card>
      )}

      {/* Warehouses List */}
      {activeTab === 'warehouses' && (
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Warehouses</h2>
            {warehouses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No warehouses found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{warehouse.name}</div>
                            {warehouse.isPrimary && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Primary
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {warehouse.address?.city}, {warehouse.address?.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          warehouse.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {warehouse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditWarehouse(warehouse)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteWarehouse(warehouse)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}

      {/* Warehouse Form Modal */}
      {showWarehouseForm && (
        <WarehouseForm
          warehouse={editingWarehouse || undefined}
          onSubmit={handleWarehouseSubmit}
          onCancel={() => {
            setShowWarehouseForm(false);
            setEditingWarehouse(null);
          }}
        />
      )}
    </div>
  );
};

export default Inventory;