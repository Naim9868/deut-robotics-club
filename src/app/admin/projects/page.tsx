'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { CodeBracketIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface TeamMemberForm {
  fullName: string;
  designation: string;
  department: string;
  session: string;
  studentId: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  roleInProject: string;
  isLeader: boolean;
}

interface TechForm {
  name: string;
  icon: string;
  category: string;
}

interface ComponentForm {
  componentName: string;
  quantity: number;
  specification: string;
}

interface ProjectForm {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  summary: string;
  tag: string;
  coverImage: { url: string; alt: string; publicId?: string };
  galleryImages: { url: string; alt: string; publicId?: string }[];
  youtubeVideo: string;
  category: string;
  subCategory: string;
  projectType: string;
  difficulty: string;
  status: string;
  visibility: string;
  latency: string;
  image: { url: string; alt: string; publicId?: string };
  github: string;
  demo: string;
  featured: boolean;
  showOnHomepage: boolean;
  displayOrder: number;
  order: number;
  isActive: boolean;
  facultyAdvisor: string;
  facultyCoAdvisor: string;
  facultyMentor: string;
  docGithub: string;
  docLiveDemo: string;
  docDocumentation: string;
  docResearchPaper: string;
  docPresentation: string;
  docReport: string;
  docYoutubeVideo: string;
  compName: string;
  compOrganizer: string;
  compAward: string;
  compPosition: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const categoryColors: Record<string, string> = {
  COMBAT: 'text-red-500 border-red-500',
  AI: 'text-blue-500 border-blue-500',
  AERO: 'text-purple-500 border-purple-500',
  AUTO: 'text-green-500 border-green-500',
  OTHER: 'text-muted border-gray-500',
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/10 text-muted border-gray-500/20',
  submitted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  under_review: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  ongoing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  archived: 'bg-gray-500/10 text-muted border-gray-500/20',
  ACTIVE: 'bg-green-500/10 text-green-500 border-green-500/20',
  TESTING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [useImageLink, setUseImageLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'team' | 'tech' | 'docs' | 'seo'>('basic');

  // Array states
  const [teamMembers, setTeamMembers] = useState<TeamMemberForm[]>([]);
  const [technologies, setTechnologies] = useState<TechForm[]>([]);
  const [components, setComponents] = useState<ComponentForm[]>([]);
  const [galleryImages, setGalleryImages] = useState<{ url: string; alt: string }[]>([]);

  // Team form inputs
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamLeader, setTeamLeader] = useState(false);

  // Tech form inputs
  const [techName, setTechName] = useState('');
  const [techCategory, setTechCategory] = useState('');

  // Component form inputs
  const [compName, setCompName] = useState('');
  const [compQty, setCompQty] = useState(1);
  const [compSpec, setCompSpec] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProjectForm>({
    defaultValues: {
      id: '', title: '', slug: '', shortDescription: '', fullDescription: '', summary: '', tag: '',
      coverImage: { url: '', alt: '' }, galleryImages: [], youtubeVideo: '',
      category: 'COMBAT', subCategory: '', projectType: 'team', difficulty: 'intermediate',
      status: 'draft', visibility: 'public', latency: '0.00ms',
      image: { url: '', alt: '' }, github: '', demo: '',
      featured: false, showOnHomepage: false, displayOrder: 0, order: 0, isActive: true,
      facultyAdvisor: '', facultyCoAdvisor: '', facultyMentor: '',
      docGithub: '', docLiveDemo: '', docDocumentation: '', docResearchPaper: '',
      docPresentation: '', docReport: '', docYoutubeVideo: '',
      compName: '', compOrganizer: '', compAward: '', compPosition: '',
      seoTitle: '', seoDescription: '', seoKeywords: '',
    }
  });

  const getProjectImage = (title: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(title || 'Project')}&background=1e1e1e&color=e63946&size=200&bold=true&length=2`;

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?limit=100');
      const data = await res.json();
      setProjects(data.projects || data);
    } catch { toast.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  const handleImageUpload = (url: string, publicId?: string) => {
    setValue('coverImage', { url, alt: watch('title') || 'Project image', publicId });
    setCurrentImageUrl(url);
    setUseImageLink(false);
  };

  const addTeamMember = () => {
    if (!teamName.trim()) return;
    setTeamMembers([...teamMembers, {
      fullName: teamName.trim(), designation: '', department: '', session: '',
      studentId: '', email: '', phone: '', github: '', linkedin: '',
      roleInProject: teamRole.trim(), isLeader: teamLeader,
    }]);
    setTeamName(''); setTeamRole(''); setTeamLeader(false);
  };

  const removeTeamMember = (i: number) => setTeamMembers(teamMembers.filter((_, idx) => idx !== i));

  const addTechnology = () => {
    if (!techName.trim()) return;
    setTechnologies([...technologies, { name: techName.trim(), icon: '', category: techCategory.trim() }]);
    setTechName(''); setTechCategory('');
  };

  const removeTechnology = (i: number) => setTechnologies(technologies.filter((_, idx) => idx !== i));

  const addComponent = () => {
    if (!compName.trim()) return;
    setComponents([...components, { componentName: compName.trim(), quantity: compQty, specification: compSpec.trim() }]);
    setCompName(''); setCompQty(1); setCompSpec('');
  };

  const removeComponent = (i: number) => setComponents(components.filter((_, idx) => idx !== i));

  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, { url: '', alt: '' }]);
  };

  const updateGalleryImage = (i: number, field: 'url' | 'alt', value: string) => {
    const updated = [...galleryImages];
    updated[i] = { ...updated[i], [field]: value };
    setGalleryImages(updated);
  };

  const removeGalleryImage = (i: number) => setGalleryImages(galleryImages.filter((_, idx) => idx !== i));

  const onSubmit = async (data: ProjectForm) => {
    try {
      if (!data.title || !data.tag || !data.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      const payload = {
        title: data.title,
        slug: data.slug || undefined,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        summary: data.summary,
        tag: data.tag,
        coverImage: data.coverImage?.url ? data.coverImage : { url: getProjectImage(data.title), alt: data.title },
        galleryImages,
        youtubeVideo: data.youtubeVideo,
        category: data.category,
        subCategory: data.subCategory,
        projectType: data.projectType,
        difficulty: data.difficulty,
        status: data.status,
        visibility: data.visibility,
        latency: data.latency,
        image: data.coverImage?.url ? data.coverImage : { url: getProjectImage(data.title), alt: data.title },
        github: data.github,
        demo: data.demo,
        team: teamMembers,
        technologies,
        components,
        faculty: { advisor: data.facultyAdvisor, coAdvisor: data.facultyCoAdvisor, mentor: data.facultyMentor },
        documentation: {
          github: data.docGithub, liveDemo: data.docLiveDemo, documentation: data.docDocumentation,
          researchPaper: data.docResearchPaper, presentation: data.docPresentation,
          report: data.docReport, youtubeVideo: data.docYoutubeVideo,
        },
        competition: { competitionName: data.compName, organizer: data.compOrganizer, award: data.compAward, position: data.compPosition },
        homepage: { featured: data.featured, showOnHomepage: data.showOnHomepage, displayOrder: data.displayOrder },
        seo: { metaTitle: data.seoTitle, metaDescription: data.seoDescription, keywords: data.seoKeywords.split(',').map(k => k.trim()).filter(Boolean) },
        order: data.displayOrder || data.order,
        isActive: data.isActive,
        id: data.id,
      };

      const url = editingId ? `/api/admin/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Project updated' : 'Project created');
        reset(); setTeamMembers([]); setTechnologies([]); setComponents([]); setGalleryImages([]);
        setEditingId(null); setCurrentImageUrl(''); setUseImageLink(false); setActiveTab('basic');
        fetchProjects();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save');
      }
    } catch { toast.error('Failed to save'); }
  };

  const handleEdit = (project: Record<string, unknown>) => {
    setEditingId(project._id as string);
    const coverImage = project.coverImage as { url?: string; alt?: string } | undefined;
    const image = project.image as { url?: string; alt?: string } | undefined;
    setCurrentImageUrl(coverImage?.url || image?.url || '');

    const team = (project.team as TeamMemberForm[]) || [];
    const tech = (project.technologies as TechForm[]) || [];
    const comps = (project.components as ComponentForm[]) || [];
    const gallery = (project.galleryImages as { url: string; alt: string }[]) || [];
    const faculty = (project.faculty as Record<string, string>) || {};
    const docs = (project.documentation as Record<string, string>) || {};
    const comp = (project.competition as Record<string, string>) || {};
    const hp = (project.homepage as Record<string, unknown>) || {};
    const seo = (project.seo as Record<string, unknown>) || {};

    setTeamMembers(team);
    setTechnologies(tech);
    setComponents(comps);
    setGalleryImages(gallery);

    reset({
      id: (project.id as string) || '',
      title: (project.title as string) || '',
      slug: (project.slug as string) || '',
      shortDescription: (project.shortDescription as string) || '',
      fullDescription: (project.fullDescription as string) || '',
      summary: (project.summary as string) || '',
      tag: (project.tag as string) || '',
      coverImage: coverImage || { url: '', alt: '' },
      youtubeVideo: (project.youtubeVideo as string) || '',
      category: (project.category as string) || 'COMBAT',
      subCategory: (project.subCategory as string) || '',
      projectType: (project.projectType as string) || 'team',
      difficulty: (project.difficulty as string) || 'intermediate',
      status: (project.status as string) || 'draft',
      visibility: (project.visibility as string) || 'public',
      latency: (project.latency as string) || '0.00ms',
      image: image || { url: '', alt: '' },
      github: (project.github as string) || '',
      demo: (project.demo as string) || '',
      featured: (project.featured as boolean) || false,
      showOnHomepage: (hp.showOnHomepage as boolean) || false,
      displayOrder: (hp.displayOrder as number) || 0,
      order: (project.order as number) || 0,
      isActive: (project.isActive as boolean) ?? true,
      facultyAdvisor: faculty.advisor || '',
      facultyCoAdvisor: faculty.coAdvisor || '',
      facultyMentor: faculty.mentor || '',
      docGithub: docs.github || '',
      docLiveDemo: docs.liveDemo || '',
      docDocumentation: docs.documentation || '',
      docResearchPaper: docs.researchPaper || '',
      docPresentation: docs.presentation || '',
      docReport: docs.report || '',
      docYoutubeVideo: docs.youtubeVideo || '',
      compName: comp.competitionName || '',
      compOrganizer: comp.organizer || '',
      compAward: comp.award || '',
      compPosition: comp.position || '',
      seoTitle: (seo.metaTitle as string) || '',
      seoDescription: (seo.metaDescription as string) || '',
      seoKeywords: ((seo.keywords as string[]) || []).join(', '),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Project deleted'); fetchProjects(); }
      else { const data = await res.json(); toast.error(data.error || 'Failed to delete'); }
    } catch { toast.error('Failed to delete'); }
  };

  const moveProject = async (id: string, direction: 'up' | 'down') => {
    const index = projects.findIndex(p => p._id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === projects.length - 1)) return;
    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[index + (direction === 'up' ? -1 : 1)];
    newProjects[index + (direction === 'up' ? -1 : 1)] = temp;
    const updates = newProjects.map((item, idx) => ({ updateOne: { filter: { _id: item._id }, update: { $set: { order: idx } } } }));
    try {
      await fetch('/api/projects/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates }) });
      setProjects(newProjects); toast.success('Order updated');
    } catch { toast.error('Failed to update order'); }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" /></div>;
  }

  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'media', label: 'Media' },
    { key: 'team', label: `Team (${teamMembers.length})` },
    { key: 'tech', label: `Tech (${technologies.length})` },
    { key: 'docs', label: 'Docs & Links' },
    { key: 'seo', label: 'SEO' },
  ] as const;

  const inputClass = 'w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary';
  const labelClass = 'block text-xs font-black text-muted uppercase mb-2';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-4xl font-black text-foreground">Projects</h1>
        <p className="text-muted text-sm">{projects.length} projects</p>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">{editingId ? 'Edit Project' : 'Add New Project'}</h2>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-bold rounded transition-colors whitespace-nowrap ${activeTab === tab.key ? 'bg-background/10 text-foreground' : 'bg-background/5 text-muted hover:text-muted'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                  <input {...register('title', { required: 'Required' })} placeholder="Project Title" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Tag <span className="text-red-500">*</span></label>
                  <input {...register('tag', { required: 'Required' })} placeholder="COMBAT CLASS" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Short Description</label>
                <input {...register('shortDescription')} placeholder="Brief project summary" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Full Description</label>
                <textarea {...register('fullDescription')} rows={6} placeholder="Detailed project description..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Summary</label>
                <textarea {...register('summary')} rows={3} placeholder="Project summary..." className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select {...register('category', { required: 'Required' })} className={inputClass}>
                    <option value="COMBAT">COMBAT</option><option value="AI">AI</option>
                    <option value="AERO">AERO</option><option value="AUTO">AUTO</option><option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Project Type</label>
                  <select {...register('projectType')} className={inputClass}>
                    <option value="team">Team</option><option value="individual">Individual</option><option value="club">Club</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Difficulty</label>
                  <select {...register('difficulty')} className={inputClass}>
                    <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option><option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select {...register('status')} className={inputClass}>
                    <option value="draft">Draft</option><option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option><option value="approved">Approved</option>
                    <option value="ongoing">Ongoing</option><option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Sub Category</label>
                  <input {...register('subCategory')} placeholder="e.g., Line Follower" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Visibility</label>
                  <select {...register('visibility')} className={inputClass}>
                    <option value="public">Public</option><option value="members">Members Only</option><option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Latency</label>
                  <input {...register('latency')} placeholder="0.00ms" className={inputClass} />
                </div>
              </div>
              {/* Faculty */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-4">
                <div><label className={labelClass}>Faculty Advisor</label><input {...register('facultyAdvisor')} placeholder="Prof. Name" className={inputClass} /></div>
                <div><label className={labelClass}>Co-Advisor</label><input {...register('facultyCoAdvisor')} placeholder="Prof. Name" className={inputClass} /></div>
                <div><label className={labelClass}>Mentor</label><input {...register('facultyMentor')} placeholder="Prof. Name" className={inputClass} /></div>
              </div>
              {/* Toggles */}
              <div className="flex items-center gap-6 border-t border-border pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('showOnHomepage')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted">Show on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted">Active</span>
                </label>
                <div><label className={labelClass}>Display Order</label><input type="number" {...register('displayOrder')} min="0" className={`${inputClass} w-24`} /></div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-muted uppercase">Cover Image</label>
                  <button type="button" onClick={() => setUseImageLink(!useImageLink)} className="text-xs text-primary hover:underline">
                    {useImageLink ? 'Use Upload' : 'Use Link'}
                  </button>
                </div>
                {useImageLink ? (
                  <input type="url" placeholder="https://example.com/image.jpg" onChange={(e) => { setValue('coverImage', { url: e.target.value, alt: watch('title') }); setCurrentImageUrl(e.target.value); }}
                    value={currentImageUrl} className={inputClass} />
                ) : (
                  <ImageUpload onUpload={handleImageUpload} defaultValue={currentImageUrl} folder="projects" />
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>Gallery Images</label>
                  <button type="button" onClick={addGalleryImage} className="text-xs text-primary hover:underline">+ Add Image</button>
                </div>
                {galleryImages.map((img, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={img.url} onChange={(e) => updateGalleryImage(i, 'url', e.target.value)} placeholder="Image URL" className={`${inputClass} flex-1`} />
                    <input value={img.alt} onChange={(e) => updateGalleryImage(i, 'alt', e.target.value)} placeholder="Alt text" className={`${inputClass} flex-1`} />
                    <button type="button" onClick={() => removeGalleryImage(i)} className="px-3 text-red-500 hover:text-red-400">×</button>
                  </div>
                ))}
              </div>
              <div><label className={labelClass}>YouTube Video URL</label><input {...register('youtubeVideo')} placeholder="https://youtube.com/watch?v=..." className={inputClass} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>GitHub URL</label><input {...register('github')} placeholder="https://github.com/..." className={inputClass} /></div>
                <div><label className={labelClass}>Demo URL</label><input {...register('demo')} placeholder="https://demo.com/..." className={inputClass} /></div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="bg-background/5 border border-border rounded-lg p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Add Team Member</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Full Name *" className={inputClass} />
                  <input value={teamRole} onChange={(e) => setTeamRole(e.target.value)} placeholder="Role in Project" className={inputClass} />
                  <label className="flex items-center gap-2 cursor-pointer px-4">
                    <input type="checkbox" checked={teamLeader} onChange={(e) => setTeamLeader(e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-sm text-muted">Leader</span>
                  </label>
                  <button type="button" onClick={addTeamMember} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
              </div>
              {teamMembers.length > 0 && (
                <div className="space-y-2">
                  {teamMembers.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 bg-background/5 rounded-lg px-4 py-2">
                      <span className="text-foreground text-sm font-medium flex-1">{m.fullName}</span>
                      {m.roleInProject && <span className="text-muted text-xs">{m.roleInProject}</span>}
                      {m.isLeader && <span className="text-red-500 text-xs font-bold">Leader</span>}
                      <button type="button" onClick={() => removeTeamMember(i)} className="text-muted hover:text-red-500">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tech Tab */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              {/* Technologies */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Technologies</h3>
                <div className="flex gap-2 mb-3">
                  <input value={techName} onChange={(e) => setTechName(e.target.value)} placeholder="Name *" className={`${inputClass} flex-1`} />
                  <input value={techCategory} onChange={(e) => setTechCategory(e.target.value)} placeholder="Category (e.g., Language)" className={`${inputClass} flex-1`} />
                  <button type="button" onClick={addTechnology} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 bg-background/5 rounded-full text-xs text-muted">
                      {t.name} {t.category && <span className="text-muted ml-1">({t.category})</span>}
                      <button type="button" onClick={() => removeTechnology(i)} className="ml-2 text-muted hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Components */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Components Used</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <input value={compName} onChange={(e) => setCompName(e.target.value)} placeholder="Component Name *" className={inputClass} />
                  <input type="number" value={compQty} onChange={(e) => setCompQty(parseInt(e.target.value) || 1)} min="1" className={inputClass} />
                  <input value={compSpec} onChange={(e) => setCompSpec(e.target.value)} placeholder="Specification" className={inputClass} />
                </div>
                <button type="button" onClick={addComponent} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium mb-3">Add Component</button>
                {components.length > 0 && (
                  <div className="space-y-1">
                    {components.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 bg-background/5 rounded-lg px-4 py-2 text-sm">
                        <span className="text-foreground flex-1">{c.componentName}</span>
                        <span className="text-muted">x{c.quantity}</span>
                        {c.specification && <span className="text-muted text-xs">{c.specification}</span>}
                        <button type="button" onClick={() => removeComponent(i)} className="text-muted hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Docs Tab */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Documentation Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>GitHub Repository</label><input {...register('docGithub')} placeholder="https://github.com/..." className={inputClass} /></div>
                <div><label className={labelClass}>Live Demo</label><input {...register('docLiveDemo')} placeholder="https://..." className={inputClass} /></div>
                <div><label className={labelClass}>Documentation</label><input {...register('docDocumentation')} placeholder="https://..." className={inputClass} /></div>
                <div><label className={labelClass}>Research Paper</label><input {...register('docResearchPaper')} placeholder="https://..." className={inputClass} /></div>
                <div><label className={labelClass}>Presentation</label><input {...register('docPresentation')} placeholder="https://..." className={inputClass} /></div>
                <div><label className={labelClass}>Report</label><input {...register('docReport')} placeholder="https://..." className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>YouTube Video</label><input {...register('docYoutubeVideo')} placeholder="https://youtube.com/watch?v=..." className={inputClass} /></div>

              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Competition Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Competition Name</label><input {...register('compName')} placeholder="Competition name" className={inputClass} /></div>
                  <div><label className={labelClass}>Organizer</label><input {...register('compOrganizer')} placeholder="Organizer" className={inputClass} /></div>
                  <div><label className={labelClass}>Award</label><input {...register('compAward')} placeholder="Award won" className={inputClass} /></div>
                  <div><label className={labelClass}>Position</label><input {...register('compPosition')} placeholder="1st, 2nd, etc." className={inputClass} /></div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div><label className={labelClass}>Meta Title</label><input {...register('seoTitle')} placeholder="SEO title (max 70 chars)" maxLength={70} className={inputClass} /></div>
              <div><label className={labelClass}>Meta Description</label><textarea {...register('seoDescription')} rows={3} placeholder="SEO description (max 160 chars)" maxLength={160} className={`${inputClass} resize-none`} /></div>
              <div><label className={labelClass}>Keywords (comma-separated)</label><input {...register('seoKeywords')} placeholder="robotics, DRC, automation" className={inputClass} /></div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <button type="submit" className="px-6 py-3 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors">
              {editingId ? 'Update Project' : 'Create Project'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); reset(); setTeamMembers([]); setTechnologies([]); setComponents([]); setGalleryImages([]); setCurrentImageUrl(''); setUseImageLink(false); setActiveTab('basic'); }}
                className="px-6 py-3 border border-border text-muted rounded-lg hover:bg-background/5 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div key={project._id as string} className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 transition-all relative">
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {index > 0 && <button onClick={() => moveProject(project._id as string, 'up')} className="p-1 bg-black/70 hover:bg-black rounded text-foreground"><ArrowUpIcon className="w-4 h-4" /></button>}
              {index < projects.length - 1 && <button onClick={() => moveProject(project._id as string, 'down')} className="p-1 bg-black/70 hover:bg-black rounded text-foreground"><ArrowDownIcon className="w-4 h-4" /></button>}
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => handleEdit(project)} className="px-2 py-1 bg-blue-600 text-foreground text-xs rounded hover:bg-blue-700">Edit</button>
              <button onClick={() => handleDelete(project._id as string)} className="px-2 py-1 bg-red-600 text-foreground text-xs rounded hover:bg-red-700">Del</button>
            </div>
            {(project.featured as boolean) && <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-foreground text-xs rounded-full">Featured</div>}
            <div className="flex p-4 gap-4">
              <div className="w-24 h-24 flex-shrink-0 bg-input-bg rounded-lg overflow-hidden">
                <img src={(project.coverImage as { url?: string })?.url || (project.image as { url?: string })?.url || getProjectImage(project.title as string)} alt={project.title as string} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground truncate">{project.title as string}</h3>
                <p className="text-xs text-muted">{project.id as string}</p>
                <p className="text-sm text-muted mb-2">{project.tag as string}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${statusColors[(project.status as string) || 'draft'] || statusColors.draft}`}>{project.status as string}</span>
                <span className={`inline-block ml-2 px-2 py-1 rounded text-xs font-medium border ${categoryColors[(project.category as string) || 'COMBAT'] || categoryColors.COMBAT}`}>{project.category as string}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <p className="text-muted">No projects yet. Add your first project above.</p>
        </div>
      )}
    </div>
  );
}
