'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

interface NavbarForm {
  logo: {
    text: string;
    icon: string;
    iconBgColor: string;
  };
  navLinks: { name: string; href: string; id: string; order: number }[];
  ctaButton: {
    text: string;
    link: string;
    isActive: boolean;
  };
  isActive: boolean;
}

export default function NavbarPage() {
  const router = useRouter();
  const [navbar, setNavbar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<NavbarForm>({
    defaultValues: {
      logo: { text: 'DUET ROBOTICS', icon: 'D', iconBgColor: '#e63946' },
      navLinks: [
        { name: 'Home', href: '#home', id: 'home', order: 0 },
        { name: 'About', href: '#about', id: 'about', order: 1 },
        { name: 'Tech', href: '#tech', id: 'tech', order: 2 },
        { name: 'Blog', href: '#blog', id: 'blog', order: 3 },
        { name: 'Projects', href: '#projects', id: 'projects', order: 4 },
        { name: 'Gallery', href: '#gallery', id: 'gallery', order: 5 },
        { name: 'Team', href: '#committee', id: 'committee', order: 6 },
        { name: 'FAQ', href: '#faq', id: 'faq', order: 7 }
      ],
      ctaButton: { text: 'Join Now', link: '#contact', isActive: true },
      isActive: true
    }
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'navLinks' });

  useEffect(() => {
    fetchNavbar();
  }, []);

  const fetchNavbar = async () => {
    try {
      const res = await fetch('/api/navbar');
      const data = await res.json();
      if (data.length > 0) {
        setEditingId(data[0]._id);
        reset(data[0]);
        setNavbar(data[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: NavbarForm) => {
    try {
      const res = await fetch(`/api/navbar${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Navbar saved');
        router.push('/admin');
      } else {
        toast.error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const moveUp = (index: number) => {
    if (index > 0) move(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index < fields.length - 1) move(index, index + 1);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">Navbar</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Logo Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <input {...register('logo.text')} placeholder="Logo Text" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
            <input {...register('logo.icon')} placeholder="Icon Letter" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
            <input {...register('logo.iconBgColor')} type="color" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white h-12" />
          </div>

          <div className="border-t border-white/5 pt-6">
            <h2 className="text-xl font-bold text-white mb-4">Navigation Links</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2 bg-[#121212] p-2 rounded">
                <div className="flex flex-col">
                  <button type="button" onClick={() => moveUp(index)} className="text-gray-400 hover:text-white">↑</button>
                  <button type="button" onClick={() => moveDown(index)} className="text-gray-400 hover:text-white">↓</button>
                </div>
                <input {...register(`navLinks.${index}.name`)} placeholder="Name" className="flex-1 bg-transparent border border-white/10 rounded px-3 py-2 text-white" />
                <input {...register(`navLinks.${index}.href`)} placeholder="Href" className="flex-1 bg-transparent border border-white/10 rounded px-3 py-2 text-white" />
                <input {...register(`navLinks.${index}.id`)} placeholder="ID" className="w-24 bg-transparent border border-white/10 rounded px-3 py-2 text-white" />
                <button type="button" onClick={() => remove(index)} className="text-red-500">×</button>
              </div>
            ))}
            <button type="button" onClick={() => append({ name: '', href: '', id: '', order: fields.length })} className="mt-2 text-sm text-primary">
              + Add Nav Link
            </button>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h2 className="text-xl font-bold text-white mb-4">CTA Button</h2>
            <div className="grid grid-cols-2 gap-4">
              <input {...register('ctaButton.text')} placeholder="Button Text" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
              <input {...register('ctaButton.link')} placeholder="Button Link" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white" />
            </div>
            <label className="flex items-center gap-2 mt-4">
              <input type="checkbox" {...register('ctaButton.isActive')} className="w-4 h-4" />
              <span className="text-sm text-gray-300">Show CTA Button</span>
            </label>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.push('/admin')} className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg">Cancel</button>
          <button type="submit" className="px-6 py-3 bg-primary text-white rounded-lg">Save Navbar</button>
        </div>
      </form>

      {/* Preview */}
      {navbar && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">🔍 Preview</h2>
          <div className="bg-dark/95 border border-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-primary rounded flex items-center justify-center text-sm">{navbar.logo?.icon || 'D'}</span>
                <span>{navbar.logo?.text}</span>
              </div>
              <div className="flex gap-4">
                {navbar.navLinks?.slice(0, 3).map((link: any) => (
                  <span key={link.id} className="text-gray-400 text-sm">{link.name}</span>
                ))}
                <span className="text-primary text-sm">...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}