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
  const [showIconPicker, setShowIconPicker] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<FocusForm>({
    defaultValues: {
      title: '',
      description: '',
      icon: '🤖',
      color: '#e63946',
      order: 0,
      isActive: true
    }
  });

  // Common icon suggestions categorized
  const iconSuggestions = {
    'Robotics': ['🤖', '🦾', '🦿', '⚙️', '🔧', '🛠️', '🔩', '🧰', '📡', '🎮','🏎️','🔥','🚁','⚽'],
    'AI & Tech': ['🧠', '💻', '🖥️', '📱', '🤯', '💡', '🔬', '⚡', '📊', '📈'],
    'Science': ['🔭', '🧪', '🧬', '🔬', '🧲', '⚛️', '🧮', '📐', '📏', '🔋'],
    'Innovation': ['🚀', '💫', '✨', '🌟', '💭', '🎯', '🏆', '🥇', '🏅', '🎨'],
    'Networking': ['🌐', '📡', '📶', '🛜', '🔗', '🔄', '📨', '📬', '📧', '💬','🗣️', '📞', '📟', '📠', '🔊'],
    'Hardware': ['🔌', '💾', '💽', '📀', '🎛️', '🎚️', '🎧', '📻', '🕹️', '⌨️'],
   
    'Programming': ['💻', '🖥️', '⌨️', '🖱️', '💾', '💽', '📀', '📱', '📲', '🤖', '⚡', '🔌', '📊', '📈', '📉'],
    'Design & Research': ['🎨', '✏️', '📐', '📏', '🖌️', '🖍️', '📝', '📄', '📑', '🔬', '🧪', '📊', '📈', '📋', '🗂️'],
  'Aerospace': ['🚀', '🛸', '🛰️', '✈️', '🛩️', '🪂', '🚁', '🛬', '🛫', '🌍', '🌎', '🌏', '🪐', '🌌', '☄️'],
  'Automation': ['⚡', '🔋', '💡', '🕹️', '🎛️', '🎚️', '⏱️', '⏲️', '🔄', '⚙️', '🔧', '🛠️', '📟', '📠', '🤖'],
 
  'Competitions': ['🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎯', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹'],
  'Misc': ['🎯', '🎲', '🧩', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎸', '🎺']
  };

  const handleIconSelect = (icon: string) => {
    setValue('icon', icon);
    setShowIconPicker(false);
  };

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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">Focus Areas</h1>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} Focus Area</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input {...register('title')} placeholder="Title" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
            
            {/* Icon input with picker */}
            <div className="relative">
              <div className="flex gap-2">
                <input 
                  {...register('icon')} 
                  placeholder="Icon" 
                  className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="px-4 py-3 bg-[#121212] border border-white/10 rounded-lg text-white hover:bg-primary/20 transition-colors"
                >
                  📋
                </button>
              </div>
              
              {/* Icon picker dropdown */}
              {showIconPicker && (
                <div className="absolute z-50 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-white">Select Icon</h3>
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {Object.entries(iconSuggestions).map(([category, icons]) => (
                    <div key={category} className="mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">{category}</h4>
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                        {icons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => handleIconSelect(icon)}
                            className={`text-2xl p-2 rounded-lg hover:bg-primary/20 transition-colors ${
                              watch('icon') === icon ? 'bg-primary/30 ring-2 ring-primary' : ''
                            }`}
                            title={icon}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Custom emoji picker note */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-[10px] text-gray-500">
                      💡 You can also paste any emoji or symbol in the input field
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <input {...register('color')} type="color" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white h-12" />
            <input type="number" {...register('order')} placeholder="Order" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
          </div>
          
          <textarea {...register('description')} placeholder="Description" rows={3} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" required />
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
              <span className="text-sm text-gray-300">Active</span>
            </label>
            
            {/* Live preview */}
            {watch('icon') && (
              <div className="flex items-center gap-2 sm:ml-4 px-3 py-1 bg-[#121212] rounded-full">
                <span className="text-sm text-gray-400">Preview:</span>
                <span className="text-2xl" style={{ color: watch('color') }}>{watch('icon')}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-6 py-2 border border-white/10 text-gray-400 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => (
          <div key={area._id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 sm:p-6 hover:border-primary/30 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ color: area.color }}>
                  {area.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{area.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{area.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-600">Order: {area.order}</span>
                    {area.isActive ? (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-wider rounded-full">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-wider rounded-full">Inactive</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(area)} className="px-3 py-1 text-blue-500 text-sm hover:bg-blue-500/10 rounded-lg transition-colors">Edit</button>
                <button onClick={() => handleDelete(area._id)} className="px-3 py-1 text-red-500 text-sm hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
