'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const SECTION_CONFIG = [
  { key: 'hero', label: 'Hero', icon: '🖼️', description: 'Main hero/banner section' },
  { key: 'about', label: 'About', icon: '📝', description: 'About the club section' },
  { key: 'events', label: 'Events', icon: '📅', description: 'Upcoming events section' },
  { key: 'stats', label: 'Stats', icon: '📈', description: 'Statistics counters section' },
  { key: 'focusAreas', label: 'Focus Areas', icon: '🎯', description: 'Core focus areas section' },
  { key: 'research', label: 'Research', icon: '🔬', description: 'Research frontiers section' },
  { key: 'blog', label: 'Blog', icon: '📰', description: 'Blog posts section' },
  { key: 'projects', label: 'Projects', icon: '🚀', description: 'Projects showcase section' },
  { key: 'gallery', label: 'Gallery', icon: '🖼️', description: 'Photo gallery section' },
  { key: 'timeline', label: 'Timeline', icon: '⏳', description: 'Club timeline/history section' },
  { key: 'committee', label: 'Committee', icon: '👥', description: 'Team members section' },
  { key: 'testimonials', label: 'Testimonials', icon: '💬', description: 'Testimonials section' },
  { key: 'faq', label: 'FAQ', icon: '❓', description: 'Frequently asked questions section' },
  { key: 'sponsors', label: 'Sponsors', icon: '🤝', description: 'Sponsors/partners section' },
  { key: 'footer', label: 'Footer', icon: '🔻', description: 'Site footer section' },
];

export default function SectionsPage() {
  const [sections, setSections] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/section-visibility');
      const data = await res.json();
      const sectionMap: Record<string, boolean> = {};
      if (data.sections) {
        Object.entries(data.sections).forEach(([key, value]) => {
          sectionMap[key] = value as boolean;
        });
      }
      SECTION_CONFIG.forEach((s) => {
        if (!(s.key in sectionMap)) sectionMap[s.key] = true;
      });
      setSections(sectionMap);
    } catch (error) {
      toast.error('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = async (key: string) => {
    const updated = { ...sections, [key]: !sections[key] };
    setSections(updated);
    setSaving(true);
    try {
      const res = await fetch('/api/section-visibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updated }),
      });
      if (res.ok) {
        toast.success(`${updated[key] ? 'Shown' : 'Hidden'} on frontend`);
      } else {
        toast.error('Failed to save');
        setSections(sections);
      }
    } catch (error) {
      toast.error('Failed to save');
      setSections(sections);
    } finally {
      setSaving(false);
    }
  };

  const toggleAll = async (show: boolean) => {
    const updated: Record<string, boolean> = {};
    SECTION_CONFIG.forEach((s) => { updated[s.key] = show; });
    setSections(updated);
    setSaving(true);
    try {
      const res = await fetch('/api/section-visibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updated }),
      });
      if (res.ok) {
        toast.success(show ? 'All sections shown' : 'All sections hidden');
      } else {
        toast.error('Failed to save');
        setSections(sections);
      }
    } catch (error) {
      toast.error('Failed to save');
      setSections(sections);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  const visibleCount = Object.values(sections).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white">Sections</h1>
          <p className="text-gray-500 text-sm mt-1">
            {visibleCount} of {SECTION_CONFIG.length} sections visible on frontend
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleAll(true)}
            disabled={saving}
            className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
          >
            Show All
          </button>
          <button
            onClick={() => toggleAll(false)}
            disabled={saving}
            className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            Hide All
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {SECTION_CONFIG.map((section) => (
            <div
              key={section.key}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <h3 className="text-white font-medium">{section.label}</h3>
                  <p className="text-gray-500 text-xs">{section.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleSection(section.key)}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                  sections[section.key] ? 'bg-primary' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    sections[section.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
