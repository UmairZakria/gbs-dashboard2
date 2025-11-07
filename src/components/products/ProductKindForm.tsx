import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ProductKindDto, ProductKindField } from '../../services/productKindService';

interface ProductKindFormProps {
  kind?: ProductKindDto;
  onSubmit: (data: Partial<ProductKindDto>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const emptyField: ProductKindField = {
  name: '',
  label: '',
  type: 'text',
  required: false,
  options: [],
  placeholder: '',
};

const ProductKindForm: React.FC<ProductKindFormProps> = ({ kind, onSubmit, onCancel, isLoading = false }) => {
  const [form, setForm] = useState<Partial<ProductKindDto>>({
    key: kind?.key || '',
    name: kind?.name || '',
    description: kind?.description || '',
    isActive: kind?.isActive ?? true,
    fields: kind?.fields || [emptyField],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.key?.trim()) e.key = 'Key is required';
    if (!form.name?.trim()) e.name = 'Name is required';
    if (!form.fields || form.fields.length === 0) e.fields = 'At least one field is required';
    form.fields?.forEach((f, i) => {
      if (!f.name.trim()) e[`field-${i}-name`] = 'Field name required';
      if (!f.label.trim()) e[`field-${i}-label`] = 'Label required';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const updateField = (index: number, patch: Partial<ProductKindField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields?.map((f, i) => (i === index ? { ...f, ...patch } : f)) || [],
    }));
  };

  const addField = () => {
    setForm(prev => ({ ...prev, fields: [ ...(prev.fields || []), { ...emptyField } ] }));
  };

  const removeField = (index: number) => {
    setForm(prev => ({ ...prev, fields: (prev.fields || []).filter((_, i) => i !== index) }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-3xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{kind ? 'Edit Product Kind' : 'Add Product Kind'}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key *</label>
              <input
                type="text"
                value={form.key}
                onChange={e => setForm(prev => ({ ...prev, key: e.target.value }))}
                className={`input-field ${errors.key ? 'border-red-300' : ''}`}
                placeholder="e.g., book, stationery, gift"
              />
              {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Display name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="input-field"
              placeholder="Describe this product kind"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Fields</h3>
              <button type="button" onClick={addField} className="btn btn-secondary">
                <PlusIcon className="h-4 w-4 mr-2" /> Add Field
              </button>
            </div>

            {errors.fields && <p className="mb-2 text-sm text-red-600">{errors.fields}</p>}

            <div className="space-y-4">
              {(form.fields || []).map((field, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Field {index + 1}</h4>
                    {(form.fields || []).length > 1 && (
                      <button type="button" onClick={() => removeField(index)} className="text-red-600 hover:text-red-800">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={e => updateField(index, { name: e.target.value })}
                        className={`input-field ${errors[`field-${index}-name`] ? 'border-red-300' : ''}`}
                        placeholder="isbn, author, material"
                      />
                      {errors[`field-${index}-name`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`field-${index}-name`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={e => updateField(index, { label: e.target.value })}
                        className={`input-field ${errors[`field-${index}-label`] ? 'border-red-300' : ''}`}
                        placeholder="ISBN, Author, Material"
                      />
                      {errors[`field-${index}-label`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`field-${index}-label`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={field.type}
                        onChange={e => updateField(index, { type: e.target.value as any })}
                        className="input-field"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="select">Select</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!field.required}
                          onChange={e => updateField(index, { required: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Required</span>
                      </label>
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma separated)</label>
                        <input
                          type="text"
                          value={(field.options || []).join(', ')}
                          onChange={e => updateField(index, { options: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
                          className="input-field"
                          placeholder="Hardcover, Paperback"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={e => updateField(index, { placeholder: e.target.value })}
                          className="input-field"
                          placeholder="Select an option"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : (kind ? 'Update Kind' : 'Create Kind')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductKindForm;

