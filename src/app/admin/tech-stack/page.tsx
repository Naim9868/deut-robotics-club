'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

interface TechItem {
  name: string;
  use: string;
  icon: string;
  proficiency: number;
  order: number;
}

interface TechStackForm {
  category: string;
  items: TechItem[];
  order: number;
  isActive: boolean;
}

export default function TechStackPage() {
  const router = useRouter();
  const [stacks, setStacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<TechStackForm>({
    defaultValues: {
      category: '',
      items: [{ name: '', use: '', icon: '', proficiency: 80, order: 0 }],
      order: 0,
      isActive: true
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    fetchStacks();
  }, []);

  const fetchStacks = async () => {
    try {
      const res = await fetch('/api/tech-stack');
      const data = await res.json();
      setStacks(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TechStackForm) => {
    try {
      const res = await fetch(`/api/tech-stack${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Created');
        reset();
        setEditingId(null);
        fetchStacks();
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleEdit = (stack: any) => {
    setEditingId(stack._id);
    reset(stack);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      const res = await fetch(`/api/tech-stack/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchStacks();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">Tech Stack</h1>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} Category</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input {...register('category')} placeholder="Category (e.g., Programming)" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input type="number" {...register('order')} placeholder="Order" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Tech Items</label>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-5 gap-2 mb-2">
                <input {...register(`items.${index}.name`)} placeholder="Name" className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" required />
                <input {...register(`items.${index}.use`)} placeholder="Use" className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" required />
                <input {...register(`items.${index}.icon`)} placeholder="Icon" className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" required />
                <input type="number" {...register(`items.${index}.proficiency`)} placeholder="Proficiency" className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => append({ name: '', use: '', icon: '', proficiency: 80, order: fields.length })} className="mt-2 text-sm text-primary">
              + Add Item
            </button>
          </div>

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

      <div className="space-y-4">
        {stacks.map((stack) => (
          <div key={stack._id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary">{stack.category}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(stack)} className="text-blue-500 text-sm">Edit</button>
                <button onClick={() => handleDelete(stack._id)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {stack.items.map((item: any, i: number) => (
                <div key={i} className="bg-[#121212] p-4 rounded-lg">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="text-white font-bold">{item.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{item.use}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}