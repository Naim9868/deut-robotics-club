'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import axios from 'axios';

interface AboutForm {
  title: string;
  description: string;
  paragraphs: string[];
  buttonText: string;
  buttonLink: string;
  image: { url: string; alt: string };
  isActive: boolean;
  order: number;
}

export default function AboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>(['']);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const { register, handleSubmit, setValue, watch, reset } = useForm<AboutForm>({
    defaultValues: {
      title: 'About Us',
      description: '',
      buttonText: 'Learn More',
      buttonLink: '#',
      image: { url: '', alt: 'About Us' },
      isActive: true,
      order: 0
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/about');
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      if (data.length > 0) {
        const item = data[0];
        setExistingId(item._id);
        setParagraphs(item.paragraphs || ['']);
        setCurrentImageUrl(item.image?.url || '');
        
        // Reset form with fetched data
        reset({
          title: item.title || 'About Us',
          description: item.description || '',
          buttonText: item.buttonText || 'Learn More',
          buttonLink: item.buttonLink || '#',
          image: item.image || { url: '', alt: item.title || 'About Us' },
          isActive: item.isActive ?? true,
          order: item.order || 0
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const addParagraph = () => setParagraphs([...paragraphs, '']);
  
  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setParagraphs(newParagraphs);
  };

  const removeParagraph = (index: number) => {
    if (paragraphs.length > 1) {
      setParagraphs(paragraphs.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (url: string) => {
    setValue('image', { 
      url, 
      alt: watch('title') || 'About Us' 
    });
    setCurrentImageUrl(url);
  };

const handleImageRemove = async () => {
  if (!currentImageUrl) return;
  
  try {
    // Extract public ID from Cloudinary URL
    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456789/folder/public_id.jpg
    const urlParts = currentImageUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1]; // Gets "public_id.jpg"
    const publicId = publicIdWithExtension.split('.')[0]; // Gets "public_id"
    
    // Get the folder path if it exists
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
      // If there's a folder after 'upload', include it in the public ID
      const folderPath = urlParts.slice(uploadIndex + 2, -1).join('/');
      const fullPublicId = folderPath ? `${folderPath}/${publicId}` : publicId;
      
      console.log('Extracted publicId:', fullPublicId);
      
      // Make DELETE request to your API
      await axios.delete('/api/upload', {
        data: { publicId: fullPublicId }
      });
    } else {
      // No folder path
      await axios.delete('/api/upload', {
        data: { publicId }
      });
    }
    
    // Clear image from form
    setValue('image', { url: '', alt: watch('title') || 'About Us' });
    setCurrentImageUrl('');
    
    toast.success('Image removed');
  } catch (error: any) {
    console.error('Error removing image:', error);
    toast.error(error.response?.data?.error || 'Failed to remove image');
  }
};

  const onSubmit = async (data: AboutForm) => {
    setSaving(true);
    try {
      // Clean paragraphs
      data.paragraphs = paragraphs.filter(p => p.trim() !== '');
      
      // Ensure image object exists
      if (!data.image) {
        data.image = { url: '', alt: data.title };
      }

      const url = existingId 
        ? `/api/about/${existingId}`
        : '/api/about';
      
      const method = existingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(existingId ? 'About section updated' : 'About section created');
        router.push('/admin');
        router.refresh(); // Refresh server components
      } else {
        console.error('Server error:', responseData);
        
        // Handle validation errors
        if (responseData.details) {
          const errorMessages = Object.values(responseData.details)
            .map((err: any) => err.message)
            .join(', ');
          toast.error(errorMessages);
        } else {
          toast.error(responseData.error || responseData.message || 'Failed to save');
        }
      }
    } catch (error) {
      console.error('Client error:', error);
      toast.error('Network error - please check console');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingId) return;
    
    if (!confirm('Are you sure you want to delete this about section? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      // Delete image from Cloudinary first if exists
      if (currentImageUrl) {
        const publicId = currentImageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await axios.delete('/api/upload', {
              data: { publicId }
          });
        }
      }

      // Delete from database
      const res = await fetch(`/api/about/${existingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('About section deleted');
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-white">About Section</h1>
        {existingId && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-3 bg-red-600/20 border border-red-600/30 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Section'}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
              Title <span className="text-red-500">*</span>
            </label>
            <input 
              {...register('title', { required: 'Title is required' })} 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
              placeholder="Enter section title"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-4 uppercase tracking-wider">
              Featured Image
            </label>
            <ImageUpload 
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
              defaultValue={currentImageUrl}
            />
            {currentImageUrl && (
              <p className="text-xs text-gray-500 mt-2">
                Current image: {currentImageUrl.split('/').pop()}
              </p>
            )}
          </div>

          {/* Paragraphs */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
              Paragraphs
            </label>
            {paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <textarea
                  value={p}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  rows={3}
                  className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                  placeholder={`Paragraph ${i + 1}`}
                />
                {paragraphs.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeParagraph(i)} 
                    className="px-3 text-red-500 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addParagraph} 
              className="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Add Paragraph
            </button>
          </div>

          {/* Button Settings */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
                Button Text
              </label>
              <input 
                {...register('buttonText')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                placeholder="e.g., Learn More"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
                Button Link
              </label>
              <input 
                {...register('buttonLink')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                placeholder="e.g., /about"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-8 pt-4 border-t border-white/5">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                {...register('isActive')} 
                className="w-4 h-4 rounded border-white/10 bg-[#121212] text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-300">Active (visible on site)</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => router.push('/admin')} 
            className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving} 
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          >
            {saving ? 'Saving...' : existingId ? 'Update' : 'Create'}
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {!loading && watch('title') && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 mt-8">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span>🔍</span> Live Preview
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 bg-[#121212] rounded-xl">
            <div>
              <h3 className="text-3xl font-black text-white mb-4">{watch('title')}</h3>
              <div className="space-y-4 text-gray-400">
                {paragraphs.filter(p => p.trim()).map((p, i) => (
                  <p key={i} className="leading-relaxed">{p}</p>
                ))}
              </div>
              {watch('buttonText') && (
                <div className="mt-6">
                  <a 
                    href={watch('buttonLink') || '#'} 
                    className="inline-block px-6 py-3 border border-white/20 text-white text-sm font-bold rounded hover:bg-white/5 transition-colors"
                  >
                    {watch('buttonText')}
                  </a>
                </div>
              )}
            </div>
            
            {watch('image')?.url && (
              <div className="relative group">
                <img 
                  src={watch('image').url} 
                  alt={watch('image').alt || watch('title')}
                  className="rounded-lg w-full object-cover shadow-2xl"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors rounded-lg"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}