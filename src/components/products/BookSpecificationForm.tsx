import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BookSpecification } from '../../services/bookSpecificationService';

interface BookSpecificationFormProps {
  specification?: BookSpecification;
  products?: Array<{ _id: string; name: string }>;
  onSubmit: (data: Partial<BookSpecification>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const BOOK_FORMATS = ['hardcover', 'paperback', 'ebook', 'audiobook'];
const BOOK_LANGUAGES = ['english', 'hindi', 'bengali', 'tamil', 'telugu', 'marathi', 'gujarati', 'kannada', 'malayalam', 'punjabi'];
const BOOK_SUBJECTS = ['mathematics', 'science', 'english', 'hindi', 'social_studies', 'history', 'geography', 'physics', 'chemistry', 'biology', 'computer_science', 'economics', 'commerce', 'accountancy', 'business_studies'];

const BookSpecificationForm: React.FC<BookSpecificationFormProps> = ({
  specification,
  products = [],
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<BookSpecification>>({
    productId: specification?.productId || '',
    isbn: specification?.isbn || '',
    isbn13: specification?.isbn13 || '',
    isbn10: specification?.isbn10 || '',
    format: specification?.format || 'paperback',
    language: specification?.language || 'english',
    pageCount: specification?.pageCount,
    dimensions: specification?.dimensions || { length: 0, width: 0, height: 0 },
    weight: specification?.weight,
    publicationDate: specification?.publicationDate,
    edition: specification?.edition || '',
    volume: specification?.volume || '',
    seriesName: specification?.seriesName || '',
    seriesNumber: specification?.seriesNumber,
    ageGroup: specification?.ageGroup || '',
    gradeLevel: specification?.gradeLevel || '',
    subject: specification?.subject,
    board: specification?.board || '',
    syllabusYear: specification?.syllabusYear || '',
    authors: specification?.authors || [],
    editors: specification?.editors || [],
    illustrators: specification?.illustrators || [],
    publisher: specification?.publisher || '',
    publisherId: specification?.publisherId || '',
    authorId: specification?.authorId || '',
    bookSeriesId: specification?.bookSeriesId || '',
    tableOfContents: specification?.tableOfContents || '',
    summary: specification?.summary || '',
    keyFeatures: specification?.keyFeatures || [],
    learningObjectives: specification?.learningObjectives || [],
    prerequisites: specification?.prerequisites || '',
    targetAudience: specification?.targetAudience || '',
    coverImageUrl: specification?.coverImageUrl || '',
    samplePages: specification?.samplePages || [],
    hasDigitalVersion: specification?.hasDigitalVersion || false,
    hasAudioVersion: specification?.hasAudioVersion || false,
  });

  const [newAuthor, setNewAuthor] = useState('');
  const [newEditor, setNewEditor] = useState('');
  const [newIllustrator, setNewIllustrator] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }
    if (!formData.format) {
      newErrors.format = 'Format is required';
    }
    if (!formData.language) {
      newErrors.language = 'Language is required';
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

  const addItem = (field: 'authors' | 'editors' | 'illustrators' | 'keyFeatures' | 'learningObjectives', item: string) => {
    if (item.trim() && !formData[field]?.includes(item.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), item.trim()],
      }));
    }
  };

  const removeItem = (field: 'authors' | 'editors' | 'illustrators' | 'keyFeatures' | 'learningObjectives', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter(i => i !== item) || [],
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-5xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {specification ? 'Edit Book Specification' : 'Add Book Specification'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
              <select
                value={formData.productId}
                onChange={(e) => handleChange('productId', e.target.value)}
                className={`input-field ${errors.productId ? 'border-red-300' : ''}`}
              >
                <option value="">Select Product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                className="input-field"
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ISBN-13</label>
              <input
                type="text"
                value={formData.isbn13}
                onChange={(e) => handleChange('isbn13', e.target.value)}
                className="input-field"
                placeholder="9780123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ISBN-10</label>
              <input
                type="text"
                value={formData.isbn10}
                onChange={(e) => handleChange('isbn10', e.target.value)}
                className="input-field"
                placeholder="0123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format *</label>
              <select
                value={formData.format}
                onChange={(e) => handleChange('format', e.target.value)}
                className={`input-field ${errors.format ? 'border-red-300' : ''}`}
              >
                {BOOK_FORMATS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className={`input-field ${errors.language ? 'border-red-300' : ''}`}
              >
                {BOOK_LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Count</label>
              <input
                type="number"
                value={formData.pageCount || ''}
                onChange={(e) => handleChange('pageCount', e.target.value ? parseInt(e.target.value) : undefined)}
                className="input-field"
                placeholder="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (grams)</label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => handleChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="input-field"
                placeholder="400"
              />
            </div>
          </div>

          {/* Educational Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={formData.subject || ''}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Subject</option>
                  {BOOK_SUBJECTS.map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                <input
                  type="text"
                  value={formData.gradeLevel}
                  onChange={(e) => handleChange('gradeLevel', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Class 9, Grade 10"
                />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus Year</label>
                <input
                  type="text"
                  value={formData.syllabusYear}
                  onChange={(e) => handleChange('syllabusYear', e.target.value)}
                  className="input-field"
                  placeholder="2023-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <input
                  type="text"
                  value={formData.ageGroup}
                  onChange={(e) => handleChange('ageGroup', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 11-14 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Edition</label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={(e) => handleChange('edition', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 3rd Edition"
                />
              </div>
            </div>
          </div>

          {/* Authors, Editors, Publishers */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Publication Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Authors</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Author name"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('authors', newAuthor), setNewAuthor(''))}
                  />
                  <button type="button" onClick={() => { addItem('authors', newAuthor); setNewAuthor(''); }} className="btn btn-secondary">
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.authors?.map((author, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {author}
                      <button type="button" onClick={() => removeItem('authors', author)} className="ml-1">
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => handleChange('publisher', e.target.value)}
                  className="input-field"
                  placeholder="Publisher name"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (specification ? 'Update Specification' : 'Create Specification')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookSpecificationForm;
