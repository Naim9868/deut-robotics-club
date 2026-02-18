'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface StatForm {
  label: string;
  value: string;
  suffix: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<StatForm>({
    defaultValues: {
      label: '',
      value: '',
      suffix: '',
      icon: '📊',
      order: 0,
      isActive: true
    }
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
      // console.log(data);
    } catch (error) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: StatForm) => {
    try {
      const res = await fetch(`/api/stats${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Created');
        reset();
        setEditingId(null);
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleEdit = (stat: any) => {
    setEditingId(stat._id);
    reset(stat);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      const res = await fetch(`/api/stats/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">Stats</h1>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} Stat</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input {...register('label')} placeholder="Label" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input {...register('value')} placeholder="Value (e.g., 15+)" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input {...register('suffix')} placeholder="Suffix" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
            <input {...register('icon')} placeholder="Icon" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
            <input type="number" {...register('order')} placeholder="Order" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-6 py-2 border border-white/10 text-gray-400 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Icon</th>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Label</th>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Value</th>
              <th className="px-6 py-4 text-left text-xs text-gray-400">Status</th>
              <th className="px-6 py-4 text-right text-xs text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stats.map((stat) => (
              <tr key={stat._id}>
                <td className="px-6 py-4 text-2xl">{stat.icon}</td>
                <td className="px-6 py-4 text-white">{stat.label}</td>
                <td className="px-6 py-4 text-white">{stat.value}{stat.suffix}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${stat.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {stat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(stat)} className="text-blue-500 hover:text-blue-400">Edit</button>
                  <button onClick={() => handleDelete(stat._id)} className="text-red-500 hover:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}