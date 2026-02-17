'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import axios from 'axios';

interface HeroForm {
  title: string;
  subtitle: string;
  description: string;
  images: { url: string; alt: string; publicId?: string; order: number }[];
  primaryButton: { text: string; link: string };
  secondaryButton: { text: string; link: string };
  autoSlideInterval: number;
  isActive: boolean;
}

export default function HeroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, control } = useForm<HeroForm>({
    defaultValues: {
      title: 'Empowering Future Innovators Through Robotics',
      subtitle: 'DUET Robotics Club',
      description: 'Transforming robotics at Dhaka University of Engineering & Technology. The future is autonomous, and we are building it.',
      images: [],
      primaryButton: { text: 'Join the Mission', link: '#contact' },
      secondaryButton: { text: 'Explore Projects', link: '#projects' },
      autoSlideInterval: 6000,
      isActive: true
    }
  });

  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: 'images' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/hero');
      const data = await res.json();
      if (data.length > 0) {
        const item = data[0];
        setExistingId(item._id);
        
        // Sort images by order before setting
        if (item.images) {
          item.images.sort((a: any, b: any) => a.order - b.order);
        }
        
        Object.keys(item).forEach(key => {
          if (key !== '_id' && key !== '__v') {
            setValue(key as any, item[key]);
          }
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} must be less than 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'hero');

        try {
            const res = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });
            
            // console.log('Upload response:', res.data);
            
            if (res.data.url) {
            append({ 
                url: res.data.url, 
                alt: watch('title'), 
                publicId: res.data.publicId,
                order: fields.length + i 
            });
            toast.success(`${file.name} uploaded successfully`);
            }
        } catch (uploadError: any) {
            console.error('Upload error for file:', file.name, uploadError);
            
            if (uploadError.response) {
            // The request was made and the server responded with a status code
           
            toast.error(`${file.name}: ${uploadError.response.data.error || 'Upload failed'}`);
            } else if (uploadError.request) {
            // The request was made but no response was received
           
            toast.error(`${file.name}: No response from server`);
            } else {
            // Something happened in setting up the request
           
            toast.error(`${file.name}: ${uploadError.message}`);
            }
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  const removeImage = async (index: number) => {
    const image = fields[index];
    
    try {
      // Delete from Cloudinary if it has a publicId
      if (image.publicId) {
        await axios.delete('/api/upload', {
          data: { publicId: image.publicId }
        });
      }
      
      remove(index);
      toast.success('Image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === fields.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const currentImages = [...fields];
    
    // Swap order values
    const tempOrder = currentImages[index].order;
    currentImages[index].order = currentImages[newIndex].order;
    currentImages[newIndex].order = tempOrder;
    
    // Swap positions in array
    [currentImages[index], currentImages[newIndex]] = [currentImages[newIndex], currentImages[index]];
    
    // Update form values
    setValue('images', currentImages as any);
  };

  const onSubmit = async (data: HeroForm) => {
    setSaving(true);
    try {
      // Sort images by order before saving
      data.images.sort((a, b) => a.order - b.order);
      
      const res = await fetch(`/api/hero${existingId ? `/${existingId}` : ''}`, {
        method: existingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Hero section saved');
        router.push('/admin');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
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
      <h1 className="text-4xl font-black text-white">Hero Section</h1>

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
              placeholder="Enter hero title"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
              Subtitle
            </label>
            <input 
              {...register('subtitle')} 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
              placeholder="Enter subtitle"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea 
              {...register('description')} 
              rows={3} 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
              placeholder="Enter description"
            />
          </div>

          {/* Multiple Image Upload */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-4 uppercase tracking-wider">
              Slider Images (Upload Multiple)
            </label>
            
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {fields.map((field, index) => (
                <div key={field.id} className="relative group aspect-video">
                  <img 
                    src={field.url} 
                    alt={field.alt} 
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                  />
                  
                  {/* Image Overlay Controls */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-2">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'up')}
                          className="p-1 bg-white/10 hover:bg-white/20 rounded text-white"
                          title="Move Up"
                        >
                          ↑
                        </button>
                      )}
                      {index < fields.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'down')}
                          className="p-1 bg-white/10 hover:bg-white/20 rounded text-white"
                          title="Move Down"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500/80 hover:bg-red-500 rounded text-white"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                    <span className="text-xs text-white">Order: {index + 1}</span>
                  </div>
                </div>
              ))}

              {/* Upload Button */}
              <div className="aspect-video border-2 border-dashed border-white/10 rounded-lg hover:border-primary/50 transition-colors">
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-gray-500">
                    {uploading ? 'Uploading...' : 'Add Images'}
                  </span>
                  <span className="text-[10px] text-gray-600 mt-1">PNG, JPG, GIF up to 5MB</span>
                </label>
              </div>
            </div>

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                Uploading images...
              </div>
            )}

            {fields.length === 0 && !uploading && (
              <p className="text-sm text-gray-500 italic">No images uploaded yet. Click "Add Images" to upload.</p>
            )}
          </div>

          {/* Buttons Section */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
                Primary Button Text
              </label>
              <input 
                {...register('primaryButton.text')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                placeholder="e.g., Join Now"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
                Primary Button Link
              </label>
              <input 
                {...register('primaryButton.link')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                placeholder="e.g., /join"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
                Secondary Button Text
              </label>
              <input 
                {...register('secondaryButton.text')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                placeholder="e.g., Learn More"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
                Secondary Button Link
              </label>
              <input 
                {...register('secondaryButton.link')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                placeholder="e.g., /about"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
                Auto Slide Interval (ms)
              </label>
              <input 
                type="number" 
                {...register('autoSlideInterval')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                min="1000"
                step="1000"
              />
              <p className="text-xs text-gray-600 mt-1">1000ms = 1 second</p>
            </div>

            <div className="flex items-center space-x-8">
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
        </div>

        {/* Preview */}
        {!loading && watch('title') && (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <span>🔍</span> Live Preview
            </h2>
            <div className="relative h-[400px] bg-dark rounded-xl overflow-hidden">
              {watch('images')?.[0] && (
                <img 
                  src={watch('images')[0].url} 
                  alt="Preview" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
                {watch('subtitle') && (
                  <p className="text-primary text-sm font-black mb-4 uppercase tracking-wider">
                    {watch('subtitle')}
                  </p>
                )}
                <h3 className="text-3xl md:text-4xl font-black text-white max-w-2xl mb-4">
                  {watch('title')}
                </h3>
                <p className="text-gray-300 max-w-xl mb-8">
                  {watch('description')}
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-primary text-white text-sm font-black rounded hover:bg-primary/90 transition-colors">
                    {watch('primaryButton.text')}
                  </button>
                  <button className="px-6 py-3 border border-white/20 text-white text-sm font-black rounded hover:bg-white/5 transition-colors">
                    {watch('secondaryButton.text')}
                  </button>
                </div>
                {fields.length > 0 && (
                  <p className="text-xs text-gray-500 mt-4">
                    {fields.length} image{fields.length !== 1 ? 's' : ''} in slider
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

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
            disabled={saving || uploading} 
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          >
            {saving ? 'Saving...' : existingId ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}