import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BookSeries } from '../../services/bookService';

interface BookSeriesFormProps {
  bookSeries?: BookSeries;
  onSubmit: (seriesData: Partial<BookSeries>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  authors?: Array<{ _id: string; name: string }>;
  publishers?: Array<{ _id: string; name: string }>;
}

const BookSeriesForm: React.FC<BookSeriesFormProps> = ({
  bookSeries,
  onSubmit,
  onCancel,
  isLoading = false,
  authors = [],
  publishers = [],
}) => {
  const [formData, setFormData] = useState({
    name: bookSeries?.name || '',
    slug: bookSeries?.slug || '',
    description: bookSeries?.description || '',
    authorId: bookSeries?.authorId || '',
    publisherId: bookSeries?.publisherId || '',
    genre: bookSeries?.genre || '',
    ageGroup: bookSeries?.ageGroup || '',
    isActive: bookSeries?.isActive ?? true,
    isOngoing: bookSeries?.isOngoing ?? false,
    firstPublishedYear: bookSeries?.firstPublishedYear || undefined,
    lastPublishedYear: bookSeries?.lastPublishedYear || undefined,
    coverImageUrl: bookSeries?.coverImageUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Series name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const seriesData = {
      ...formData,
      firstPublishedYear: formData.firstPublishedYear || undefined,
      lastPublishedYear: formData.lastPublishedYear || undefined,
    };
    
    await onSubmit(seriesData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const generateSlug = () => {
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    handleChange('slug', slug);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-3xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {bookSeries ? 'Edit Book Series' : 'Add New Book Series'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Series Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter series name"
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
                  placeholder="series-slug"
                />
                <button type="button" onClick={generateSlug} className="btn btn-secondary">Generate</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <select
                value={formData.authorId}
                onChange={(e) => handleChange('authorId', e.target.value)}
                className="input-field"
              >
                <option value="">Select Author</option>
                {authors.map(author => (
                  <option key={author._id} value={author._id}>{author.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
              <select
                value={formData.publisherId}
                onChange={(e) => handleChange('publisherId', e.target.value)}
                className="input-field"
              >
                <option value="">Select Publisher</option>
                {publishers.map(publisher => (
                  <option key={publisher._id} value={publisher._id}>{publisher.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => handleChange('genre', e.target.value)}
                className="input-field"
                placeholder="e.g., Fantasy, Science Fiction, Mystery"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
              <input
                type="text"
                value={formData.ageGroup}
                onChange={(e) => handleChange('ageGroup', e.target.value)}
                className="input-field"
                placeholder="e.g., Young Adult, Children, Adult"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Published Year</label>
              <input
                type="number"
                value={formData.firstPublishedYear || ''}
                onChange={(e) => handleChange('firstPublishedYear', e.target.value ? parseInt(e.target.value) : undefined)}
                className="input-field"
                placeholder="e.g., 2010"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Published Year</label>
              <input
                type="number"
                value={formData.lastPublishedYear || ''}
                onChange={(e) => handleChange('lastPublishedYear', e.target.value ? parseInt(e.target.value) : undefined)}
                className="input-field"
                placeholder="e.g., 2023"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                className="input-field"
                placeholder="https://example.com/cover.jpg"
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
              placeholder="Enter series description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isOngoing}
                  onChange={(e) => handleChange('isOngoing', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Ongoing Series</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (bookSeries ? 'Update Series' : 'Create Series')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookSeriesForm;
