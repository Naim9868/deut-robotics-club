'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { CalendarIcon, MapPinIcon, LinkIcon } from '@heroicons/react/24/outline';

interface EventForm {
  title: string;
  slug: string;
  description: string;
  date: {
    day: string;
    month: string;
    year: string;
    fullDate: string;
  };
  location: string;
  image: { url: string; alt: string; publicId?: string };
  registrationLink: string;
  featured: boolean;
  isActive: boolean;
  order: number;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [useImageLink, setUseImageLink] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EventForm>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      date: { day: '', month: '', year: '', fullDate: '' },
      location: '',
      registrationLink: '',
      featured: false,
      isActive: true,
      order: 0
    }
  });

  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const title = watch('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  };

  const handleImageUpload = (url: string, publicId?: string) => {
    setValue('image', { 
      url, 
      alt: watch('title') || 'Event image',
      publicId 
    });
    setCurrentImageUrl(url);
    setUseImageLink(false);
  };

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('image', { 
      url, 
      alt: watch('title') || 'Event image'
    });
    setCurrentImageUrl(url);
  };

  const onSubmit = async (data: EventForm) => {
    try {
      // Validate required fields
      if (!data.title || !data.slug || !data.description) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (!data.date?.day || !data.date?.month) {
        toast.error('Please provide event date (day and month)');
        return;
      }

      // Create fullDate
      const year = data.date.year || new Date().getFullYear();
      data.date.fullDate = new Date(`${data.date.month} ${data.date.day}, ${year}`).toISOString();

      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(editingId ? 'Event updated' : 'Event created');
        reset();
        setEditingId(null);
        setCurrentImageUrl('');
        setUseImageLink(false);
        fetchEvents();
      } else {
        console.error('Server error:', responseData);
        
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

  const handleEdit = (event: any) => {
    setEditingId(event._id);
    setCurrentImageUrl(event.image?.url || '');
    reset(event);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        toast.success('Event deleted');
        fetchEvents();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Reorder events
  const moveEvent = async (id: string, direction: 'up' | 'down') => {
    const index = events.findIndex(e => e._id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === events.length - 1)
    ) return;

    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[index + (direction === 'up' ? -1 : 1)];
    newEvents[index + (direction === 'up' ? -1 : 1)] = temp;

    // Update order values
    const updates = newEvents.map((item, idx) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: idx } }
      }
    }));

    try {
      await fetch('/api/events/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      
      setEvents(newEvents);
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
        <h1 className="text-4xl font-black text-white">Events</h1>
        <p className="text-gray-500 text-sm">{events.length} events</p>
      </div>

      {/* Form */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {editingId ? 'Edit Event' : 'Add New Event'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('title', { required: 'Title is required' })} 
                onBlur={generateSlug}
                placeholder="Workshop on Robotics" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input 
                  {...register('slug', { required: 'Slug is required' })} 
                  placeholder="workshop-on-robotics" 
                  className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 text-sm"
                >
                  Generate
                </button>
              </div>
              {errors.slug && (
                <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>
              )}
            </div>
          </div>

          {/* Date Fields */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Event Date <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input 
                  {...register('date.day', { required: 'Day is required' })} 
                  placeholder="Day (25)" 
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                />
                {errors.date?.day && (
                  <p className="mt-1 text-xs text-red-500">{errors.date.day.message}</p>
                )}
              </div>
              
              <div>
                <select 
                  {...register('date.month', { required: 'Month is required' })} 
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                {errors.date?.month && (
                  <p className="mt-1 text-xs text-red-500">{errors.date.month.message}</p>
                )}
              </div>
              
              <div>
                <input 
                  {...register('date.year')} 
                  placeholder="Year (2025)" 
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Location
            </label>
            <input 
              {...register('location')} 
              placeholder="DUET Campus, Dhaka" 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              {...register('description', { required: 'Description is required' })} 
              placeholder="Event description..." 
              rows={4} 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none" 
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Image Upload with Toggle */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-gray-400 uppercase">
                Event Image
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
                  placeholder="https://example.com/event-image.jpg"
                  onChange={handleImageLinkChange}
                  value={currentImageUrl}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for the event image
                </p>
              </div>
            ) : (
              <div>
                <ImageUpload
                  onUpload={handleImageUpload}
                  defaultValue={currentImageUrl}
                  folder="events"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image or toggle to use an external link
                </p>
              </div>
            )}
          </div>

          {/* Registration Link */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Registration Link
            </label>
            <input 
              {...register('registrationLink')} 
              placeholder="https://forms.gle/..." 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
            />
          </div>

          {/* Order and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Display Order
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

            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-300">Featured Event</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              {editingId ? 'Update Event' : 'Create Event'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditingId(null); 
                  reset(); 
                  setCurrentImageUrl('');
                  setUseImageLink(false);
                }} 
                className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div 
            key={event._id} 
            className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all relative"
          >
            {/* Order Controls */}
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {index > 0 && (
                <button
                  onClick={() => moveEvent(event._id, 'up')}
                  className="p-1 bg-black/70 hover:bg-black rounded text-white"
                  title="Move Up"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
              )}
              {index < events.length - 1 && (
                <button
                  onClick={() => moveEvent(event._id, 'down')}
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
                onClick={() => handleEdit(event)} 
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(event._id)} 
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Del
              </button>
            </div>

            {/* Featured Badge */}
            {event.featured && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white text-xs rounded-full">
                Featured
              </div>
            )}

            {/* Inactive Overlay */}
            {!event.isActive && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <span className="px-2 py-1 bg-red-600/90 text-white text-xs rounded-full">
                  Inactive
                </span>
              </div>
            )}

            {/* Event Image */}
            {event.image?.url && (
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={event.image.url} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Event+Image';
                  }}
                />
              </div>
            )}

            <div className="p-4">
              {/* Date Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-center">
                    <div className="text-lg font-black">{event.date?.day}</div>
                    <div className="text-xs font-bold">{event.date?.month}</div>
                    {event.date?.year && (
                      <div className="text-[10px] text-gray-400">{event.date.year}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg leading-tight">{event.title}</h3>
                  </div>
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                  <MapPinIcon className="w-3 h-3" />
                  <span>{event.location}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                {event.description}
              </p>

              {/* Registration Link */}
              {event.registrationLink && (
                <a 
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary text-xs hover:underline mb-2"
                >
                  <LinkIcon className="w-3 h-3" />
                  Register Now
                </a>
              )}

              {/* Order Display */}
              <div className="text-xs text-gray-600 mt-2">
                Order: {event.order}
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <p className="text-gray-500">No events yet. Add your first event above.</p>
        </div>
      )}
    </div>
  );
}