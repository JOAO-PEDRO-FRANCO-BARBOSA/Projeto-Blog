'use client';

import { ReactNode } from 'react';

type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type AdminTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyState: string;
};

export function AdminTable<T>({ columns, rows, emptyState }: AdminTableProps<T>) {
  if (rows.length === 0) {
    return <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 text-sm text-gray-400">{emptyState}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
      <table className="min-w-full divide-y divide-gray-800 text-left text-sm">
        <thead className="bg-gray-900">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className={`px-4 py-3 font-medium text-gray-300 ${column.className || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="align-top">
              {columns.map((column) => (
                <td key={column.header} className={`px-4 py-4 text-gray-100 ${column.className || ''}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
