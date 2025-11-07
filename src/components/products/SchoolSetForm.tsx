import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { SchoolSet } from '../../types';

interface SchoolSetFormProps {
  schoolSet?: SchoolSet;
  onSubmit: (data: Partial<SchoolSet>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface SetItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

const SchoolSetForm: React.FC<SchoolSetFormProps> = ({
  schoolSet,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<SchoolSet>>({
    name: schoolSet?.name || '',
    slug: schoolSet?.slug || '',
    description: schoolSet?.description || '',
    gradeLevel: schoolSet?.gradeLevel || '',
    board: schoolSet?.board || '',
    syllabusYear: schoolSet?.syllabusYear || '',
    ageGroup: schoolSet?.ageGroup || '',
    price: schoolSet?.price || 0,
    costPrice: schoolSet?.costPrice || 0,
    sku: schoolSet?.sku || '',
    barcode: schoolSet?.barcode || '',
    weight: schoolSet?.weight || 0,
    dimensions: schoolSet?.dimensions || { length: 0, width: 0, height: 0 },
    images: schoolSet?.images || [],
    specifications: schoolSet?.specifications || {},
    isActive: schoolSet?.isActive ?? true,
    isFeatured: schoolSet?.isFeatured ?? false,
    tags: schoolSet?.tags || [],
    metaTitle: schoolSet?.metaTitle || '',
    metaDescription: schoolSet?.metaDescription || '',
    seoKeywords: schoolSet?.seoKeywords || [],
    items: schoolSet?.items || [],
  });

  const [newItem, setNewItem] = useState<SetItem>({
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
  });
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.gradeLevel?.trim()) {
      newErrors.gradeLevel = 'Grade level is required';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
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

  const addItem = () => {
    if (newItem.productName.trim() && newItem.quantity > 0 && newItem.unitPrice >= 0) {
      const item = {
        productId: newItem.productId || `temp-${Date.now()}`,
        productName: newItem.productName.trim(),
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
      };
      
      setFormData(prev => ({
        ...prev,
        items: [...(prev.items || []), item],
      }));
      
      setNewItem({
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
      });
    }
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || [],
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || [],
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images?.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img !== url) || [],
    }));
  };

  const calculateTotalPrice = () => {
    return formData.items?.reduce((total, item) => total + (item.quantity * (item.unitPrice || 0)), 0) || 0;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-5xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {schoolSet ? 'Edit School Set' : 'Add School Set'}
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
                placeholder="School set name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="input-field"
                placeholder="school-set-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
              <input
                type="text"
                value={formData.gradeLevel}
                onChange={(e) => handleChange('gradeLevel', e.target.value)}
                className={`input-field ${errors.gradeLevel ? 'border-red-300' : ''}`}
                placeholder="e.g., Class 1-5, Grade 6-8"
              />
              {errors.gradeLevel && <p className="mt-1 text-sm text-red-600">{errors.gradeLevel}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Board</label>
              <input
                type="text"
                value={formData.board}
                onChange={(e) => handleChange('board', e.target.value)}
                className="input-field"
                placeholder="e.g., CBSE, ICSE, State Board"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
              <input
                type="text"
                value={formData.ageGroup}
                onChange={(e) => handleChange('ageGroup', e.target.value)}
                className="input-field"
                placeholder="e.g., 5-10 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus Year</label>
              <input
                type="text"
                value={formData.syllabusYear}
                onChange={(e) => handleChange('syllabusYear', e.target.value)}
                className="input-field"
                placeholder="2023-24"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="input-field"
              placeholder="School set description"
            />
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items *</label>
            <div className="border rounded-lg p-4 space-y-4">
              {/* Add Item Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={newItem.productName}
                    onChange={(e) => setNewItem(prev => ({ ...prev, productName: e.target.value }))}
                    className="input-field"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={addItem} className="btn btn-secondary w-full">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items && formData.items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Items in Set:</h4>
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-gray-500 ml-2">Qty: {item.quantity} × ₹{item.unitPrice}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="text-right font-medium text-lg">
                    Total: ₹{calculateTotalPrice()}
                  </div>
                </div>
              )}
            </div>
            {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items}</p>}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Set Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className={`input-field ${errors.price ? 'border-red-300' : ''}`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice || ''}
                onChange={(e) => handleChange('costPrice', parseFloat(e.target.value) || 0)}
                className="input-field"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="input-field flex-1"
                placeholder="Image URL"
              />
              <button type="button" onClick={addImage} className="btn btn-secondary">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images?.map((url, idx) => (
                <div key={idx} className="relative">
                  <img src={url} alt={`School set ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
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
                checked={formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (schoolSet ? 'Update School Set' : 'Create School Set')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolSetForm;
