import React from 'react';
import { classNames } from '../../utils/classNames';

export interface Column<T> {
  key: string;
  label: string;
  header?: string;
  render: (item: T, index?: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  data: T[] | any[];
  columns: Array<Column<any>>;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
  hoverable?: boolean;
}

function Table<T>({
  data,
  columns,
  onRowClick,
  className,
  emptyMessage = 'No data available',
  loading = false,
  hoverable = true,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={classNames('overflow-hidden', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={classNames(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={classNames(
                hoverable && onRowClick && 'cursor-pointer hover:bg-gray-50',
                onRowClick && 'transition-colors'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={classNames(
                    'px-6 py-4 whitespace-nowrap text-sm',
                    column.className
                  )}
                >
                  {column.render
                    ? column.render(item, index)
                    : (item as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table; 