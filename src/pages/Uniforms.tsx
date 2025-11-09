import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { uniformService, Uniform } from '../services/uniformService';
import UniformForm from '../components/products/UniformForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Uniforms: React.FC = () => {
  const [uniforms, setUniforms] = useState<Uniform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage] = useState(1);
  const [, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingUniform, setEditingUniform] = useState<Uniform | null>(null);

  const fetchUniforms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await uniformService.getUniforms(currentPage, 10);
      if (response.success && response.data) {
        setUniforms(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching uniforms:', err);
      setError(err.response?.data?.message || 'Failed to load uniforms');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUniforms();
  }, [fetchUniforms, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this uniform?')) {
      try {
        await uniformService.deleteUniform(id);
        await fetchUniforms();
      } catch (err) {
        console.error('Error deleting uniform:', err);
        alert('Failed to delete uniform');
      }
    }
  };

  const handleEdit = (uniform: Uniform) => {
    setEditingUniform(uniform);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingUniform(null);
    setShowForm(true);
  };

  const handleSubmit = async (data: Partial<Uniform>) => {
    try {
      if (editingUniform?._id) {
        await uniformService.updateUniform(editingUniform._id, data);
      } else {
        await uniformService.createUniform(data);
      }
      setShowForm(false);
      setEditingUniform(null);
      await fetchUniforms();
    } catch (err) {
      console.error('Error saving uniform:', err);
      alert('Failed to save uniform');
    }
  };

  if (isLoading && uniforms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error && uniforms.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchUniforms} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Uniforms</h1>
          <p className="mt-1 text-sm text-gray-500">Manage school and sports uniforms</p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Uniform
        </button>
      </div>

      <div className="card">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search uniforms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="card">
        {uniforms.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">No uniforms</h3>
            <p className="text-sm text-gray-500">Get started by creating a uniform.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uniforms.map((uniform) => (
                <tr key={uniform._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{uniform.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{uniform.schoolName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{uniform.gradeLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{uniform.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${uniform.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {uniform.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(uniform)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(uniform._id!)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <UniformForm
          uniform={editingUniform || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingUniform(null);
          }}
        />
      )}
    </div>
  );
};

export default Uniforms;
