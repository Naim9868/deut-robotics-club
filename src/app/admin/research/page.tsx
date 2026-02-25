'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ResearchForm {
  title: string;
  technology: string;
  description: string;
  icon: string;
  category: string;
  researchers: { value: string }[];
  publications: { value: string }[];
  status: 'ONGOING' | 'COMPLETED' | 'PROPOSED';
  order: number;
  isActive: boolean;
}

export default function ResearchPage() {
  const router = useRouter();
  const [research, setResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<ResearchForm>({
    defaultValues: {
      title: '',
      technology: '',
      description: '',
      icon: '🔬',
      category: '',
      researchers: [{ value: '' }],
      publications: [{ value: '' }],
      status: 'ONGOING',
      order: 0,
      isActive: true
    }
  });

  const { fields: researcherFields, append: appendResearcher, remove: removeResearcher } = 
    useFieldArray({
      control,
      name: 'researchers'
    });

  const { fields: publicationFields, append: appendPublication, remove: removePublication } = 
    useFieldArray({
      control,
      name: 'publications'
    });

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const res = await fetch('/api/research');
      const data = await res.json();
      setResearch(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ResearchForm) => {
    try {
      // Transform data for API
      const apiData = {
        ...data,
        researchers: data.researchers.map(r => r.value).filter(v => v.trim() !== ''),
        publications: data.publications.map(p => p.value).filter(v => v.trim() !== '')
      };
      
      const res = await fetch(`/api/research${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Created');
        reset({
          title: '',
          technology: '',
          description: '',
          icon: '🔬',
          category: '',
          researchers: [{ value: '' }],
          publications: [{ value: '' }],
          status: 'ONGOING',
          order: 0,
          isActive: true
        });
        setEditingId(null);
        fetchResearch();
      } else {
        toast.error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    
    // Transform API data for form
    const formData = {
      ...item,
      researchers: item.researchers?.length 
        ? item.researchers.map((r: string) => ({ value: r })) 
        : [{ value: '' }],
      publications: item.publications?.length 
        ? item.publications.map((p: string) => ({ value: p })) 
        : [{ value: '' }]
    };
    
    reset(formData);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      const res = await fetch(`/api/research/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchResearch();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">Research Frontiers</h1>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} Research</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input {...register('title')} placeholder="Title" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input {...register('technology')} placeholder="Technology (e.g., LIDAR/ROS)" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            <input {...register('icon')} placeholder="Icon" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
            <select {...register('status')} className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white">
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="PROPOSED">PROPOSED</option>
            </select>
          </div>

          <textarea {...register('description')} placeholder="Description" rows={3} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />

          <div>
            <label className="block text-sm text-gray-400 mb-2">Researchers</label>
            {researcherFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input 
                  {...register(`researchers.${index}.value`)} 
                  placeholder="Researcher name" 
                  className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white" 
                />
                {researcherFields.length > 1 && (
                  <button type="button" onClick={() => removeResearcher(index)} className="text-red-500">×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => appendResearcher({ value: '' })} className="mt-2 text-sm text-primary">
              + Add Researcher
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Publications</label>
            {publicationFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input 
                  {...register(`publications.${index}.value`)} 
                  placeholder="Publication URL or DOI" 
                  className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white" 
                />
                {publicationFields.length > 1 && (
                  <button type="button" onClick={() => removePublication(index)} className="text-red-500">×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => appendPublication({ value: '' })} className="mt-2 text-sm text-primary">
              + Add Publication
            </button>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Create'}</button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditingId(null); 
                  reset({
                    title: '',
                    technology: '',
                    description: '',
                    icon: '🔬',
                    category: '',
                    researchers: [{ value: '' }],
                    publications: [{ value: '' }],
                    status: 'ONGOING',
                    order: 0,
                    isActive: true
                  }); 
                }} 
                className="px-6 py-2 border border-white/10 text-gray-400 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {research.map((item) => (
          <div key={item._id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 group relative">
            <div className="absolute top-4 right-4 text-6xl text-white/5">{item.icon || '🔬'}</div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-primary text-xs font-black uppercase tracking-widest">{item.technology}</span>
                <h3 className="text-xl font-bold text-white mt-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{item.description}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs mt-4 ${
                  item.status === 'ONGOING' ? 'bg-green-500/10 text-green-500' : 
                  item.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>{item.status}</span>
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