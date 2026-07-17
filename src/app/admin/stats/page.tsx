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
      <h1 className="text-4xl font-black text-foreground">Stats</h1>

      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">{editingId ? 'Edit' : 'Add'} Stat</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('label')} placeholder="Label" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" required />
            <input {...register('value')} placeholder="Value (e.g., 15+)" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" required />
            <input {...register('suffix')} placeholder="Suffix" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
            <input {...register('icon')} placeholder="Icon" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
            <input type="number" {...register('order')} placeholder="Order" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
              <span className="text-sm text-muted">Active</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-primary text-foreground rounded-lg">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-6 py-2 border border-border text-muted rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs text-muted">Icon</th>
              <th className="px-6 py-4 text-left text-xs text-muted">Label</th>
              <th className="px-6 py-4 text-left text-xs text-muted">Value</th>
              <th className="px-6 py-4 text-left text-xs text-muted">Status</th>
              <th className="px-6 py-4 text-right text-xs text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stats.map((stat) => (
              <tr key={stat._id}>
                <td className="px-6 py-4 text-2xl">{stat.icon}</td>
                <td className="px-6 py-4 text-foreground">{stat.label}</td>
                <td className="px-6 py-4 text-foreground">{stat.value}{stat.suffix}</td>
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
    </div>
  );
}