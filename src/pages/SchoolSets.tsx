import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { schoolSetService, SchoolSet } from '../services/schoolSetService';
import SchoolSetForm from '../components/products/SchoolSetForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const SchoolSets: React.FC = () => {
  const [schoolSets, setSchoolSets] = useState<SchoolSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingSet, setEditingSet] = useState<SchoolSet | null>(null);

  useEffect(() => {
    fetchSchoolSets();
  }, [currentPage, searchTerm]);

  const fetchSchoolSets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await schoolSetService.getSchoolSets(currentPage, 10);
      if (response.success && response.data) {
        setSchoolSets(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching school sets:', err);
      setError(err.response?.data?.message || 'Failed to load school sets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this school set?')) {
      try {
        await schoolSetService.deleteSchoolSet(id);
        await fetchSchoolSets();
      } catch (err) {
        console.error('Error deleting school set:', err);
        alert('Failed to delete school set');
      }
    }
  };

  const handleEdit = (set: SchoolSet) => {
    setEditingSet(set);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSet(null);
    setShowForm(true);
  };

  const handleSubmit = async (data: Partial<SchoolSet>) => {
    try {
      if (editingSet?._id) {
        await schoolSetService.updateSchoolSet(editingSet._id, data);
      } else {
        await schoolSetService.createSchoolSet(data);
      }
      setShowForm(false);
      setEditingSet(null);
      await fetchSchoolSets();
    } catch (err) {
      console.error('Error saving school set:', err);
      alert('Failed to save school set');
    }
  };

  if (isLoading && schoolSets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error && schoolSets.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchSchoolSets} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Sets</h1>
          <p className="mt-1 text-sm text-gray-500">Manage school supply sets and packages</p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add School Set
        </button>
      </div>

      <div className="card">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search school sets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="card">
        {schoolSets.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">No school sets</h3>
            <p className="text-sm text-gray-500">Get started by creating a school set.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schoolSets.map((set) => (
                <tr key={set._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{set.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{set.gradeLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{set.items?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{set.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${set.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {set.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(set)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(set._id!)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-4 w-4" /></button>
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
        <SchoolSetForm
          schoolSet={editingSet || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingSet(null);
          }}
        />
      )}
    </div>
  );
};

export default SchoolSets;
