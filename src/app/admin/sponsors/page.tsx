'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

interface SponsorForm {
  name: string;
  logo: { url: string; alt: string; publicId?: string };
  website: string;
  category: 'PLATINUM' | 'GOLD' | 'SILVER' | 'PARTNER';
  description: string;
  order: number;
  isActive: boolean;
}

const categoryColors = {
  PLATINUM: 'text-gray-300 border-gray-300',
  GOLD: 'text-yellow-500 border-yellow-500',
  SILVER: 'text-gray-400 border-gray-400',
  PARTNER: 'text-primary border-primary'
};

export default function SponsorsPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');
  const [useLogoLink, setUseLogoLink] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SponsorForm>({
    defaultValues: {
      name: '',
      website: '',
      category: 'PARTNER',
      description: '',
      order: 0,
      isActive: true
    }
  });

  // Helper to generate placeholder logo from name
  const getLogoUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Sponsor')}&background=1e1e1e&color=e63946&size=200&bold=true&length=2`;
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await fetch('/api/sponsors');
      const data = await res.json();
      setSponsors(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (url: string, publicId?: string) => {
    setValue('logo', { 
      url, 
      alt: watch('name') || 'Sponsor logo',
      publicId 
    });
    setCurrentLogoUrl(url);
    setUseLogoLink(false);
  };

  const handleLogoLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('logo', { 
      url, 
      alt: watch('name') || 'Sponsor logo'
    });
    setCurrentLogoUrl(url);
  };

  const onSubmit = async (data: SponsorForm) => {
    try {
      // Validate required fields
      if (!data.name) {
        toast.error('Sponsor name is required');
        return;
      }

      // Ensure logo is set
      if (!data.logo?.url) {
        data.logo = {
          url: getLogoUrl(data.name),
          alt: data.name
        };
      }

      const url = editingId ? `/api/sponsors/${editingId}` : '/api/sponsors';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(editingId ? 'Sponsor updated' : 'Sponsor created');
        reset();
        setEditingId(null);
        setCurrentLogoUrl('');
        setUseLogoLink(false);
        fetchSponsors();
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

  const handleEdit = (sponsor: any) => {
    setEditingId(sponsor._id);
    setCurrentLogoUrl(sponsor.logo?.url || '');
    reset(sponsor);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;
    
    try {
      const res = await fetch(`/api/sponsors/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        toast.success('Sponsor deleted');
        fetchSponsors();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Reorder sponsors
  const moveSponsor = async (id: string, direction: 'up' | 'down') => {
    const index = sponsors.findIndex(s => s._id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sponsors.length - 1)
    ) return;

    const newSponsors = [...sponsors];
    const temp = newSponsors[index];
    newSponsors[index] = newSponsors[index + (direction === 'up' ? -1 : 1)];
    newSponsors[index + (direction === 'up' ? -1 : 1)] = temp;

    // Update order values
    const updates = newSponsors.map((item, idx) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: idx } }
      }
    }));

    try {
      await fetch('/api/sponsors/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      
      setSponsors(newSponsors);
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
        <h1 className="text-4xl font-black text-white">Sponsors</h1>
        <p className="text-gray-500 text-sm">{sponsors.length} sponsors</p>
      </div>

      {/* Form */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {editingId ? 'Edit Sponsor' : 'Add New Sponsor'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Sponsor Name <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('name', { required: 'Name is required' })} 
                placeholder="Company Name" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Category
              </label>
              <select 
                {...register('category')} 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              >
                <option value="PLATINUM">🥇 PLATINUM</option>
                <option value="GOLD">🥈 GOLD</option>
                <option value="SILVER">🥉 SILVER</option>
                <option value="PARTNER">🤝 PARTNER</option>
              </select>
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Website URL
            </label>
            <input 
              {...register('website')} 
              placeholder="https://example.com" 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">
              Description
            </label>
            <textarea 
              {...register('description')} 
              placeholder="Brief description of the sponsor..." 
              rows={2} 
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none" 
            />
          </div>

          {/* Logo Upload with Toggle */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-gray-400 uppercase">
                Sponsor Logo
              </label>
              <button
                type="button"
                onClick={() => setUseLogoLink(!useLogoLink)}
                className="text-xs text-primary hover:underline"
              >
                {useLogoLink ? 'Use Upload' : 'Use Image Link'}
              </button>
            </div>

            {useLogoLink ? (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  onChange={handleLogoLinkChange}
                  value={currentLogoUrl}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for the sponsor logo
                </p>
              </div>
            ) : (
              <div>
                <ImageUpload
                  onUpload={handleLogoUpload}
                  defaultValue={currentLogoUrl}
                  folder="sponsors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload a logo or toggle to use an external link
                </p>
              </div>
            )}
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
              {editingId ? 'Update Sponsor' : 'Create Sponsor'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditingId(null); 
                  reset(); 
                  setCurrentLogoUrl('');
                  setUseLogoLink(false);
                }} 
                className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sponsors.map((sponsor, index) => (
          <div 
            key={sponsor._id} 
            className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 text-center group relative hover:border-primary/50 transition-all"
          >
            {/* Order Controls */}
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {index > 0 && (
                <button
                  onClick={() => moveSponsor(sponsor._id, 'up')}
                  className="p-1 bg-black/70 hover:bg-black rounded text-white"
                  title="Move Up"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
              )}
              {index < sponsors.length - 1 && (
                <button
                  onClick={() => moveSponsor(sponsor._id, 'down')}
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
                onClick={() => handleEdit(sponsor)} 
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(sponsor._id)} 
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Del
              </button>
            </div>

            {/* Inactive Overlay */}
            {!sponsor.isActive && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <span className="px-2 py-1 bg-red-600/90 text-white text-xs rounded-full">
                  Inactive
                </span>
              </div>
            )}

            {/* Logo */}
            <div className="relative h-20 mb-4 flex items-center justify-center">
              <img 
                src={sponsor.logo?.url || getLogoUrl(sponsor.name)} 
                alt={sponsor.name} 
                className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getLogoUrl(sponsor.name);
                }}
              />
            </div>

            {/* Name */}
            <h3 className="text-white font-bold text-lg mb-1">{sponsor.name}</h3>

            {/* Category Badge */}
            <div className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-wider border rounded-full mb-2 ${categoryColors[sponsor.category]}`}>
              {sponsor.category}
            </div>

            {/* Website */}
            {sponsor.website && (
              <a 
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-400 hover:text-primary text-xs transition-colors mt-1"
              >
                <GlobeAltIcon className="w-3 h-3" />
                Website
              </a>
            )}

            {/* Description */}
            {sponsor.description && (
              <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                {sponsor.description}
              </p>
            )}

            {/* Order Display */}
            <div className="text-xs text-gray-600 mt-2">
              Order: {sponsor.order}
            </div>
          </div>
        ))}
      </div>

      {sponsors.length === 0 && (
        <div className="text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <p className="text-gray-500">No sponsors yet. Add your first sponsor above.</p>
        </div>
      )}
    </div>
  );
}