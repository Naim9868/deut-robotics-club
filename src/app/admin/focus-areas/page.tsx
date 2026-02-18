'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface FocusForm {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export default function FocusAreasPage() {
  const router = useRouter();
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<FocusForm>({
    defaultValues: {
      title: '',
      description: '',
      icon: '🤖',
      color: '#e63946',
      order: 0,
      isActive: true
    }
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await fetch('/api/focus-areas');
      const data = await res.json();
      setAreas(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FocusForm) => {
    try {
      const res = await fetch(`/api/focus-areas${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Created');
        reset();
        setEditingId(null);
        fetchAreas();
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleEdit = (area: any) => {
    setEditingId(area._id);
    reset(area);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      const res = await fetch(`/api/focus-areas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchAreas();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">Focus Areas</h1>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} Focus Area</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input {...register('title')} placeholder="Title" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input {...register('icon')} placeholder="Icon" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input {...register('color')} type="color" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white h-12" />
            <input type="number" {...register('order')} placeholder="Order" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
          </div>
          <textarea {...register('description')} placeholder="Description" rows={3} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
          
          <div className="flex items-center gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => (
          <div key={area._id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl" style={{ color: area.color }}>{area.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{area.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{area.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(area)} className="text-blue-500 text-sm">Edit</button>
                <button onClick={() => handleDelete(area._id)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}