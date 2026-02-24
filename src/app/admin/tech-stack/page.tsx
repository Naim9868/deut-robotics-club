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

// Comprehensive icon categories
const iconCategories = {
  'Programming Languages': ['💻', '🖥️', '⌨️', '🖱️', '💾', '💽', '📀', '📱', '📲', '⚡', '🔌', '📊', '📈', '📉', '📋', '📝', '📄', '📑', '🗂️', '📁',// Popular Languages
  '🟨', // JavaScript
  '🔷', // TypeScript
  '🐍', // Python
  '☕', // Java
  '⚙️', // C++
  '🎯', // C#
  '🔌', // C
  '🐘', // PHP
  '💎', // Ruby
  '🐦', // Swift
  '🪁', // Kotlin
  '🐹', // Go
  '🦀', // Rust
  '📊', // R
  '🧮', // MATLAB
  '🔥', // Scala
  '🐪', // Perl
  'λ', // Haskell
  '🌙', // Lua
  '📜', // Assembly
  '⚛️', // Elixir
  '🌀', // Clojure
  '🔷', // Dart
  '🦫', // Julia
  '🐫', // OCaml
  '📦', // Erlang
  '⚡', // F#
  '🌿', // Groovy
  '🔶', // Crystal
  '🦎', // Zig
  '🦕', // Deno
  '🦖', // TypeScript (alt)
  '🐉', // Python (alt)
  '📘', // TypeScript (alt)
  '📗', // Python (alt)
  '📕', // Java (alt)
  '📙', // Ruby (alt)
  '📒', // C++ (alt)
  '📓', // JavaScript (alt)
  '📔', // Swift (alt)
  ],
  'Frameworks & Libraries': ['⚛️', '🔷', '🟦', '🟨', '🟩', '🟪', '🟥', '🧩', '🔨', '🛠️', '⚙️', '🧰', '📦', '📚', '📖', '🔗', '🔄', '✨', '💫', '🌟'],
  'Databases': ['🗄️', '📊', '📈', '📉', '📋', '📁', '📂', '🗂️', '🔍', '🔎', '📀', '💽', '💾', '📦', '🔒', '🔑', '🔐', '🔓', '📌', '📍'],
  'DevOps & Cloud': ['☁️', '🌩️', '⛅', '🌥️', '🌦️', '⚡', '🔧', '🛠️', '⚙️', '🔩', '🔨', '🪛', '📦', '📨', '📬', '📭', '🚀', '🌐', '🔗', '🔄'],
  'Hardware': ['🔧', '🛠️', '⚙️', '🔩', '🧲', '🔨', '🪛', '🔬', '🔭', '📡', '🎛️', '🎚️', '📻', '🕹️', '⌨️', '🔌', '🔋', '💡', '🔦', '🪫'],
  'Robotics': ['🤖', '🦾', '🦿', '⚙️', '🔧', '🛠️', '🔩', '🧰', '📡', '🎮', '🎛️', '🔌', '🔋', '💡', '🔦', '🕹️', '📟', '📠', '🎚️', '🎛️'],
  'AI & Machine Learning': ['🧠', '🤯', '👁️', '🔍', '🔎', '📊', '📈', '📉', '📋', '📝', '💭', '💫', '✨', '🌟', '⭐', '🌀', '🌈', '⚡', '🔥', '💡'],
  'Design & UI/UX': ['🎨', '✏️', '🖌️', '🖍️', '📐', '📏', '🖼️', '🎭', '🎪', '🎨', '🖊️', '🖋️', '🖌️', '🖍️', '📝', '📄', '📑', '🗂️', '📋', '📁'],
  'Mobile Development': ['📱', '📲', '📳', '📴', '📵', '📶', '🔄', '📞', '📟', '📠', '📡', '🔋', '🔌', '💻', '⌨️', '🖥️', '📊', '📈', '📉', '📋'],
  'Testing & QA': ['🧪', '🧫', '🔬', '🔭', '📊', '📋', '📝', '✅', '❌', '⚠️', '🚨', '🔍', '🔎', '🔬', '🔭', '📏', '📐', '📊', '📈', '📉'],
  'Security': ['🔒', '🔓', '🔐', '🔑', '🗝️', '🔏', '🔐', '🔒', '🔓', '🛡️', '⚔️', '🔫', '🔮', '🔍', '🔎', '📡', '🌐', '🔗', '🔄', '⚡'],
  'IoT & Embedded': ['📟', '📠', '📻', '📡', '🎛️', '🎚️', '🕹️', '⌨️', '🔌', '🔋', '💡', '🔦', '🪫', '🔧', '🛠️', '⚙️', '🔩', '🧲', '📊'],
  'Version Control': ['📦', '📚', '📖', '📂', '📁', '🗂️', '🔄', '🔗', '🌿', '🌲', '🌳', '📊', '📈', '📉', '📋', '📝', '📄', '📑', '🔀', '🔁'],
  'Tools & Utilities': ['🔧', '🛠️', '⚙️', '🔩', '🔨', '🪛', '🔪', '✂️', '📏', '📐', '🔍', '🔎', '🔄', '⚡', '💡', '🔦', '📟', '📠', '📡', '🎛️'],
  'Communication': ['💬', '🗣️', '📞', '📟', '📠', '📡', '📨', '📩', '📧', '💌', '📮', '📪', '📫', '📬', '📭', '📶', '🔊', '📢', '📣', '🔔'],
  'Data Science': ['📊', '📈', '📉', '📋', '📝', '📐', '📏', '🔢', '🔣', '🔤', '🧮', '📚', '📖', '🔍', '🔎', '💭', '🧠', '⚡', '✨', '🌟']
};

// Icon size options
const iconSizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'];

export default function TechStackPage() {
  const router = useRouter();
  const [stacks, setStacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Programming Languages');
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

  const { register, handleSubmit, reset, control, setValue, watch } = useForm<TechStackForm>({
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

  const handleIconSelect = (icon: string) => {
    if (currentItemIndex !== null) {
      setValue(`items.${currentItemIndex}.icon`, icon);
      setShowIconPicker(false);
      setCurrentItemIndex(null);
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
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
                <input {...register(`items.${index}.name`)} placeholder="Name" className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" required />
                <input {...register(`items.${index}.use`)} placeholder="Use" className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" required />
                
                {/* Icon input with picker */}
                <div className="relative flex gap-1">
                  <input 
                    {...register(`items.${index}.icon`)} 
                    placeholder="Icon" 
                    className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentItemIndex(index);
                      setShowIconPicker(true);
                    }}
                    className="px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-white hover:bg-primary/20 transition-colors"
                    title="Browse Icons"
                  >
                    📋
                  </button>
                </div>
                
                <input 
                  type="number" 
                  {...register(`items.${index}.proficiency`)} 
                  placeholder="Proficiency (1-100)" 
                  min="1" 
                  max="100"
                  className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" 
                />
                
                <input 
                  type="number" 
                  {...register(`items.${index}.order`)} 
                  placeholder="Order" 
                  className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white" 
                />
                
                {fields.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => remove(index)} 
                    className="px-3 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => append({ name: '', use: '', icon: '', proficiency: 80, order: fields.length })} 
              className="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Add Item
            </button>
          </div>

          {/* Icon Picker Modal */}
          {showIconPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Select Icon</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowIconPicker(false);
                      setCurrentItemIndex(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-2 mb-6 max-h-24 overflow-y-auto">
                    {Object.keys(iconCategories).map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  {/* Icon grid */}
                  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto p-2">
                    {iconCategories[selectedCategory as keyof typeof iconCategories].map((icon, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleIconSelect(icon)}
                        className="aspect-square flex items-center justify-center text-3xl p-3 bg-white/5 rounded-lg hover:bg-primary/20 transition-all duration-200 hover:scale-110 cursor-pointer group relative"
                        title={`Icon: ${icon}`}
                      >
                        {icon}
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white px-1 rounded whitespace-nowrap">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Preview section */}
                  {currentItemIndex !== null && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400 mb-2">Selected Item Preview:</p>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{watch(`items.${currentItemIndex}.icon`) || '🔍'}</div>
                        <div>
                          <p className="text-white font-bold">{watch(`items.${currentItemIndex}.name`) || 'Item Name'}</p>
                          <p className="text-gray-400 text-sm">{watch(`items.${currentItemIndex}.use`) || 'Item Use'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditingId(null); 
                  reset(); 
                }} 
                className="px-6 py-2 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {stacks.map((stack) => (
          <div key={stack._id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">{stack.category}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-600">Order: {stack.order}</span>
                  {stack.isActive ? (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-wider rounded-full">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-wider rounded-full">Inactive</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(stack)} className="px-3 py-1 text-blue-500 text-sm hover:bg-blue-500/10 rounded-lg transition-colors">Edit</button>
                <button onClick={() => handleDelete(stack._id)} className="px-3 py-1 text-red-500 text-sm hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stack.items.sort((a: any, b: any) => a.order - b.order).map((item: any, i: number) => (
                <div key={i} className="bg-[#121212] p-4 rounded-lg border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{item.use}</p>
                      {item.proficiency && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[8px] text-gray-500 mb-1">
                            <span>Proficiency</span>
                            <span>{item.proficiency}%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-300 group-hover:bg-primary/80"
                              style={{ width: `${item.proficiency}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}