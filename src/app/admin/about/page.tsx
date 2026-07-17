'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import CustomSelect from '@/components/admin/CustomSelect';

// ─── Constants ────────────────────────────────────────────────

const SECTIONS = [
  { key: 'hero', label: 'Hero', icon: '🏠' },
  { key: 'introduction', label: 'Introduction', icon: '📖' },
  { key: 'story', label: 'Our Story', icon: '📖' },
  { key: 'mission', label: 'Mission', icon: '🎯' },
  { key: 'vision', label: 'Vision', icon: '👁️' },
  { key: 'coreValues', label: 'Core Values', icon: '💎' },
  { key: 'objectives', label: 'Objectives', icon: '📋' },
  { key: 'journeyTimeline', label: 'Journey Timeline', icon: '⏳' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
  { key: 'statistics', label: 'Statistics', icon: '📊' },
  { key: 'whyJoin', label: 'Why Join DRC', icon: '❓' },
  { key: 'facultyAdvisors', label: 'Faculty Advisors', icon: '👨‍🏫' },
  { key: 'facilities', label: 'Facilities', icon: '🏢' },
  { key: 'laboratories', label: 'Laboratories', icon: '🔬' },
  { key: 'sponsorsPartners', label: 'Sponsors & Partners', icon: '🤝' },
  { key: 'gallery', label: 'Gallery', icon: '🖼️' },
  { key: 'promotionalVideo', label: 'Promotional Video', icon: '🎬' },
  { key: 'faqs', label: 'FAQs', icon: '❓' },
  { key: 'callToAction', label: 'Call to Action', icon: '📢' },
];

const inputClass = 'w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary';
const labelClass = 'block text-xs font-black text-muted uppercase mb-2';
const smallInputClass = 'w-full bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary';

// ─── Main Component ───────────────────────────────────────────

export default function AboutAdminPage() {
  const [about, setAbout] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ section: string; index: number; item: Record<string, unknown> } | null>(null);

  // ── Fetch ────────────────────────────────────────────────
  const fetchAbout = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/about');
      const data = await res.json();
      setAbout(data);
    } catch {
      toast.error('Failed to fetch about data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAbout(); }, [fetchAbout]);

  // ── Save Section ─────────────────────────────────────────
  const saveSection = async (sectionKey: string, data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [sectionKey]: data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAbout(updated);
        toast.success('Saved');
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle Section ───────────────────────────────────────
  const toggleSection = async (sectionKey: string, isEnabled: boolean) => {
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [sectionKey]: { isEnabled } }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAbout(updated);
        toast.success(isEnabled ? 'Section enabled' : 'Section disabled');
      }
    } catch {
      toast.error('Failed to toggle section');
    }
  };

  // ── Add Item ─────────────────────────────────────────────
  const addItem = async (sectionKey: string, item: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/about/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, item }),
      });
      const data = await res.json();
      if (res.ok) {
        setAbout(data);
        toast.success('Item added');
      } else {
        toast.error(data.error || 'Failed to add item');
      }
    } catch {
      toast.error('Failed to add item');
    }
  };

  // ── Update Item ──────────────────────────────────────────
  const updateItem = async (sectionKey: string, itemId: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/about/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, itemId, data }),
      });
      const responseData = await res.json();
      if (res.ok) {
        setAbout(responseData);
        toast.success('Item updated');
      } else {
        toast.error(responseData.error || 'Failed to update item');
      }
    } catch {
      toast.error('Failed to update item');
    }
  };

  // ── Remove Item ──────────────────────────────────────────
  const removeItem = async (sectionKey: string, itemId: string) => {
    if (!confirm('Remove this item?')) return;
    try {
      const res = await fetch('/api/admin/about/items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, itemId }),
      });
      const data = await res.json();
      if (res.ok) {
        setAbout(data);
        toast.success('Item removed');
      } else {
        toast.error(data.error || 'Failed to remove item');
      }
    } catch {
      toast.error('Failed to remove item');
    }
  };

  // ── Get Section Data ─────────────────────────────────────
  const getSection = (key: string): Record<string, unknown> => {
    return (about?.[key] as Record<string, unknown>) || { isEnabled: false, displayOrder: 0 };
  };

  const getItems = (key: string): Record<string, unknown>[] => {
    const section = getSection(key);
    return (section.items as Record<string, unknown>[]) || [];
  };

  // ── Render ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground">About CMS</h1>
          <p className="text-muted text-sm mt-1">Manage all sections of the About page. Toggle, reorder, and edit content.</p>
        </div>
        <div className="text-sm text-muted">
          {SECTIONS.filter(s => getSection(s.key).isEnabled).length} / {SECTIONS.length} sections enabled
        </div>
      </div>

      {/* Mobile Section Selector */}
      <div className="lg:hidden">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3">Select Section</p>
          <select
            value={activeSection || ''}
            onChange={(e) => setActiveSection(e.target.value || null)}
            className="w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">-- Choose a section --</option>
            {SECTIONS.map((s) => {
              const section = getSection(s.key);
              return (
                <option key={s.key} value={s.key}>
                  {s.icon} {s.label} {section.isEnabled ? '(Enabled)' : '(Disabled)'}
                </option>
              );
            })}
          </select>
          {activeSection && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted">
                {getSection(activeSection).isEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={() => toggleSection(activeSection, !getSection(activeSection).isEnabled)}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors ${getSection(activeSection).isEnabled ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'}`}
              >
                {getSection(activeSection).isEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Section List (Desktop) */}
        <div className="hidden lg:block lg:w-72 flex-shrink-0">
          <div className="bg-card border border-border rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-4 mb-2">Sections</p>
            {SECTIONS.map((s) => {
              const section = getSection(s.key);
              const isActive = activeSection === s.key;
              return (
                <div key={s.key} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-primary/20 text-foreground' : 'text-muted hover:bg-background/5 hover:text-foreground'}`}
                  onClick={() => setActiveSection(isActive ? null : s.key)}>
                  <span className="text-sm">{s.icon}</span>
                  <span className="flex-1 text-sm font-medium truncate">{s.label}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSection(s.key, !section.isEnabled); }}
                    className={`w-9 h-5 rounded-full transition-colors relative ${section.isEnabled ? 'bg-primary' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${section.isEnabled ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Section Editor */}
        <div className="flex-1 min-w-0">
          {!activeSection ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <p className="text-muted text-lg">Select a section from the left to edit its content.</p>
              <p className="text-muted text-sm mt-2">Toggle sections on/off using the switches.</p>
            </div>
          ) : (
            <SectionEditor
              sectionKey={activeSection}
              data={getSection(activeSection)}
              items={getItems(activeSection)}
              saving={saving}
              onSave={(data) => saveSection(activeSection, data)}
              onAddItem={(item) => addItem(activeSection, item)}
              onUpdateItem={(itemId, data) => updateItem(activeSection, itemId, data)}
              onRemoveItem={(itemId) => removeItem(activeSection, itemId)}
              editingItem={editingItem?.section === activeSection ? editingItem : null}
              setEditingItem={(item) => setEditingItem(item ? { ...item, section: activeSection } : null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section Editor Component ─────────────────────────────────

function SectionEditor({
  sectionKey, data, items, saving, onSave, onAddItem, onUpdateItem, onRemoveItem, editingItem, setEditingItem,
}: {
  sectionKey: string;
  data: Record<string, unknown>;
  items: Record<string, unknown>[];
  saving: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onAddItem: (item: Record<string, unknown>) => void;
  onUpdateItem: (itemId: string, data: Record<string, unknown>) => void;
  onRemoveItem: (itemId: string) => void;
  editingItem: { section: string; index: number; item: Record<string, unknown> } | null;
  setEditingItem: (item: { section: string; index: number; item: Record<string, unknown> } | null) => void;
}) {
  const [localData, setLocalData] = useState<Record<string, unknown>>(data);
  const [newItem, setNewItem] = useState<Record<string, unknown>>({});

  useEffect(() => { setLocalData(data); }, [data]);

  const update = (key: string, value: unknown) => setLocalData(prev => ({ ...prev, [key]: value }));

  const sectionInfo = SECTIONS.find(s => s.key === sectionKey);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2">
            <span>{sectionInfo?.icon}</span>
            <span>{sectionInfo?.label}</span>
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">
              Order:
              <input type="number" value={localData.displayOrder as number || 0}
                onChange={(e) => update('displayOrder', parseInt(e.target.value) || 0)}
                className="w-16 bg-input-bg border border-border rounded px-2 py-1 text-xs text-foreground ml-2 text-center" />
            </span>
            <button onClick={() => onSave(localData)} disabled={saving}
              className="px-4 py-2 bg-primary text-foreground text-sm rounded-lg hover:bg-primary/80 disabled:opacity-50 font-bold">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Section-specific form */}
        <div className="space-y-4">
          {(sectionKey === 'hero') && <HeroForm data={localData} update={update} />}
          {(sectionKey === 'introduction') && <IntroductionForm data={localData} update={update} />}
          {['story', 'mission', 'vision'].includes(sectionKey) && <ContentForm sectionKey={sectionKey} data={localData} update={update} />}
          {sectionKey === 'promotionalVideo' && <VideoForm data={localData} update={update} />}
          {sectionKey === 'callToAction' && <CTAForm data={localData} update={update} />}
          {['coreValues', 'objectives', 'journeyTimeline', 'achievements', 'statistics', 'whyJoin', 'facultyAdvisors', 'facilities', 'laboratories', 'sponsorsPartners', 'gallery', 'faqs'].includes(sectionKey) && (
            <ItemsList
              sectionKey={sectionKey}
              items={items}
              onAddItem={onAddItem}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Hero Form ────────────────────────────────────────────────

function HeroForm({ data, update }: { data: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const hero = data as any;
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Banner Image</label>
        <ImageUpload onUpload={(url) => update('bannerImage', { ...hero.bannerImage, url })} folder="about/hero" value={hero.bannerImage?.url} />
        {hero.bannerImage?.url && <img src={hero.bannerImage.url} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input value={hero.title || ''} onChange={(e) => update('title', e.target.value)} className={inputClass} placeholder="About DUET Robotics Club" />
        </div>
        <div>
          <label className={labelClass}>Subtitle</label>
          <input value={hero.subtitle || ''} onChange={(e) => update('subtitle', e.target.value)} className={inputClass} placeholder="Building the future..." />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>CTA Button Text</label>
          <input value={hero.ctaButton?.text || ''} onChange={(e) => update('ctaButton', { ...hero.ctaButton, text: e.target.value })} className={inputClass} placeholder="Learn More" />
        </div>
        <div>
          <label className={labelClass}>CTA Button Link</label>
          <input value={hero.ctaButton?.link || ''} onChange={(e) => update('ctaButton', { ...hero.ctaButton, link: e.target.value })} className={inputClass} placeholder="#about" />
        </div>
      </div>
    </div>
  );
}

// ─── Introduction Form ────────────────────────────────────────

function IntroductionForm({ data, update }: { data: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const intro = data as any;
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Short Introduction</label>
        <textarea value={intro.shortIntro || ''} onChange={(e) => update('shortIntro', e.target.value)} rows={3} className={inputClass} placeholder="Brief introduction paragraph..." />
      </div>
      <div>
        <label className={labelClass}>Long Description</label>
        <RichTextEditor value={intro.longDescription || ''} onChange={(val) => update('longDescription', val)} />
      </div>
    </div>
  );
}

// ─── Content Form (Story/Mission/Vision) ──────────────────────

function ContentForm({ sectionKey, data, update }: { sectionKey: string; data: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const content = data as any;
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Content</label>
        <RichTextEditor value={content.content || ''} onChange={(val) => update('content', val)} />
      </div>
      <div>
        <label className={labelClass}>Image</label>
        <ImageUpload onUpload={(url) => update('image', { ...content.image, url })} folder="about/sections" value={content.image?.url} />
        {content.image?.url && <img src={content.image.url} alt="" className="mt-2 w-full h-40 object-cover rounded-lg" />}
        {sectionKey === 'story' && (
          <p className="text-xs text-muted mt-2 italic">This image will show in Home page</p>
        )}
      </div>
    </div>
  );
}

// ─── Video Form ───────────────────────────────────────────────

function VideoForm({ data, update }: { data: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const video = data as any;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input value={video.title || ''} onChange={(e) => update('title', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Video URL (YouTube/Vimeo embed)</label>
          <input value={video.videoUrl || ''} onChange={(e) => update('videoUrl', e.target.value)} className={inputClass} placeholder="https://www.youtube.com/embed/..." />
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea value={video.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Thumbnail</label>
        <ImageUpload onUpload={(url) => update('thumbnailUrl', url)} folder="about/video" value={video.thumbnailUrl} />
        {video.thumbnailUrl && <img src={video.thumbnailUrl} alt="" className="mt-2 w-48 h-28 object-cover rounded-lg" />}
      </div>
    </div>
  );
}

// ─── CTA Form ─────────────────────────────────────────────────

function CTAForm({ data, update }: { data: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const cta = data as any;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input value={cta.title || ''} onChange={(e) => update('title', e.target.value)} className={inputClass} placeholder="Ready to Join?" />
        </div>
        <div>
          <label className={labelClass}>Button Text</label>
          <input value={cta.buttonText || ''} onChange={(e) => update('buttonText', e.target.value)} className={inputClass} placeholder="Join Now" />
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea value={cta.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} className={inputClass} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Button Link</label>
          <input value={cta.buttonLink || ''} onChange={(e) => update('buttonLink', e.target.value)} className={inputClass} placeholder="/register" />
        </div>
        <div>
          <label className={labelClass}>Background Image</label>
          <ImageUpload onUpload={(url) => update('image', { ...cta.image, url })} folder="about/cta" value={cta.image?.url} />
          {cta.image?.url && <img src={cta.image.url} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />}
        </div>
      </div>
    </div>
  );
}

// ─── Items List ───────────────────────────────────────────────

function ItemsList({ sectionKey, items, onAddItem, onUpdateItem, onRemoveItem }: {
  sectionKey: string;
  items: Record<string, unknown>[];
  onAddItem: (item: Record<string, unknown>) => void;
  onUpdateItem: (itemId: string, data: Record<string, unknown>) => void;
  onRemoveItem: (itemId: string) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});

  const startEdit = (index: number) => {
    setEditingIdx(index);
    setEditData({ ...items[index] });
  };

  const saveEdit = () => {
    if (editingIdx !== null && items[editingIdx]._id) {
      onUpdateItem(items[editingIdx]._id as string, editData);
      setEditingIdx(null);
    }
  };

  const handleAdd = () => {
    const item: Record<string, unknown> = {
      isPublished: true,
      displayOrder: items.length,
    };
    // Add section-specific defaults
    if (['coreValues', 'objectives', 'whyJoin'].includes(sectionKey)) {
      Object.assign(item, { title: '', description: '', icon: '' });
    } else if (sectionKey === 'journeyTimeline') {
      Object.assign(item, { year: '', title: '', description: '' });
    } else if (sectionKey === 'achievements') {
      Object.assign(item, { title: '', description: '', year: '' });
    } else if (sectionKey === 'statistics') {
      Object.assign(item, { label: '', value: '', icon: '' });
    } else if (sectionKey === 'facultyAdvisors') {
      Object.assign(item, { name: '', designation: '', department: '', message: '' });
    } else if (sectionKey === 'facilities' || sectionKey === 'laboratories') {
      Object.assign(item, { name: '', description: '', equipment: sectionKey === 'laboratories' ? [] : undefined });
    } else if (sectionKey === 'sponsorsPartners') {
      Object.assign(item, { name: '', website: '', tier: '' });
    } else if (sectionKey === 'gallery') {
      Object.assign(item, { url: '', alt: '', caption: '', type: 'image' });
    } else if (sectionKey === 'faqs') {
      Object.assign(item, { question: '', answer: '' });
    }
    onAddItem(item);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{items.length} items</p>
        <button onClick={handleAdd} className="px-3 py-1.5 bg-primary/20 text-primary text-xs rounded-lg hover:bg-primary/30 font-bold">
          + Add Item
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-muted text-sm text-center py-4">No items yet. Click "Add Item" to create one.</p>
      )}

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item._id as string || idx} className="bg-input-bg border border-border rounded-lg p-4 group hover:border-primary/30 transition-all">
            {editingIdx === idx ? (
              /* Edit Mode */
              <div className="space-y-3">
                <ItemForm sectionKey={sectionKey} data={editData} update={(k, v) => setEditData(prev => ({ ...prev, [k]: v }))} />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="px-3 py-1 bg-green-600 text-foreground text-xs rounded hover:bg-green-700 font-bold">Save</button>
                  <button onClick={() => setEditingIdx(null)} className="px-3 py-1 bg-white/10 text-muted text-xs rounded hover:bg-background/20">Cancel</button>
                </div>
              </div>
            ) : (
              /* Display Mode */
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-bold truncate">
                    {(item as any).title || (item as any).name || (item as any).question || (item as any).label || 'Untitled'}
                  </p>
                  <p className="text-muted text-xs truncate">
                    {(item as any).description || (item as any).answer || (item as any).value || ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`w-2 h-2 rounded-full ${(item as any).isPublished ? 'bg-green-400' : 'bg-red-400'}`} />
                  <button onClick={() => startEdit(idx)} className="px-2 py-1 bg-blue-600 text-foreground text-xs rounded hover:bg-blue-700">Edit</button>
                  <button onClick={() => (item as any)._id && onRemoveItem((item as any)._id)} className="px-2 py-1 bg-red-600 text-foreground text-xs rounded hover:bg-red-700">Del</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Item Form (section-specific) ─────────────────────────────

function ItemForm({ sectionKey, data, update }: { sectionKey: string; data: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const item = data as any;

  const commonFields = (
    <>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={item.isPublished !== false} onChange={(e) => update('isPublished', e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
          <span className="text-xs text-muted">Published</span>
        </label>
        <div>
          <label className="text-xs text-muted mr-1">Order:</label>
          <input type="number" value={item.displayOrder || 0} onChange={(e) => update('displayOrder', parseInt(e.target.value) || 0)} className="w-16 bg-input-bg border border-border rounded px-2 py-1 text-xs text-foreground text-center" />
        </div>
      </div>
    </>
  );

  switch (sectionKey) {
    case 'coreValues':
    case 'objectives':
    case 'whyJoin':
      return (
        <div className="space-y-3">
          <input value={item.title || ''} onChange={(e) => update('title', e.target.value)} className={smallInputClass} placeholder="Title" />
          <textarea value={item.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} className={smallInputClass} placeholder="Description" />
          <input value={item.icon || ''} onChange={(e) => update('icon', e.target.value)} className={smallInputClass} placeholder="Icon (emoji or lucide name)" />
          {commonFields}
        </div>
      );

    case 'journeyTimeline':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={item.year || ''} onChange={(e) => update('year', e.target.value)} className={smallInputClass} placeholder="Year (e.g., 2020)" />
            <input value={item.title || ''} onChange={(e) => update('title', e.target.value)} className={smallInputClass} placeholder="Title" />
          </div>
          <textarea value={item.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} className={smallInputClass} placeholder="Description" />
          <div>
            <label className="text-xs text-muted">Image</label>
            <ImageUpload onUpload={(url) => update('image', { ...item.image, url })} folder="about/timeline" value={item.image?.url} />
            {item.image?.url && <img src={item.image.url} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>
          {commonFields}
        </div>
      );

    case 'achievements':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={item.title || ''} onChange={(e) => update('title', e.target.value)} className={smallInputClass} placeholder="Title" />
            <input value={item.year || ''} onChange={(e) => update('year', e.target.value)} className={smallInputClass} placeholder="Year" />
          </div>
          <textarea value={item.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} className={smallInputClass} placeholder="Description" />
          <div>
            <label className="text-xs text-muted">Image</label>
            <ImageUpload onUpload={(url) => update('image', { ...item.image, url })} folder="about/achievements" value={item.image?.url} />
            {item.image?.url && <img src={item.image.url} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>
          {commonFields}
        </div>
      );

    case 'statistics':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={item.label || ''} onChange={(e) => update('label', e.target.value)} className={smallInputClass} placeholder="Label (e.g., Members)" />
            <input value={item.value || ''} onChange={(e) => update('value', e.target.value)} className={smallInputClass} placeholder="Value (e.g., 150+)" />
          </div>
          <input value={item.icon || ''} onChange={(e) => update('icon', e.target.value)} className={smallInputClass} placeholder="Icon" />
          {commonFields}
        </div>
      );

    case 'facultyAdvisors':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={item.name || ''} onChange={(e) => update('name', e.target.value)} className={smallInputClass} placeholder="Name" />
            <input value={item.designation || ''} onChange={(e) => update('designation', e.target.value)} className={smallInputClass} placeholder="Designation" />
          </div>
          <input value={item.department || ''} onChange={(e) => update('department', e.target.value)} className={smallInputClass} placeholder="Department" />
          <textarea value={item.message || ''} onChange={(e) => update('message', e.target.value)} rows={2} className={smallInputClass} placeholder="Message" />
          <div>
            <label className="text-xs text-muted">Photo</label>
            <ImageUpload onUpload={(url) => update('image', { ...item.image, url })} folder="about/faculty" value={item.image?.url} />
            {item.image?.url && <img src={item.image.url} alt="" className="mt-2 w-20 h-20 object-cover rounded-full" />}
          </div>
          {commonFields}
        </div>
      );

    case 'facilities':
    case 'laboratories':
      return (
        <div className="space-y-3">
          <input value={item.name || ''} onChange={(e) => update('name', e.target.value)} className={smallInputClass} placeholder="Name" />
          <textarea value={item.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} className={smallInputClass} placeholder="Description" />
          {sectionKey === 'laboratories' && (
            <textarea
              value={Array.isArray(item.equipment) ? item.equipment.join('\n') : ''}
              onChange={(e) => update('equipment', e.target.value.split('\n').filter(Boolean))}
              rows={3} className={smallInputClass} placeholder="Equipment (one per line)"
            />
          )}
          <div>
            <label className="text-xs text-muted">Photo</label>
            <ImageUpload onUpload={(url) => update('image', { ...item.image, url })} folder={`about/${sectionKey}`} value={item.image?.url} />
            {item.image?.url && <img src={item.image.url} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>
          {commonFields}
        </div>
      );

    case 'sponsorsPartners':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={item.name || ''} onChange={(e) => update('name', e.target.value)} className={smallInputClass} placeholder="Name" />
            <CustomSelect value={item.tier || ''} onChange={(val) => update('tier', val)} options={[{value:'Platinum',label:'Platinum'},{value:'Gold',label:'Gold'},{value:'Silver',label:'Silver'},{value:'Bronze',label:'Bronze'},{value:'Partner',label:'Partner'}]} placeholder="Select tier" />
          </div>
          <input value={item.website || ''} onChange={(e) => update('website', e.target.value)} className={smallInputClass} placeholder="Website URL" />
          <div>
            <label className="text-xs text-muted">Logo</label>
            <ImageUpload onUpload={(url) => update('image', { ...item.image, url })} folder="about/sponsors" value={item.image?.url} />
            {item.image?.url && <img src={item.image.url} alt="" className="mt-2 w-24 h-12 object-contain" />}
          </div>
          {commonFields}
        </div>
      );

    case 'gallery':
      return (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted">Media</label>
            <ImageUpload onUpload={(url) => update('url', url)} folder="about/gallery" value={item.url} />
            {item.url && <img src={item.url} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={item.alt || ''} onChange={(e) => update('alt', e.target.value)} className={smallInputClass} placeholder="Alt text" />
            <CustomSelect value={item.type || ''} onChange={(val) => update('type', val)} options={[{value:'Image',label:'Image'},{value:'Video',label:'Video'}]} placeholder="Select type" />
          </div>
          <input value={item.caption || ''} onChange={(e) => update('caption', e.target.value)} className={smallInputClass} placeholder="Caption" />
          {commonFields}
        </div>
      );

    case 'faqs':
      return (
        <div className="space-y-3">
          <input value={item.question || ''} onChange={(e) => update('question', e.target.value)} className={smallInputClass} placeholder="Question" />
          <textarea value={item.answer || ''} onChange={(e) => update('answer', e.target.value)} rows={3} className={smallInputClass} placeholder="Answer" />
          {commonFields}
        </div>
      );

    default:
      return <div className="text-muted text-sm">No form available for this section type.</div>;
  }
}
