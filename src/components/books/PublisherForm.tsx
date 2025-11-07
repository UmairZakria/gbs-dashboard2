import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Publisher } from '../../services/bookService';

interface PublisherFormProps {
  publisher?: Publisher;
  onSubmit: (publisherData: Partial<Publisher>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PublisherForm: React.FC<PublisherFormProps> = ({
  publisher,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: publisher?.name || '',
    slug: publisher?.slug || '',
    description: publisher?.description || '',
    website: publisher?.website || '',
    email: publisher?.email || '',
    phone: publisher?.phone || '',
    foundedYear: publisher?.foundedYear || undefined,
    logoUrl: publisher?.logoUrl || '',
    isActive: publisher?.isActive ?? true,
    address: publisher?.address || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    specialties: publisher?.specialties || [],
    imprints: publisher?.imprints || [],
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newImprint, setNewImprint] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Publisher name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const publisherData = {
      ...formData,
      address: Object.values(formData.address).some(val => val) ? formData.address : undefined,
      specialties: formData.specialties.length > 0 ? formData.specialties : undefined,
      imprints: formData.imprints.length > 0 ? formData.imprints : undefined,
      foundedYear: formData.foundedYear || undefined,
    };
    
    await onSubmit(publisherData);
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

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty),
    }));
  };

  const addImprint = () => {
    if (newImprint.trim() && !formData.imprints.includes(newImprint.trim())) {
      setFormData(prev => ({
        ...prev,
        imprints: [...prev.imprints, newImprint.trim()],
      }));
      setNewImprint('');
    }
  };

  const removeImprint = (imprint: string) => {
    setFormData(prev => ({
      ...prev,
      imprints: prev.imprints.filter(i => i !== imprint),
    }));
  };

  const generateSlug = () => {
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    handleChange('slug', slug);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {publisher ? 'Edit Publisher' : 'Add New Publisher'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publisher Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter publisher name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="input-field flex-1"
                  placeholder="publisher-slug"
                />
                <button type="button" onClick={generateSlug} className="btn btn-secondary">Generate</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="input-field"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="input-field"
                placeholder="contact@publisher.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="input-field"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
              <input
                type="number"
                value={formData.foundedYear || ''}
                onChange={(e) => handleChange('foundedYear', e.target.value ? parseInt(e.target.value) : undefined)}
                className="input-field"
                placeholder="e.g., 1990"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                className="input-field"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Enter publisher description"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="input-field"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="input-field"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="input-field"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  className="input-field"
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="input-field"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                className="input-field flex-1"
                placeholder="Add a specialty"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <button type="button" onClick={addSpecialty} className="btn btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((specialty, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {specialty}
                  <button type="button" onClick={() => removeSpecialty(specialty)} className="ml-1 text-purple-600 hover:text-purple-800">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imprints</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newImprint}
                onChange={(e) => setNewImprint(e.target.value)}
                className="input-field flex-1"
                placeholder="Add an imprint"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImprint())}
              />
              <button type="button" onClick={addImprint} className="btn btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.imprints.map((imprint, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {imprint}
                  <button type="button" onClick={() => removeImprint(imprint)} className="ml-1 text-yellow-600 hover:text-yellow-800">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (publisher ? 'Update Publisher' : 'Create Publisher')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublisherForm;
