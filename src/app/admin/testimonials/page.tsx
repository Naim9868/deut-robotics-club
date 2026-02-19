'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface TestimonialForm {
  name: string;
  role: string;
  text: string;
  avatar: { url: string; alt: string; publicId?: string };
  rating: number;
  featured: boolean;
  order: number;
  isActive: boolean;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [useAvatarLink, setUseAvatarLink] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TestimonialForm>({
    defaultValues: {
      name: '',
      role: '',
      text: '',
      rating: 5,
      featured: false,
      order: 0,
      isActive: true
    }
  });

  // Helper to generate avatar from name
  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1e1e1e&color=e63946&size=200&bold=true&length=2`;
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (url: string, publicId?: string) => {
    setValue('avatar', { 
      url, 
      alt: watch('name') || 'Testimonial avatar',
      publicId 
    });
    setCurrentAvatarUrl(url);
    setUseAvatarLink(false);
  };

  const handleAvatarLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('avatar', { 
      url, 
      alt: watch('name') || 'Testimonial avatar'
    });
    setCurrentAvatarUrl(url);
  };

  const onSubmit = async (data: TestimonialForm) => {
    try {
      // Ensure avatar is set
      if (!data.avatar?.url) {
        data.avatar = {
          url: getAvatarUrl(data.name),
          alt: data.name
        };
      }

      // Validate required fields
      if (!data.name || !data.role || !data.text) {
        toast.error('Please fill in all required fields');
        return;
      }

      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(editingId ? 'Testimonial updated' : 'Testimonial created');
        reset();
        setEditingId(null);
        setCurrentAvatarUrl('');
        setUseAvatarLink(false);
        fetchTestimonials();
      } else {
        console.error('Server error:', responseData);
        
        // Show validation errors
        if (responseData.details) {
          Object.keys(responseData.details).forEach(key => {
            toast.error(`${key}: ${responseData.details[key]}`);
          });
        } else {
          toast.error(responseData.error || 'Failed to save');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save');
    }
  };

  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial._id);
    setCurrentAvatarUrl(testimonial.avatar?.url || '');
    reset({
      ...testimonial,
      avatar: testimonial.avatar || { url: '', alt: testimonial.name }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        toast.success('Testimonial deleted');
        fetchTestimonials();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Reorder testimonials
  const moveTestimonial = async (id: string, direction: 'up' | 'down') => {
    const index = testimonials.findIndex(t => t._id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === testimonials.length - 1)
    ) return;

    const newTestimonials = [...testimonials];
    const temp = newTestimonials[index];
    newTestimonials[index] = newTestimonials[index + (direction === 'up' ? -1 : 1)];
    newTestimonials[index + (direction === 'up' ? -1 : 1)] = temp;

    // Update order values
    const updates = newTestimonials.map((item, idx) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: idx } }
      }
    }));

    try {
      await fetch('/api/testimonials/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      
      setTestimonials(newTestimonials);
      toast.success('Order updated');
    } catch (error) {
      toast.error('Failed to update order');
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">Testimonials</h1>
        <p className="text-gray-500 text-sm">{testimonials.length} testimonials</p>
      </div>

      {/* Form */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('name', { required: 'Name is required' })} 
                placeholder="John Doe" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('role', { required: 'Role is required' })} 
                placeholder="Alumni, Member, etc." 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Testimonial Text */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Testimonial <span className="text-red-500">*</span>
            </label>
            <textarea 
              {...register('text', { required: 'Testimonial text is required' })} 
              placeholder="Share your experience..." 
              rows={4} 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none" 
            />
            {errors.text && (
              <p className="mt-1 text-xs text-red-500">{errors.text.message}</p>
            )}
          </div>

          {/* Avatar Upload with Toggle */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-gray-400 uppercase">
                Avatar (Optional)
              </label>
              <button
                type="button"
                onClick={() => setUseAvatarLink(!useAvatarLink)}
                className="text-xs text-primary hover:underline"
              >
                {useAvatarLink ? 'Use Avatar Generator' : 'Use Image Link'}
              </button>
            </div>

            {useAvatarLink ? (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  onChange={handleAvatarLinkChange}
                  value={currentAvatarUrl}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for the avatar image
                </p>
              </div>
            ) : (
              <div>
                <ImageUpload
                  onUpload={handleAvatarUpload}
                  defaultValue={currentAvatarUrl}
                  folder="testimonials"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image or toggle to use an external link
                </p>
              </div>
            )}
          </div>

          {/* Rating and Order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Rating
              </label>
              <select 
                {...register('rating')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="3">⭐⭐⭐ 3 Stars</option>
                <option value="2">⭐⭐ 2 Stars</option>
                <option value="1">⭐ 1 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Order
              </label>
              <input 
                type="number"
                {...register('order')} 
                placeholder="0" 
                min="0"
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>
          </div>

          {/* Status Toggles */}
          <div className="border-t border-white/5 pt-4 flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-300">Featured Testimonial</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              {editingId ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditingId(null); 
                  reset(); 
                  setCurrentAvatarUrl('');
                  setUseAvatarLink(false);
                }} 
                className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div 
            key={testimonial._id} 
            className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all relative"
          >
            {/* Order Controls */}
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {index > 0 && (
                <button
                  onClick={() => moveTestimonial(testimonial._id, 'up')}
                  className="p-1 bg-black/70 hover:bg-black rounded text-white"
                  title="Move Up"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
              )}
              {index < testimonials.length - 1 && (
                <button
                  onClick={() => moveTestimonial(testimonial._id, 'down')}
                  className="p-1 bg-black/70 hover:bg-black rounded text-white"
                  title="Move Down"
                >
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Edit/Delete Controls */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => handleEdit(testimonial)} 
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(testimonial._id)} 
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Del
              </button>
            </div>

            {/* Featured Badge */}
            {testimonial.featured && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white text-xs rounded-full">
                Featured
              </div>
            )}

            {/* Inactive Overlay */}
            {!testimonial.isActive && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <span className="px-2 py-1 bg-red-600/90 text-white text-xs rounded-full">
                  Inactive
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Quote Icon */}
              <div className="text-primary text-4xl mb-2">"</div>
              
              {/* Testimonial Text */}
              <p className="text-gray-300 italic mb-4 line-clamp-4">
                {testimonial.text}
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-4 mt-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-[#1e1e1e] flex-shrink-0">
                  <img 
                    src={testimonial.avatar?.url || getAvatarUrl(testimonial.name)} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getAvatarUrl(testimonial.name);
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold truncate">{testimonial.name}</h4>
                  <p className="text-gray-500 text-xs truncate">{testimonial.role}</p>
                  
                  {/* Rating Stars */}
                  <div className="flex text-yellow-500 text-sm mt-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Display */}
              <div className="mt-3 text-xs text-gray-600">
                Order: {testimonial.order}
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <p className="text-gray-500">No testimonials yet. Add your first testimonial above.</p>
        </div>
      )}
    </div>
  );
}