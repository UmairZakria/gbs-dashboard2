import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Warehouse } from '../../types';

interface WarehouseFormProps {
  warehouse?: Warehouse;
  onSubmit: (data: Partial<Warehouse>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({
  warehouse,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: warehouse?.name || '',
    code: warehouse?.code || '',
    description: warehouse?.description || '',
    address: warehouse?.address || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    contact: warehouse?.contact || {},
    capacity: warehouse?.capacity || 0,
    isPrimary: warehouse?.isPrimary ?? false,
    isActive: warehouse?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.code?.trim()) {
      newErrors.code = 'Code is required';
    }
    if (!formData.address?.street?.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.address?.city?.trim()) {
      newErrors.city = 'City is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-3xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {warehouse ? 'Edit Warehouse' : 'Add Warehouse'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Warehouse name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className={`input-field ${errors.code ? 'border-red-300' : ''}`}
                placeholder="WH-001"
              />
              {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="input-field"
                placeholder="Warehouse description"
              />
            </div>
          </div>

          {/* Address */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
                <input
                  type="text"
                  value={formData.address?.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className={`input-field ${errors.street ? 'border-red-300' : ''}`}
                  placeholder="Street address"
                />
                {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.address?.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className={`input-field ${errors.city ? 'border-red-300' : ''}`}
                  placeholder="City"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.address?.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="input-field"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={formData.address?.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  className="input-field"
                  placeholder="123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.address?.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="input-field"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.contact?.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="input-field"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contact?.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="input-field"
                  placeholder="warehouse@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <input
                  type="text"
                  value={formData.contact?.manager}
                  onChange={(e) => handleContactChange('manager', e.target.value)}
                  className="input-field"
                  placeholder="Manager name"
                />
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Capacity</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Capacity</label>
              <input
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                className="input-field"
                placeholder="10000"
              />
              <p className="mt-1 text-sm text-gray-500">Total storage capacity in units</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPrimary}
                onChange={(e) => handleChange('isPrimary', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Primary Warehouse</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (warehouse ? 'Update Warehouse' : 'Create Warehouse')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseForm;
