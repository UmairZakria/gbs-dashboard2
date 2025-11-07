import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Uniform } from '../../types';

interface UniformFormProps {
  uniform?: Uniform;
  onSubmit: (data: Partial<Uniform>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const UNIFORM_TYPES = ['school', 'sports', 'formal', 'casual'];
const GENDER_OPTIONS = ['unisex', 'boys', 'girls'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const UniformForm: React.FC<UniformFormProps> = ({
  uniform,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Uniform>>({
    name: uniform?.name || '',
    slug: uniform?.slug || '',
    description: uniform?.description || '',
    schoolName: uniform?.schoolName || '',
    gradeLevel: uniform?.gradeLevel || '',
    type: uniform?.type || 'school',
    gender: uniform?.gender || 'unisex',
    sizes: uniform?.sizes || [],
    colors: uniform?.colors || [],
    materials: uniform?.materials || [],
    careInstructions: uniform?.careInstructions || '',
    season: uniform?.season || '',
    price: uniform?.price || 0,
    costPrice: uniform?.costPrice || 0,
    sku: uniform?.sku || '',
    barcode: uniform?.barcode || '',
    weight: uniform?.weight || 0,
    dimensions: uniform?.dimensions || { length: 0, width: 0, height: 0 },
    images: uniform?.images || [],
    specifications: uniform?.specifications || {},
    isActive: uniform?.isActive ?? true,
    isFeatured: uniform?.isFeatured ?? false,
    tags: uniform?.tags || [],
    metaTitle: uniform?.metaTitle || '',
    metaDescription: uniform?.metaDescription || '',
    seoKeywords: uniform?.seoKeywords || [],
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.schoolName?.trim()) {
      newErrors.schoolName = 'School name is required';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
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

  const addItem = (field: 'sizes' | 'colors' | 'materials' | 'tags' | 'seoKeywords', item: string) => {
    if (item.trim() && !formData[field]?.includes(item.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), item.trim()],
      }));
    }
  };

  const removeItem = (field: 'sizes' | 'colors' | 'materials' | 'tags' | 'seoKeywords', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter(i => i !== item) || [],
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {uniform ? 'Edit Uniform' : 'Add Uniform'}
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
                placeholder="Uniform name"
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
                placeholder="uniform-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className={`input-field ${errors.schoolName ? 'border-red-300' : ''}`}
                placeholder="School name"
              />
              {errors.schoolName && <p className="mt-1 text-sm text-red-600">{errors.schoolName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <input
                type="text"
                value={formData.gradeLevel}
                onChange={(e) => handleChange('gradeLevel', e.target.value)}
                className="input-field"
                placeholder="e.g., Class 1-5, Grade 6-8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={`input-field ${errors.type ? 'border-red-300' : ''}`}
              >
                {UNIFORM_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="input-field"
              >
                {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
              </select>
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
              placeholder="Uniform description"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
            <div className="flex gap-2 mb-2">
              <select
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="input-field flex-1"
              >
                <option value="">Select Size</option>
                {SIZE_OPTIONS.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
              <button type="button" onClick={() => { addItem('sizes', newSize); setNewSize(''); }} className="btn btn-secondary">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes?.map((size, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {size}
                  <button type="button" onClick={() => removeItem('sizes', size)} className="ml-1">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="input-field flex-1"
                placeholder="Color name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('colors', newColor), setNewColor(''))}
              />
              <button type="button" onClick={() => { addItem('colors', newColor); setNewColor(''); }} className="btn btn-secondary">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors?.map((color, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {color}
                  <button type="button" onClick={() => removeItem('colors', color)} className="ml-1">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
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
                  <img src={url} alt={`Uniform ${idx + 1}`} className="w-full h-24 object-cover rounded" />
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
              {isLoading ? 'Saving...' : (uniform ? 'Update Uniform' : 'Create Uniform')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniformForm;
