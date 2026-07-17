'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

interface FooterForm {
  description: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    country: string;
  };
  email: string;
  phone: string;
  socialLinks: { platform: string; url: string; icon: string }[];
  quickLinks: { name: string; url: string }[];
  copyright: string;
  designer: { name: string; url: string };
  collaborators: { name: string; role: string }[];
  isActive: boolean;
}

export default function FooterPage() {
  const router = useRouter();
  const [footer, setFooter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<FooterForm>({
    defaultValues: {
      description: '',
      address: { line1: '', line2: '', city: '', country: '' },
      email: '',
      phone: '',
      socialLinks: [{ platform: 'FB', url: '', icon: 'FB' }],
      quickLinks: [{ name: '', url: '' }],
      copyright: '',
      designer: { name: '', url: '' },
      collaborators: [{ name: '', role: '' }],
      isActive: true
    }
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control, name: 'socialLinks' });
  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: 'quickLinks' });
  const { fields: collabFields, append: appendCollab, remove: removeCollab } = useFieldArray({ control, name: 'collaborators' });

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const res = await fetch('/api/footer');
      const data = await res.json();
      if (data.length > 0) {
        setEditingId(data[0]._id);
        reset(data[0]);
        setFooter(data[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FooterForm) => {
    try {
      const res = await fetch(`/api/footer${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Footer saved');
        router.push('/admin');
      } else {
        toast.error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-foreground">Footer</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-xs text-muted mb-2">Description</label>
            <textarea {...register('description')} rows={2} className="w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('address.line1')} placeholder="Address Line 1" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
            <input {...register('address.line2')} placeholder="Address Line 2" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
            <input {...register('address.city')} placeholder="City" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
            <input {...register('address.country')} placeholder="Country" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('email')} placeholder="Email" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
            <input {...register('phone')} placeholder="Phone" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Social Links</label>
            {socialFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <input {...register(`socialLinks.${index}.platform`)} placeholder="Platform (FB/LN/TW/YT)" className="bg-input-bg border border-border rounded-lg px-4 py-2 text-foreground" />
                <input {...register(`socialLinks.${index}.url`)} placeholder="URL" className="sm:col-span-2 bg-input-bg border border-border rounded-lg px-4 py-2 text-foreground" />
              </div>
            ))}
            <button type="button" onClick={() => appendSocial({ platform: '', url: '', icon: '' })} className="mt-2 text-sm text-primary">+ Add Social Link</button>
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Quick Links</label>
            {linkFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input {...register(`quickLinks.${index}.name`)} placeholder="Link Name" className="bg-input-bg border border-border rounded-lg px-4 py-2 text-foreground" />
                <input {...register(`quickLinks.${index}.url`)} placeholder="URL" className="bg-input-bg border border-border rounded-lg px-4 py-2 text-foreground" />
              </div>
            ))}
            <button type="button" onClick={() => appendLink({ name: '', url: '' })} className="mt-2 text-sm text-primary">+ Add Quick Link</button>
          </div>

          <input {...register('copyright')} placeholder="Copyright text" className="w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('designer.name')} placeholder="Designer Name" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
            <input {...register('designer.url')} placeholder="Designer URL" className="bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground" />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Collaborators</label>
            {collabFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input {...register(`collaborators.${index}.name`)} placeholder="Name" className="bg-input-bg border border-border rounded-lg px-4 py-2 text-foreground" />
                <input {...register(`collaborators.${index}.role`)} placeholder="Role" className="bg-input-bg border border-border rounded-lg px-4 py-2 text-foreground" />
              </div>
            ))}
            <button type="button" onClick={() => appendCollab({ name: '', role: '' })} className="mt-2 text-sm text-primary">+ Add Collaborator</button>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
              <span className="text-sm text-muted">Active</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.push('/admin')} className="px-6 py-3 border border-border text-muted rounded-lg">Cancel</button>
          <button type="submit" className="px-6 py-3 bg-primary text-white rounded-lg">Save Footer</button>
        </div>
      </form>

      {/* Preview */}
      {footer && (
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">🔍 Preview</h2>
          <div className="bg-card p-6 rounded-xl">
            <p className="text-muted">{footer.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6 text-sm">
              <div>
                <p className="text-foreground font-bold">Address</p>
                <p className="text-muted">{footer.address?.line1}, {footer.address?.city}</p>
              </div>
              <div>
                <p className="text-foreground font-bold">Email</p>
                <p className="text-muted">{footer.email}</p>
              </div>
              <div>
                <p className="text-foreground font-bold">Copyright</p>
                <p className="text-muted">{footer.copyright}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
