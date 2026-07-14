'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FocusAreaIcon from '@/components/FocusAreaIcon';
import { LUCIDE_CATEGORIES } from '@/components/FocusAreaIcon';

// ─── Interfaces ───────────────────────────────────────────────

interface TechnologyForm {
  name: string;
  icon: string;
  category: string;
}

interface ComponentForm {
  componentName: string;
  specification: string;
  quantity: number;
  inventoryReference: string;
}

interface LearningResourceForm {
  title: string;
  url: string;
  type: string;
  description: string;
}

interface FocusAreaForm {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  summary: string;
  icon: string;
  iconType: 'lucide' | 'image';
  color: string;
  category: string;
  subCategory: string;
  researchLevel: string;
  vision: string;
  mission: string;
  applications: string;
  skillsRequired: string;
  facultyAdvisor: string;
  mentors: string;
  industryMentors: string;
  coverImageUrl: string;
  coverImageAlt: string;
  bannerImageUrl: string;
  bannerImageAlt: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  featured: boolean;
  showOnHomepage: boolean;
  displayOrder: number;
  order: number;
  isActive: boolean;
  visibility: string;
}

const CATEGORIES = [
  'Robotics', 'Artificial Intelligence', 'Machine Learning', 'Computer Vision',
  'Embedded Systems', 'IoT', 'Drone', 'Automation', 'Biomedical Robotics',
  'Control Systems', 'Power Electronics', 'Mechanical Design', 'Other',
];

const TECH_CATEGORIES = [
  'Programming Language', 'Framework', 'Microcontroller', 'Simulation',
  'Cloud', 'Database', 'Hardware', 'Software',
];

const RESOURCE_TYPES = [
  { value: 'book', label: 'Book' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'github', label: 'GitHub' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'research_paper', label: 'Research Paper' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'course', label: 'Course' },
];

// ─── Main Component ───────────────────────────────────────────

export default function FocusAreasPage() {
  const [areas, setAreas] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'overview' | 'tech' | 'resources' | 'seo'>('basic');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconPickerTab, setIconPickerTab] = useState<'lucide' | 'image'>('lucide');
  const [lucideSearch, setLucideSearch] = useState('');
  const [iconType, setIconType] = useState<'lucide' | 'image'>('lucide');

  // Array states
  const [technologies, setTechnologies] = useState<TechnologyForm[]>([]);
  const [components, setComponents] = useState<ComponentForm[]>([]);
  const [learningResources, setLearningResources] = useState<LearningResourceForm[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [applicationsList, setApplicationsList] = useState<string[]>([]);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [mentorsList, setMentorsList] = useState<string[]>([]);
  const [industryMentorsList, setIndustryMentorsList] = useState<string[]>([]);

  // Tech form inputs
  const [techName, setTechName] = useState('');
  const [techCategory, setTechCategory] = useState('');

  // Component form inputs
  const [compName, setCompName] = useState('');
  const [compSpec, setCompSpec] = useState('');
  const [compQty, setCompQty] = useState(1);
  const [compRef, setCompRef] = useState('');

  // Resource form inputs
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resType, setResType] = useState('documentation');
  const [resDesc, setResDesc] = useState('');

  // Objective input
  const [objectiveInput, setObjectiveInput] = useState('');

  // Application input
  const [applicationInput, setApplicationInput] = useState('');

  // Skill input
  const [skillInput, setSkillInput] = useState('');

  // Mentor input
  const [mentorInput, setMentorInput] = useState('');
  const [industryMentorInput, setIndustryMentorInput] = useState('');

  // Image states
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [useImageLink, setUseImageLink] = useState(false);
  const [imageTarget, setImageTarget] = useState<'cover' | 'banner' | 'thumbnail'>('cover');

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FocusAreaForm>({
    defaultValues: {
      title: '', slug: '', shortDescription: '', fullDescription: '', summary: '',
      icon: 'Bot', iconType: 'lucide', color: '#e63946', category: 'Robotics', subCategory: '',
      researchLevel: 'beginner', vision: '', mission: '', applications: '',
      skillsRequired: '', facultyAdvisor: '', mentors: '', industryMentors: '',
      coverImageUrl: '', coverImageAlt: '', bannerImageUrl: '', bannerImageAlt: '',
      thumbnailUrl: '', thumbnailAlt: '', seoTitle: '', seoDescription: '',
      seoKeywords: '', featured: false, showOnHomepage: false, displayOrder: 0,
      order: 0, isActive: true, visibility: 'public',
    }
  });

  const inputClass = 'w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary';
  const labelClass = 'block text-xs font-black text-gray-400 uppercase mb-2';

  useEffect(() => { fetchAreas(); }, []);

  const fetchAreas = async () => {
    try {
      const res = await fetch('/api/focus-areas?limit=100');
      const data = await res.json();
      setAreas(data.focusAreas || data);
    } catch { toast.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  // ─── Array Helpers ─────────────────────────────────────────

  const addTechnology = () => {
    if (!techName.trim()) return;
    setTechnologies([...technologies, { name: techName.trim(), icon: '', category: techCategory.trim() }]);
    setTechName(''); setTechCategory('');
  };
  const removeTechnology = (i: number) => setTechnologies(technologies.filter((_, idx) => idx !== i));

  const addComponent = () => {
    if (!compName.trim()) return;
    setComponents([...components, { componentName: compName.trim(), specification: compSpec.trim(), quantity: compQty, inventoryReference: compRef.trim() }]);
    setCompName(''); setCompSpec(''); setCompQty(1); setCompRef('');
  };
  const removeComponent = (i: number) => setComponents(components.filter((_, idx) => idx !== i));

  const addLearningResource = () => {
    if (!resTitle.trim() || !resUrl.trim()) return;
    setLearningResources([...learningResources, { title: resTitle.trim(), url: resUrl.trim(), type: resType, description: resDesc.trim() }]);
    setResTitle(''); setResUrl(''); setResType('documentation'); setResDesc('');
  };
  const removeLearningResource = (i: number) => setLearningResources(learningResources.filter((_, idx) => idx !== i));

  const addObjective = () => {
    if (!objectiveInput.trim()) return;
    setObjectives([...objectives, objectiveInput.trim()]);
    setObjectiveInput('');
  };
  const removeObjective = (i: number) => setObjectives(objectives.filter((_, idx) => idx !== i));

  const addApplication = () => {
    if (!applicationInput.trim()) return;
    setApplicationsList([...applicationsList, applicationInput.trim()]);
    setApplicationInput('');
  };
  const removeApplication = (i: number) => setApplicationsList(applicationsList.filter((_, idx) => idx !== i));

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkillsList([...skillsList, skillInput.trim()]);
    setSkillInput('');
  };
  const removeSkill = (i: number) => setSkillsList(skillsList.filter((_, idx) => idx !== i));

  const addMentor = () => {
    if (!mentorInput.trim()) return;
    setMentorsList([...mentorsList, mentorInput.trim()]);
    setMentorInput('');
  };
  const removeMentor = (i: number) => setMentorsList(mentorsList.filter((_, idx) => idx !== i));

  const addIndustryMentor = () => {
    if (!industryMentorInput.trim()) return;
    setIndustryMentorsList([...industryMentorsList, industryMentorInput.trim()]);
    setIndustryMentorInput('');
  };
  const removeIndustryMentor = (i: number) => setIndustryMentorsList(industryMentorsList.filter((_, idx) => idx !== i));

  // ─── Icon Picker ───────────────────────────────────────────

  const handleIconSelect = (icon: string, type: 'lucide' | 'image') => {
    setValue('icon', icon);
    setValue('iconType', type);
    setIconType(type);
    setShowIconPicker(false);
  };

  // ─── Image Upload ──────────────────────────────────────────

  const handleIconImageUpload = (url: string, publicId?: string) => {
    setValue('icon', url);
    setValue('iconType', 'image');
    setIconType('image');
  };

  const handleImageUpload = (url: string, publicId?: string) => {
    if (imageTarget === 'cover') {
      setValue('coverImageUrl', url);
      setCoverImageUrl(url);
    } else if (imageTarget === 'banner') {
      setValue('bannerImageUrl', url);
      setBannerImageUrl(url);
    } else {
      setValue('thumbnailUrl', url);
      setThumbnailUrl(url);
    }
    setUseImageLink(false);
  };

  // ─── Submit ────────────────────────────────────────────────

  const onSubmit = async (data: FocusAreaForm) => {
    try {
      if (!data.title || !data.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      const payload = {
        title: data.title,
        slug: data.slug || undefined,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        summary: data.summary,
        icon: data.icon,
        iconType: data.iconType,
        color: data.color,
        category: data.category,
        subCategory: data.subCategory,
        researchLevel: data.researchLevel,
        vision: data.vision,
        mission: data.mission,
        objectives,
        technologies,
        components,
        applications: applicationsList,
        skillsRequired: skillsList,
        learningResources,
        faculty: {
          facultyAdvisor: data.facultyAdvisor,
          mentors: mentorsList,
          industryMentors: industryMentorsList,
        },
        coverImage: { url: data.coverImageUrl || coverImageUrl, alt: data.coverImageAlt || data.title, type: 'cloudinary' },
        bannerImage: { url: data.bannerImageUrl || bannerImageUrl, alt: data.bannerImageAlt || data.title, type: 'cloudinary' },
        thumbnail: { url: data.thumbnailUrl || thumbnailUrl, alt: data.thumbnailAlt || data.title, type: 'cloudinary' },
        homepage: { featured: data.featured, showOnHomepage: data.showOnHomepage, displayOrder: data.displayOrder },
        visibility: data.visibility,
        seo: { metaTitle: data.seoTitle, metaDescription: data.seoDescription, keywords: data.seoKeywords.split(',').map(k => k.trim()).filter(Boolean) },
        order: data.displayOrder || data.order,
        isActive: data.isActive,
      };

      const url = editingId ? `/api/focus-areas/${editingId}` : '/api/focus-areas';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Focus area updated' : 'Focus area created');
        resetForm();
        fetchAreas();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save');
      }
    } catch { toast.error('Failed to save'); }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
    setTechnologies([]); setComponents([]); setLearningResources([]);
    setObjectives([]); setApplicationsList([]); setSkillsList([]);
    setMentorsList([]); setIndustryMentorsList([]);
    setCoverImageUrl(''); setBannerImageUrl(''); setThumbnailUrl('');
    setIconType('lucide');
    setActiveTab('basic');
  };

  // ─── Edit Handler ──────────────────────────────────────────

  const handleEdit = (area: Record<string, unknown>) => {
    setEditingId(area._id as string);
    const coverImage = area.coverImage as { url?: string; alt?: string } | undefined;
    const bannerImage = area.bannerImage as { url?: string; alt?: string } | undefined;
    const thumbnail = area.thumbnail as { url?: string; alt?: string } | undefined;
    const faculty = (area.faculty as Record<string, unknown>) || {};
    const seo = (area.seo as Record<string, unknown>) || {};
    const hp = (area.homepage as Record<string, unknown>) || {};

    setCoverImageUrl(coverImage?.url || '');
    setBannerImageUrl(bannerImage?.url || '');
    setThumbnailUrl(thumbnail?.url || '');
    setIconType((area.iconType as 'lucide' | 'image') || 'lucide');
    setTechnologies((area.technologies as TechnologyForm[]) || []);
    setComponents((area.components as ComponentForm[]) || []);
    setLearningResources((area.learningResources as LearningResourceForm[]) || []);
    setObjectives((area.objectives as string[]) || []);
    setApplicationsList((area.applications as string[]) || []);
    setSkillsList((area.skillsRequired as string[]) || []);
    setMentorsList((faculty.mentors as string[]) || []);
    setIndustryMentorsList((faculty.industryMentors as string[]) || []);

    reset({
      title: (area.title as string) || '',
      slug: (area.slug as string) || '',
      shortDescription: (area.shortDescription as string) || '',
      fullDescription: (area.fullDescription as string) || '',
      summary: (area.summary as string) || '',
      icon: (area.icon as string) || 'Bot',
      iconType: (area.iconType as 'lucide' | 'image') || 'lucide',
      color: (area.color as string) || '#e63946',
      category: (area.category as string) || 'Robotics',
      subCategory: (area.subCategory as string) || '',
      researchLevel: (area.researchLevel as string) || 'beginner',
      vision: (area.vision as string) || '',
      mission: (area.mission as string) || '',
      applications: '',
      skillsRequired: '',
      facultyAdvisor: (faculty.facultyAdvisor as string) || '',
      mentors: '',
      industryMentors: '',
      coverImageUrl: coverImage?.url || '',
      coverImageAlt: coverImage?.alt || '',
      bannerImageUrl: bannerImage?.url || '',
      bannerImageAlt: bannerImage?.alt || '',
      thumbnailUrl: thumbnail?.url || '',
      thumbnailAlt: thumbnail?.alt || '',
      seoTitle: (seo.metaTitle as string) || '',
      seoDescription: (seo.metaDescription as string) || '',
      seoKeywords: ((seo.keywords as string[]) || []).join(', '),
      featured: (hp.featured as boolean) || false,
      showOnHomepage: (hp.showOnHomepage as boolean) || false,
      displayOrder: (hp.displayOrder as number) || 0,
      order: (area.order as number) || 0,
      isActive: (area.isActive as boolean) ?? true,
      visibility: (area.visibility as string) || 'public',
    });
  };

  // ─── Delete Handler ────────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this focus area?')) return;
    try {
      const res = await fetch(`/api/focus-areas/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Focus area deleted'); fetchAreas(); }
      else { const data = await res.json(); toast.error(data.error || 'Failed to delete'); }
    } catch { toast.error('Failed to delete'); }
  };

  // ─── Loading State ─────────────────────────────────────────

  if (loading) {
    return <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" /></div>;
  }

  // ─── Tabs Config ───────────────────────────────────────────

  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'media', label: 'Media' },
    { key: 'overview', label: 'Overview' },
    { key: 'tech', label: `Tech (${technologies.length})` },
    { key: 'resources', label: `Resources (${learningResources.length})` },
    { key: 'seo', label: 'SEO' },
  ] as const;

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-4xl font-black text-white">Focus Areas</h1>
        <p className="text-gray-500 text-sm">{areas.length} focus areas</p>
      </div>

      {/* Form */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Focus Area' : 'Add New Focus Area'}</h2>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-bold rounded transition-colors whitespace-nowrap ${activeTab === tab.key ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* ─── Basic Info Tab ──────────────────────────── */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                  <input {...register('title', { required: 'Required' })} placeholder="Focus Area Title" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Slug</label>
                  <input {...register('slug')} placeholder="auto-generated-from-title" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Short Description</label>
                <input {...register('shortDescription')} placeholder="Brief focus area summary (max 300 chars)" maxLength={300} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Full Description (Rich Text)</label>
                <RichTextEditor
                  value={watch('fullDescription') || ''}
                  onChange={(val) => setValue('fullDescription', val)}
                  placeholder="Detailed focus area description..."
                />
              </div>

              <div>
                <label className={labelClass}>Summary</label>
                <textarea {...register('summary')} rows={3} placeholder="Focus area summary..." className={`${inputClass} resize-none`} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select {...register('category', { required: 'Required' })} className={inputClass}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Sub Category</label>
                  <input {...register('subCategory')} placeholder="e.g., Line Follower" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Research Level</label>
                  <select {...register('researchLevel')} className={inputClass}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="research">Research</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Visibility</label>
                  <select {...register('visibility')} className={inputClass}>
                    <option value="public">Public</option>
                    <option value="members">Members Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Faculty Advisor</label>
                  <input {...register('facultyAdvisor')} placeholder="Prof. Name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mentors (comma-separated)</label>
                  <input value={mentorsList.join(', ')} onChange={(e) => setMentorsList(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Dr. A, Prof. B" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Industry Mentors (comma-separated)</label>
                  <input value={industryMentorsList.join(', ')} onChange={(e) => setIndustryMentorsList(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Mr. X, Ms. Y" className={inputClass} />
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
                  <span className="text-sm text-gray-300">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('showOnHomepage')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
                  <span className="text-sm text-gray-300">Show on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary" />
                  <span className="text-sm text-gray-300">Active</span>
                </label>
                <div><label className={labelClass}>Display Order</label><input type="number" {...register('displayOrder')} min="0" className={`${inputClass} w-24`} /></div>
              </div>
            </div>
          )}

          {/* ─── Media Tab ───────────────────────────────── */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Icon with Picker */}
              <div>
                <label className={labelClass}>Icon</label>
                <div className="flex gap-2">
                  <input {...register('icon')} placeholder="Icon value" className={`${inputClass} flex-1`} />
                  <button type="button" onClick={() => setShowIconPicker(!showIconPicker)}
                    className="px-4 py-3 bg-[#121212] border border-white/10 rounded-lg text-white hover:bg-primary/20 transition-colors">
                    {showIconPicker ? '✕' : '📋'}
                  </button>
                </div>

                {/* Icon Picker Dropdown */}
                {showIconPicker && (
                  <div className="mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                      <button type="button" onClick={() => setIconPickerTab('lucide')}
                        className={`flex-1 px-4 py-2.5 text-xs font-bold transition-colors ${iconPickerTab === 'lucide' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        Lucide Icons
                      </button>
                      <button type="button" onClick={() => setIconPickerTab('image')}
                        className={`flex-1 px-4 py-2.5 text-xs font-bold transition-colors ${iconPickerTab === 'image' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        Image Upload
                      </button>
                    </div>

                    <div className="p-4 max-h-80 overflow-y-auto">
                      {/* Lucide Icons Tab */}
                      {iconPickerTab === 'lucide' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={lucideSearch}
                            onChange={(e) => setLucideSearch(e.target.value)}
                            placeholder="Search icons..."
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                          />
                          {Object.entries(LUCIDE_CATEGORIES).map(([category, icons]) => {
                            const filtered = lucideSearch
                              ? icons.filter(i => i.toLowerCase().includes(lucideSearch.toLowerCase()))
                              : icons;
                            if (filtered.length === 0) return null;
                            return (
                              <div key={category}>
                                <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">{category}</h4>
                                <div className="flex flex-wrap gap-1">
                                  {filtered.map((iconName) => (
                                    <button key={iconName} type="button"
                                      onClick={() => handleIconSelect(iconName, 'lucide')}
                                      className={`p-2 rounded-lg hover:bg-primary/20 transition-colors ${watch('icon') === iconName && watch('iconType') === 'lucide' ? 'bg-primary/30 ring-2 ring-primary' : ''}`}
                                      title={iconName}>
                                      <FocusAreaIcon icon={iconName} iconType="lucide" color={watch('color')} className="text-lg" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Image Upload Tab */}
                      {iconPickerTab === 'image' && (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500">Upload an SVG or PNG with transparent background for best results.</p>
                          <ImageUpload onUpload={handleIconImageUpload} folder="focus-areas/icons" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div className="flex items-center gap-3 mt-3 px-3 py-2 bg-[#121212] rounded-lg">
                  <span className="text-xs text-gray-500">Preview:</span>
                  <FocusAreaIcon
                    icon={watch('icon')}
                    iconType={watch('iconType')}
                    color={watch('color')}
                    className="text-3xl"
                  />
                  <span className="text-[10px] text-gray-600 ml-auto">{watch('iconType')} — {watch('icon')}</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Color</label>
                <input {...register('color')} type="color" className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white h-12 w-32" />
              </div>

              {/* Cover Image */}
              <div className="border border-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-gray-400 uppercase">Cover Image</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setImageTarget('cover'); setUseImageLink(!useImageLink); }}
                      className="text-xs text-primary hover:underline">
                      {useImageLink ? 'Use Upload' : 'Use Link'}
                    </button>
                  </div>
                </div>
                {useImageLink && imageTarget === 'cover' ? (
                  <input type="url" placeholder="https://example.com/image.jpg"
                    onChange={(e) => { setValue('coverImageUrl', e.target.value); setCoverImageUrl(e.target.value); }}
                    value={coverImageUrl} className={inputClass} />
                ) : (
                  <ImageUpload onUpload={handleImageUpload} defaultValue={coverImageUrl} folder="focus-areas" />
                )}
              </div>

              {/* Banner Image */}
              <div className="border border-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-gray-400 uppercase">Banner Image</label>
                  <button type="button" onClick={() => { setImageTarget('banner'); setUseImageLink(!useImageLink); }}
                    className="text-xs text-primary hover:underline">
                    {useImageLink && imageTarget === 'banner' ? 'Use Upload' : 'Use Link'}
                  </button>
                </div>
                {useImageLink && imageTarget === 'banner' ? (
                  <input type="url" placeholder="https://example.com/banner.jpg"
                    onChange={(e) => { setValue('bannerImageUrl', e.target.value); setBannerImageUrl(e.target.value); }}
                    value={bannerImageUrl} className={inputClass} />
                ) : (
                  <ImageUpload onUpload={handleImageUpload} defaultValue={bannerImageUrl} folder="focus-areas" />
                )}
              </div>

              {/* Thumbnail */}
              <div className="border border-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-gray-400 uppercase">Thumbnail</label>
                  <button type="button" onClick={() => { setImageTarget('thumbnail'); setUseImageLink(!useImageLink); }}
                    className="text-xs text-primary hover:underline">
                    {useImageLink && imageTarget === 'thumbnail' ? 'Use Upload' : 'Use Link'}
                  </button>
                </div>
                {useImageLink && imageTarget === 'thumbnail' ? (
                  <input type="url" placeholder="https://example.com/thumb.jpg"
                    onChange={(e) => { setValue('thumbnailUrl', e.target.value); setThumbnailUrl(e.target.value); }}
                    value={thumbnailUrl} className={inputClass} />
                ) : (
                  <ImageUpload onUpload={handleImageUpload} defaultValue={thumbnailUrl} folder="focus-areas" />
                )}
              </div>

              {/* Gallery */}
              <div className="border border-white/5 rounded-lg p-4">
                <label className="text-xs font-black text-gray-400 uppercase mb-3 block">Gallery Images (URLs)</label>
                <p className="text-xs text-gray-500 mb-2">Enter image URLs separated by newlines</p>
                <textarea
                  onChange={(e) => {
                    const urls = e.target.value.split('\n').filter(u => u.trim()).map(url => ({ url: url.trim(), alt: '', type: 'cloudinary' as const }));
                    setValue('galleryImages' as any, urls);
                  }}
                  rows={4}
                  placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}

          {/* ─── Overview Tab ────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Vision</label>
                <textarea {...register('vision')} rows={3} placeholder="Vision statement for this focus area..." className={`${inputClass} resize-none`} />
              </div>

              <div>
                <label className={labelClass}>Mission</label>
                <textarea {...register('mission')} rows={3} placeholder="Mission statement..." className={`${inputClass} resize-none`} />
              </div>

              {/* Objectives */}
              <div>
                <label className={labelClass}>Objectives</label>
                <div className="flex gap-2 mb-2">
                  <input value={objectiveInput} onChange={(e) => setObjectiveInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                    placeholder="Add an objective" className={`${inputClass} flex-1`} />
                  <button type="button" onClick={addObjective}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
                <div className="space-y-1">
                  {objectives.map((obj, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-white text-sm flex-1">{obj}</span>
                      <button type="button" onClick={() => removeObjective(i)} className="text-gray-500 hover:text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <label className={labelClass}>Applications</label>
                <div className="flex gap-2 mb-2">
                  <input value={applicationInput} onChange={(e) => setApplicationInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addApplication())}
                    placeholder="e.g., Agriculture, Healthcare" className={`${inputClass} flex-1`} />
                  <button type="button" onClick={addApplication}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {applicationsList.map((app, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                      {app}
                      <button type="button" onClick={() => removeApplication(i)} className="ml-2 text-gray-500 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <label className={labelClass}>Skills Required</label>
                <div className="flex gap-2 mb-2">
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="e.g., Python, ROS, OpenCV" className={`${inputClass} flex-1`} />
                  <button type="button" onClick={addSkill}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                      {skill}
                      <button type="button" onClick={() => removeSkill(i)} className="ml-2 text-gray-500 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Tech Tab ────────────────────────────────── */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              {/* Technologies */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Technologies Used</h3>
                <div className="flex gap-2 mb-3">
                  <input value={techName} onChange={(e) => setTechName(e.target.value)} placeholder="Name *" className={`${inputClass} flex-1`} />
                  <select value={techCategory} onChange={(e) => setTechCategory(e.target.value)} className={`${inputClass} flex-1`}>
                    <option value="">Select Category</option>
                    {TECH_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button type="button" onClick={addTechnology} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                      {t.name} {t.category && <span className="text-gray-500 ml-1">({t.category})</span>}
                      <button type="button" onClick={() => removeTechnology(i)} className="ml-2 text-gray-500 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Components */}
              <div className="border-t border-white/5 pt-4">
                <h3 className="text-sm font-bold text-white mb-3">Hardware & Components</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <input value={compName} onChange={(e) => setCompName(e.target.value)} placeholder="Component Name *" className={inputClass} />
                  <input value={compSpec} onChange={(e) => setCompSpec(e.target.value)} placeholder="Specification" className={inputClass} />
                  <input type="number" value={compQty} onChange={(e) => setCompQty(parseInt(e.target.value) || 1)} min="1" className={inputClass} />
                  <input value={compRef} onChange={(e) => setCompRef(e.target.value)} placeholder="Inventory Ref" className={inputClass} />
                </div>
                <button type="button" onClick={addComponent} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium mb-3">Add Component</button>
                {components.length > 0 && (
                  <div className="space-y-1">
                    {components.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 text-sm">
                        <span className="text-white flex-1">{c.componentName}</span>
                        {c.specification && <span className="text-gray-400 text-xs">{c.specification}</span>}
                        <span className="text-gray-500">x{c.quantity}</span>
                        {c.inventoryReference && <span className="text-gray-600 text-xs">[{c.inventoryReference}]</span>}
                        <button type="button" onClick={() => removeComponent(i)} className="text-gray-500 hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Resources Tab ───────────────────────────── */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Learning Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <input value={resTitle} onChange={(e) => setResTitle(e.target.value)} placeholder="Title *" className={`${inputClass} col-span-2`} />
                  <select value={resType} onChange={(e) => setResType(e.target.value)} className={inputClass}>
                    {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <button type="button" onClick={addLearningResource} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <input value={resUrl} onChange={(e) => setResUrl(e.target.value)} placeholder="URL *" className={inputClass} />
                  <input value={resDesc} onChange={(e) => setResDesc(e.target.value)} placeholder="Description (optional)" className={inputClass} />
                </div>
                {learningResources.length > 0 && (
                  <div className="space-y-1">
                    {learningResources.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 text-sm">
                        <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold uppercase text-gray-400">{r.type}</span>
                        <span className="text-white flex-1">{r.title}</span>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">Link</a>
                        <button type="button" onClick={() => removeLearningResource(i)} className="text-gray-500 hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── SEO Tab ─────────────────────────────────── */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div><label className={labelClass}>Meta Title</label><input {...register('seoTitle')} placeholder="SEO title (max 70 chars)" maxLength={70} className={inputClass} /></div>
              <div><label className={labelClass}>Meta Description</label><textarea {...register('seoDescription')} rows={3} placeholder="SEO description (max 160 chars)" maxLength={160} className={`${inputClass} resize-none`} /></div>
              <div><label className={labelClass}>Keywords (comma-separated)</label><input {...register('seoKeywords')} placeholder="robotics, DRC, automation" className={inputClass} /></div>
            </div>
          )}

          {/* ─── Form Actions ────────────────────────────── */}
          <div className="flex gap-2 pt-4 border-t border-white/5">
            <button type="submit" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
              {editingId ? 'Update Focus Area' : 'Create Focus Area'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}
                className="px-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Focus Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areas.map((area) => (
          <div key={area._id as string} className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all relative">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => handleEdit(area)} className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Edit</button>
              <button onClick={() => handleDelete(area._id as string)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Del</button>
            </div>
            {!!(area.homepage as Record<string, unknown>)?.featured && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white text-xs rounded-full">Featured</div>
            )}
              <div className="flex p-4 gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#121212] rounded-lg flex-shrink-0">
                <FocusAreaIcon
                  icon={(area.icon as string) || 'Bot'}
                  iconType={(area.iconType as 'lucide' | 'image') || 'lucide'}
                  color={(area.color as string) || '#e63946'}
                  className="text-4xl"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{area.title as string}</h3>
                <p className="text-xs text-gray-500">{area.category as string}</p>
                <p className="text-sm text-gray-400 mb-2 line-clamp-1">{(area.shortDescription as string) || (area.description as string)}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600">Order: {(area.order as number) || 0}</span>
                  {area.isActive ? (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-wider rounded-full">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-wider rounded-full">Inactive</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {areas.length === 0 && (
        <div className="text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <p className="text-gray-500">No focus areas yet. Add your first focus area above.</p>
        </div>
      )}
    </div>
  );
}
