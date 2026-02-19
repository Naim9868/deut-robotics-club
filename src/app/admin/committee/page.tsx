'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface CommitteeForm {
  name: string;
  role: string;
  department: string;
  session: string;
  email: string;
  image: { url: string; alt: string; publicId?: string };
  socialLinks: {
    linkedin: string;
    github: string;
    facebook: string;
  };
  order: number;
  isActive: boolean;
  isExecutive: boolean;
}

export default function CommitteePage() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [useImageLink, setUseImageLink] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<CommitteeForm>({
    defaultValues: {
      name: '',
      role: '',
      department: '',
      session: '',
      email: '',
      image: { url: '', alt: '' },
      socialLinks: { linkedin: '', github: '', facebook: '' },
      order: 0,
      isActive: true,
      isExecutive: false
    }
  });

  // Helper to generate avatar from name
  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1e1e1e&color=e63946&size=200&bold=true&length=2`;
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/committee');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string, publicId?: string) => {
    setValue('image', { 
      url, 
      alt: watch('name') || 'Committee member',
      publicId 
    });
    setCurrentImageUrl(url);
    setUseImageLink(false);
  };

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('image', { 
      url, 
      alt: watch('name') || 'Committee member'
    });
    setCurrentImageUrl(url);
  };

  const onSubmit = async (data: CommitteeForm) => {
    try {
      // Ensure image is set
      if (!data.image?.url) {
        data.image = {
          url: getAvatarUrl(data.name),
          alt: data.name
        };
      }

      // Ensure socialLinks exists
      if (!data.socialLinks) {
        data.socialLinks = { linkedin: '', github: '', facebook: '' };
      }

      const url = editingId ? `/api/committee/${editingId}` : '/api/committee';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(editingId ? 'Member updated' : 'Member created');
        reset();
        setEditingId(null);
        setCurrentImageUrl('');
        setUseImageLink(false);
        fetchMembers();
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

  const handleEdit = (member: any) => {
    setEditingId(member._id);
    setCurrentImageUrl(member.image?.url || '');
    reset({
      ...member,
      image: member.image || { url: '', alt: member.name },
      socialLinks: member.socialLinks || { linkedin: '', github: '', facebook: '' }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
      const res = await fetch(`/api/committee/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        toast.success('Member deleted');
        fetchMembers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Reorder members
  const moveMember = async (id: string, direction: 'up' | 'down') => {
    const index = members.findIndex(m => m._id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === members.length - 1)
    ) return;

    const newMembers = [...members];
    const temp = newMembers[index];
    newMembers[index] = newMembers[index + (direction === 'up' ? -1 : 1)];
    newMembers[index + (direction === 'up' ? -1 : 1)] = temp;

    // Update order values
    const updates = newMembers.map((member, idx) => ({
      updateOne: {
        filter: { _id: member._id },
        update: { $set: { order: idx } }
      }
    }));

    try {
      await fetch('/api/committee/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      
      setMembers(newMembers);
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
        <h1 className="text-4xl font-black text-white">Committee Members</h1>
        <p className="text-gray-500 text-sm">{members.length} members</p>
      </div>

      {/* Form */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {editingId ? 'Edit Member' : 'Add New Member'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('name', { required: 'Name is required' })} 
                placeholder="John Doe" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('role', { required: 'Role is required' })} 
                placeholder="President" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Department
              </label>
              <input 
                {...register('department')} 
                placeholder="Computer Science" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Session
              </label>
              <input 
                {...register('session')} 
                placeholder="2018-19" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                Email
              </label>
              <input 
                {...register('email')} 
                type="email" 
                placeholder="john@example.com" 
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>

            {/* Order Field - NEW */}
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
          </div>

          {/* Image Upload with Toggle */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-gray-400 uppercase">
                Profile Image
              </label>
              <button
                type="button"
                onClick={() => setUseImageLink(!useImageLink)}
                className="text-xs text-primary hover:underline"
              >
                {useImageLink ? 'Use Avatar Generator' : 'Use Image Link'}
              </button>
            </div>

            {useImageLink ? (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  onChange={handleImageLinkChange}
                  value={currentImageUrl}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for the profile image
                </p>
              </div>
            ) : (
              <div>
                <ImageUpload
                  onUpload={handleImageUpload}
                  defaultValue={currentImageUrl}
                  folder="committee"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image or toggle to use an external link
                </p>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="border-t border-white/5 pt-4">
            <label className="block text-xs font-black text-gray-400 uppercase mb-4">
              Social Links
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                {...register('socialLinks.linkedin')} 
                placeholder="LinkedIn URL" 
                className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              <input 
                {...register('socialLinks.github')} 
                placeholder="GitHub URL" 
                className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
              <input 
                {...register('socialLinks.facebook')} 
                placeholder="Facebook URL" 
                className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              />
            </div>
          </div>

          {/* Status Toggles */}
          <div className="border-t border-white/5 pt-4 flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isExecutive')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-300">Executive Member</span>
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
              {editingId ? 'Update Member' : 'Create Member'}
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

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member, index) => (
          <div 
            key={member._id} 
            className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all"
          >
            <div className="relative">
              <img 
                src={member.image?.url || getAvatarUrl(member.name)} 
                alt={member.name} 
                className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAvatarUrl(member.name);
                }}
              />
              
              {/* Order Controls */}
              <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    onClick={() => moveMember(member._id, 'up')}
                    className="p-1 bg-black/70 hover:bg-black rounded text-white"
                    title="Move Up"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                )}
                {index < members.length - 1 && (
                  <button
                    onClick={() => moveMember(member._id, 'down')}
                    className="p-1 bg-black/70 hover:bg-black rounded text-white"
                    title="Move Down"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Edit/Delete Controls */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(member)} 
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(member._id)} 
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                  Del
                </button>
              </div>

              {/* Executive Badge */}
              {member.isExecutive && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary/90 text-white text-xs rounded-full">
                  Executive
                </div>
              )}

              {/* Active Status Indicator */}
              {!member.isActive && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-2 py-1 bg-red-600/90 text-white text-xs rounded-full">
                    Inactive
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-bold text-lg">{member.name}</h3>
              <p className="text-primary text-sm font-black uppercase">{member.role}</p>
              {member.department && (
                <p className="text-gray-500 text-xs mt-1">{member.department}</p>
              )}
              {member.session && (
                <p className="text-gray-600 text-xs">{member.session}</p>
              )}
              
              {/* Order Display */}
              <div className="mt-2 text-xs text-gray-600">
                Order: {member.order}
              </div>

              {/* Social Links */}
              {(member.socialLinks?.linkedin || member.socialLinks?.github || member.socialLinks?.facebook) && (
                <div className="flex gap-2 mt-3">
                  {member.socialLinks.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                  {member.socialLinks.github && (
                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                      <span className="sr-only">GitHub</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {member.socialLinks.facebook && (
                    <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                      <span className="sr-only">Facebook</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <p className="text-gray-500">No committee members yet. Add your first member above.</p>
        </div>
      )}
    </div>
  );
}