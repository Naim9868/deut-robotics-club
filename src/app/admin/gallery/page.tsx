'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import CustomSelect from '@/components/admin/CustomSelect';

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
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [useImageLink, setUseImageLink] = useState(false);


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

  const handleImageUpload = (url: string, publicId?: string) => {
    setValue('image', {
      url,
      alt: watch('title') || 'Project image',
      publicId
    });
    setCurrentImageUrl(url);
    setUseImageLink(false);
  };

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('image', {
      url,
      alt: watch('title') || 'Project image'
    });
    setCurrentImageUrl(url);
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
      <h1 className="text-4xl font-black text-foreground">Gallery</h1>

      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">{editingId ? 'Edit' : 'Add'} Image</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input {...register('title')} placeholder="Title" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" required />
            <CustomSelect
              value={watch('category') || ''}
              onChange={(val) => setValue('category', val)}
              options={[
                { value: 'Events', label: 'Events' },
                { value: 'Workshops', label: 'Workshops' },
                { value: 'Competitions', label: 'Competitions' },
                { value: 'Team', label: 'Team' },
                { value: 'Lab', label: 'Lab' },
              ]}
              placeholder="Select category"
            />
            <input type="date" {...register('date')} className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
          </div>

          <textarea {...register('description')} placeholder="Description" rows={2} className="w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />

          {/* Image Upload with Toggle */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-muted uppercase">
                Project Image
              </label>
              <button
                type="button"
                onClick={() => setUseImageLink(!useImageLink)}
                className="text-xs text-primary hover:underline"
              >
                {useImageLink ? 'Use Upload' : 'Use Image Link'}
              </button>
            </div>

            {useImageLink ? (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  onChange={handleImageLinkChange}
                  value={currentImageUrl}
                  className="w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-muted mt-1">
                  Enter a URL for the project image
                </p>
              </div>
            ) : (
              <div>
                <ImageUpload
                  onUpload={handleImageUpload}
                  defaultValue={currentImageUrl}
                  folder="projects"
                />
                <p className="text-xs text-muted mt-2">
                  Upload an image or toggle to use an external link
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('featured')} className="w-4 h-4" />
              <span className="text-sm text-muted">Featured</span>
            </label>
            <label className="flex items-center gap-2">
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

      <div className="columns-2 md:columns-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="break-inside-avoid mb-4 relative group">
            <img src={item.image?.url} alt={item.title} className="w-full rounded-lg" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-500 text-foreground text-xs rounded">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-500 text-foreground text-xs rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}