'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

interface TimelineForm {
  year: string;
  title: string;
  description: string;
  image?: { url: string; alt: string; publicId?: string };
  achievements: string[];
  order: number;
  isActive: boolean;
}

export default function TimelinePage() {
  const router = useRouter();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, control } = useForm<TimelineForm>({
    defaultValues: {
      year: '',
      title: '',
      description: '',
      achievements: [''],
      order: 0,
      isActive: true
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'achievements' });

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const res = await fetch('/api/timeline');
      const data = await res.json();
      setMilestones(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TimelineForm) => {
    try {
      data.achievements = data.achievements.filter(a => a.trim() !== '');
      
      const res = await fetch(`/api/timeline${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Created');
        reset();
        setEditingId(null);
        fetchMilestones();
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    if (!item.achievements?.length) item.achievements = [''];
    reset(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      const res = await fetch(`/api/timeline/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchMilestones();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">Timeline</h1>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} Milestone</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input {...register('year')} placeholder="Year (2015)" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input {...register('title')} placeholder="Title" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
          </div>

          <textarea {...register('description')} placeholder="Description" rows={3} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />

          <div>
            <label className="block text-sm text-gray-400 mb-2">Image (Optional)</label>
            <ImageUpload onUpload={(url) => setValue('image', { url, alt: watch('title') })} defaultValue={watch('image')?.url} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Achievements</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input {...register(`achievements.${index}`)} placeholder={`Achievement ${index + 1}`} className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white" />
                {fields.length > 1 && <button type="button" onClick={() => remove(index)} className="text-red-500">×</button>}
              </div>
            ))}
            <button type="button" onClick={() => append('')} className="mt-2 text-sm text-primary">+ Add Achievement</button>
          </div>

          <div className="flex items-center gap-6">
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

      <div className="space-y-4">
        {milestones.map((item) => (
          <div key={item._id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="text-2xl font-black text-primary">{item.year}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-gray-400 mt-2">{item.description}</p>
                  {item.achievements?.length > 0 && (
                    <ul className="mt-4 space-y-1">
                      {item.achievements.map((ach: string, i: number) => (
                        <li key={i} className="text-sm text-gray-500">• {ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-blue-500 text-sm">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}