import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  FolderIcon,
  BuildingStorefrontIcon,
  CogIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Category, Brand } from '../types';
import { ProductKindDto, productKindService } from '../services/productKindService';
import ProductKindForm from '../components/products/ProductKindForm';
import CategoryForm from '../components/products/CategoryForm';
import BrandForm from '../components/products/BrandForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';

const ProductSetup: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kinds, setKinds] = useState<ProductKindDto[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showKindForm, setShowKindForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingKind, setEditingKind] = useState<ProductKindDto | null>(null);

  useEffect(() => {
    fetchSetupData();
  }, []);

  const fetchSetupData = async () => {
    try {
      setIsLoading(true);
      const categoriesResponse = await categoryService.getCategories();
      const brandsResponse = await brandService.getBrands();
      const kindsResponse = await productKindService.getKinds();
      
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
      
      if (brandsResponse.success && brandsResponse.data) {
        setBrands(brandsResponse.data);
      }
      if (kindsResponse.success && kindsResponse.data) {
        const data: any = kindsResponse.data;
        setKinds((data.data as any) || (data as any));
      }
    } catch (error) {
      console.error('Error fetching setup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySubmit = async (categoryData: Partial<Category>) => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, categoryData);
      } else {
        await categoryService.createCategory(categoryData);
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      await fetchSetupData();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleBrandSubmit = async (brandData: Partial<Brand>) => {
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand._id, brandData);
      } else {
        await brandService.createBrand(brandData);
      }
      setShowBrandForm(false);
      setEditingBrand(null);
      await fetchSetupData();
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleKindSubmit = async (kindData: Partial<ProductKindDto>) => {
    try {
      if (editingKind) {
        await productKindService.updateKind(editingKind._id, kindData);
      } else {
        await productKindService.createKind(kindData);
      }
      setShowKindForm(false);
      setEditingKind(null);
      await fetchSetupData();
    } catch (error) {
      console.error('Error saving product kind:', error);
    }
  };

  const handleEditKind = (kind: ProductKindDto) => {
    setEditingKind(kind);
    setShowKindForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setShowBrandForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Setup</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your product catalog structure, categories, and brands
        </p>
      </div>

      {/* Setup Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              <p className="text-sm text-gray-500">{categories.length} categories</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setShowCategoryForm(true)}
              className="btn btn-primary w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingStorefrontIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Brands</h3>
              <p className="text-sm text-gray-500">{brands.length} brands</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setShowBrandForm(true)}
              className="btn btn-primary w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Brand
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CogIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Product Kinds</h3>
              <p className="text-sm text-gray-500">{kinds.length} kinds</p>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => setShowKindForm(true)} className="btn btn-primary w-full">
              <PlusIcon className="h-4 w-4 mr-2" /> Add Product Kind
            </button>
          </div>
        </div>
      </div>
      {/* Product Kinds Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Product Kinds</h2>
          <button onClick={() => setShowKindForm(true)} className="btn btn-primary">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Product Kind
          </button>
        </div>

        {kinds.length === 0 ? (
          <div className="text-center py-12">
            <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No product kinds</h3>
            <p className="mt-1 text-sm text-gray-500">Define kinds like Book, Stationery, Gift with custom fields.</p>
            <div className="mt-6">
              <button onClick={() => setShowKindForm(true)} className="btn btn-primary">
                <PlusIcon className="h-4 w-4 mr-2" /> Add Product Kind
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kinds.map((kind) => (
                  <tr key={kind._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kind.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kind.key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kind.fields.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${kind.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {kind.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditKind(kind)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Product Categories</h2>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first product category.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCategoryForm(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-sm text-gray-500">
                          {category.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Product Brands</h2>
          <button
            onClick={() => setShowBrandForm(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Brand
          </button>
        </div>

        {brands.length === 0 ? (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No brands</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first product brand.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowBrandForm(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Brand
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {brand.logoUrl && (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {brand.name}
                          </div>
                          {brand.description && (
                            <div className="text-sm text-gray-500">
                              {brand.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {brand.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="capitalize">{brand.level}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {brand.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {brand.isFeatured && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800`}>
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditBrand(brand)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-center">
              <PlusIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Add New Product</h4>
                <p className="text-sm text-gray-500">Create a new product listing</p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>

          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-center">
              <CogIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Product Settings</h4>
                <p className="text-sm text-gray-500">Configure product preferences</p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory || undefined}
          parentCategories={categories}
          onSubmit={handleCategorySubmit}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Brand Form Modal */}
      {showBrandForm && (
        <BrandForm
          brand={editingBrand || undefined}
          onSubmit={handleBrandSubmit}
          onCancel={() => {
            setShowBrandForm(false);
            setEditingBrand(null);
          }}
        />
      )}

      {/* Product Kind Form Modal */}
      {showKindForm && (
        <ProductKindForm
          kind={editingKind || undefined}
          onSubmit={handleKindSubmit}
          onCancel={() => {
            setShowKindForm(false);
            setEditingKind(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductSetup; 