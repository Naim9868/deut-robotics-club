'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  basePath: string;
  onDelete?: (id: string) => void;
}

export default function DataTable({ columns, data, basePath, onDelete }: DataTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/${basePath}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Deleted successfully');
        onDelete?.(id);
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-white/5 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-300">
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/${basePath}/${item._id}`}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-bold hover:bg-blue-500/20 transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="inline-flex items-center px-3 py-1 bg-red-500/10 text-red-500 rounded text-xs font-bold hover:bg-red-500/20 transition-all disabled:opacity-50"
                  >
                    {deletingId === item._id ? '...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}