import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Author } from '../../services/bookService';

interface AuthorFormProps {
  author?: Author;
  onSubmit: (authorData: Partial<Author>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AuthorForm: React.FC<AuthorFormProps> = ({
  author,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: author?.name || '',
    slug: author?.slug || '',
    biography: author?.biography || '',
    dateOfBirth: author?.dateOfBirth || '',
    dateOfDeath: author?.dateOfDeath || '',
    nationality: author?.nationality || '',
    website: author?.website || '',
    photoUrl: author?.photoUrl || '',
    isActive: author?.isActive ?? true,
    socialMedia: author?.socialMedia || {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
    },
    awards: author?.awards || [],
    genres: author?.genres || [],
  });

  const [newAward, setNewAward] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Author name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    await onSubmit({
      ...formData,
      socialMedia: Object.values(formData.socialMedia).some(val => val) ? formData.socialMedia : undefined,
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const addAward = () => {
    if (newAward.trim() && !formData.awards.includes(newAward.trim())) {
      setFormData(prev => ({
        ...prev,
        awards: [...prev.awards, newAward.trim()],
      }));
      setNewAward('');
    }
  };

  const removeAward = (award: string) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter(a => a !== award),
    }));
  };

  const addGenre = () => {
    if (newGenre.trim() && !formData.genres.includes(newGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre.trim()],
      }));
      setNewGenre('');
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre),
    }));
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
            {author ? 'Edit Author' : 'Add New Author'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter author name"
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
                  placeholder="author-slug"
                />
                <button type="button" onClick={generateSlug} className="btn btn-secondary">Generate</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                className="input-field"
                placeholder="e.g., American, British"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Death</label>
              <input
                type="date"
                value={formData.dateOfDeath}
                onChange={(e) => handleChange('dateOfDeath', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
              <input
                type="url"
                value={formData.photoUrl}
                onChange={(e) => handleChange('photoUrl', e.target.value)}
                className="input-field"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
            <textarea
              value={formData.biography}
              onChange={(e) => handleChange('biography', e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Enter author biography"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="text"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  className="input-field"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="text"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  className="input-field"
                  placeholder="facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  className="input-field"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="text"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                  className="input-field"
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Awards</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAward}
                onChange={(e) => setNewAward(e.target.value)}
                className="input-field flex-1"
                placeholder="Add an award"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAward())}
              />
              <button type="button" onClick={addAward} className="btn btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.awards.map((award, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {award}
                  <button type="button" onClick={() => removeAward(award)} className="ml-1 text-green-600 hover:text-green-800">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genres</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="input-field flex-1"
                placeholder="Add a genre"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
              />
              <button type="button" onClick={addGenre} className="btn btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.genres.map((genre, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {genre}
                  <button type="button" onClick={() => removeGenre(genre)} className="ml-1 text-blue-600 hover:text-blue-800">
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
              {isLoading ? 'Saving...' : (author ? 'Update Author' : 'Create Author')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorForm;
