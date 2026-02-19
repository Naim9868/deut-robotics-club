'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

interface GalleryForm {
  title: string;
  description: string;
  image: { url: string; alt: string; publicId?: string };
  category: string;
  tags: string[];
  date: string;
  featured: boolean;
  order: number;
  isActive: boolean;
}

export default function GalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<GalleryForm>({
    defaultValues: {
      title: '',
      description: '',
      category: 'Events',
      tags: [],
      date: new Date().toISOString().split('T')[0],
      featured: false,
      order: 0,
      isActive: true
    }
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: GalleryForm) => {
    try {
      const res = await fetch(`/api/gallery${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Created');
        reset();
        setEditingId(null);
        fetchItems();
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    reset(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchItems();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">Gallery</h1>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} Image</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input {...register('title')} placeholder="Title" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <select {...register('category')} className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white">
              <option value="Events">Events</option>
              <option value="Workshops">Workshops</option>
              <option value="Competitions">Competitions</option>
              <option value="Team">Team</option>
              <option value="Lab">Lab</option>
            </select>
            <input type="date" {...register('date')} className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
          </div>

          <textarea {...register('description')} placeholder="Description" rows={2} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />

          <div>
            <label className="block text-sm text-gray-400 mb-2">Image</label>
            <ImageUpload onUpload={(url) => setValue('image', { url, alt: watch('title') })} defaultValue={watch('image')?.url} />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('featured')} className="w-4 h-4" />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
            <label className="flex items-center gap-2">
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

      <div className="columns-2 md:columns-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="break-inside-avoid mb-4 relative group">
            <img src={item.image?.url} alt={item.title} className="w-full rounded-lg" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-500 text-white text-xs rounded">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-500 text-white text-xs rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}