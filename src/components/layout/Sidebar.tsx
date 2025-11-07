import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CogIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  Bars3Icon,
  ArchiveBoxIcon,
  TruckIcon,
  CurrencyDollarIcon,
  GiftIcon,
  BookOpenIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation: SidebarItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingBagIcon },
    { name: 'Product Setup', href: '/dashboard/product-setup', icon: BuildingStorefrontIcon },
    { name: 'Inventory', href: '/dashboard/inventory', icon: ArchiveBoxIcon },
    { name: 'Suppliers', href: '/dashboard/suppliers', icon: TruckIcon },
    { name: 'Pricing Rules', href: '/dashboard/pricing', icon: CurrencyDollarIcon },
    { name: 'Gift Services', href: '/dashboard/gifts', icon: GiftIcon },
    { name: 'Books', href: '/dashboard/books', icon: BookOpenIcon },
    { name: 'Book Specs', href: '/dashboard/book-specifications', icon: DocumentTextIcon },
    { name: 'Uniforms', href: '/dashboard/uniforms', icon: AcademicCapIcon },
    { name: 'School Sets', href: '/dashboard/school-sets', icon: BriefcaseIcon },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'Customers', href: '/dashboard/customers', icon: UsersIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Ecommerce</span>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">Ecommerce</span>
        </div>
        
        {/* User info */}
        <div className="mt-5 px-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
              {item.badge && (
                <span className="ml-auto bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="text-xs text-gray-500 text-center">
            © 2024 Ecommerce Dashboard
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 