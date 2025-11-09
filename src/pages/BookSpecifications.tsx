import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { bookSpecificationService, BookSpecification } from '../services/bookSpecificationService';
import { productService } from '../services/productService';
import BookSpecificationForm from '../components/products/BookSpecificationForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const BookSpecifications: React.FC = () => {
  const [specifications, setSpecifications] = useState<BookSpecification[]>([]);
  const [products, setProducts] = useState<Array<{ _id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingSpec, setEditingSpec] = useState<BookSpecification | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productService.getProducts({}, 1, 100);
      if (response.success && response.data?.products) {
        setProducts(response.data.products.map((p: any) => ({ _id: p._id, name: p.name })));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, []);

  const fetchSpecifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await bookSpecificationService.getBookSpecifications(currentPage, 10);
      if (response.success && response.data) {
        setSpecifications(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching book specifications:', err);
      setError(err.response?.data?.message || 'Failed to load specifications');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchSpecifications();
    fetchProducts();
  }, [fetchSpecifications, fetchProducts]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book specification?')) {
      try {
        await bookSpecificationService.deleteBookSpecification(id);
        await fetchSpecifications();
      } catch (err) {
        console.error('Error deleting specification:', err);
        alert('Failed to delete specification');
      }
    }
  };

  const handleEdit = (spec: BookSpecification) => {
    setEditingSpec(spec);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSpec(null);
    setShowForm(true);
  };

  const handleSubmit = async (data: Partial<BookSpecification>) => {
    try {
      if (editingSpec?._id) {
        await bookSpecificationService.updateBookSpecification(editingSpec._id, data);
      } else {
        await bookSpecificationService.createBookSpecification(data);
      }
      setShowForm(false);
      setEditingSpec(null);
      await fetchSpecifications();
    } catch (err) {
      console.error('Error saving specification:', err);
      alert('Failed to save specification');
    }
  };

  if (isLoading && specifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error && specifications.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchSpecifications}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Specifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage book specifications and details
          </p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Specification
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search book specifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Specifications table */}
      <div className="card">
        {specifications.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No specifications</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a book specification.</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {specifications.map((spec) => (
                  <tr key={spec._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {spec.isbn || spec.isbn10 || spec.isbn13 || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {spec.format}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {spec.language}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {spec.subject || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {spec.gradeLevel || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(spec)} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(spec._id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <BookSpecificationForm
          specification={editingSpec || undefined}
          products={products}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingSpec(null);
          }}
        />
      )}
    </div>
  );
};

export default BookSpecifications;
