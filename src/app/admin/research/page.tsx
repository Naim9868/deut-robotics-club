'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import FocusAreaIcon from '@/components/FocusAreaIcon';
import { LUCIDE_CATEGORIES } from '@/components/FocusAreaIcon';

// ─── Types ────────────────────────────────────────────────────

interface ResearcherForm {
  fullName: string;
  designation: string;
  department: string;
  session: string;
  studentId: string;
  roll: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  orcid: string;
  googleScholar: string;
  researchGate: string;
  role: string;
  profilePhoto: { url: string; alt: string };
}

interface FacultyForm {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  profilePhoto: { url: string; alt: string };
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

interface PublicationForm {
  title: string;
  authors: string;
  journal: string;
  conference: string;
  publisher: string;
  volume: string;
  issue: string;
  pages: string;
  year: number | undefined;
  doi: string;
  url: string;
  citationCount: number;
  type: string;
}

interface DatasetForm {
  datasetName: string;
  datasetSource: string;
  datasetURL: string;
}

interface AwardForm {
  awardName: string;
  organizer: string;
  year: number | undefined;
  certificate: string;
}

interface ResearchForm {
  title: string;
  slug: string;
  shortDescription: string;
  abstract: string;
  fullDescription: string;
  summary: string;
  keywords: string;
  researchCode: string;
  coverImage: { url: string; alt: string; publicId?: string };
  youtubePresentation: string;
  researchArea: string;
  category: string;
  subCategory: string;
  researchType: string;
  researchLevel: string;
  difficulty: string;
  status: string;
  visibility: string;
  createdBy: string;
  createdByType: string;
  startDate: string;
  expectedCompletion: string;
  funded: boolean;
  fundingAgency: string;
  grantNumber: string;
  projectBudget: string;
  docGithubRepo: string;
  docGitlabRepo: string;
  docResearchPaper: string;
  docPresentation: string;
  docPoster: string;
  docReport: string;
  docDataset: string;
  docDocumentation: string;
  docLiveDemo: string;
  docYoutubePresentation: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  featured: boolean;
  showOnHomepage: boolean;
  displayOrder: number;
  isActive: boolean;
}

// ─── Constants ────────────────────────────────────────────────

const researchAreas = [
  'Robotics', 'Artificial Intelligence', 'Machine Learning',
  'Computer Vision', 'IoT', 'Embedded Systems', 'Automation',
  'Drone', 'Biomedical', 'Control Systems', 'Power Electronics',
  'Mechanical Design', 'Other',
];

const statusOptions = [
  { value: 'proposed', label: 'Proposed' },
  { value: 'literature_review', label: 'Literature Review' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'experimentation', label: 'Experimentation' },
  { value: 'paper_writing', label: 'Paper Writing' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'published', label: 'Published' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const statusColors: Record<string, string> = {
  proposed: 'bg-yellow-500/10 text-yellow-500',
  literature_review: 'bg-blue-500/10 text-blue-500',
  ongoing: 'bg-green-500/10 text-green-500',
  experimentation: 'bg-purple-500/10 text-purple-500',
  paper_writing: 'bg-orange-500/10 text-orange-500',
  submitted: 'bg-cyan-500/10 text-cyan-500',
  accepted: 'bg-emerald-500/10 text-emerald-500',
  published: 'bg-primary/10 text-primary',
  completed: 'bg-green-500/10 text-green-500',
  archived: 'bg-gray-500/10 text-muted',
};

const researcherRoles = ['Principal Investigator', 'Co-Investigator', 'Research Assistant', 'Supervisor', 'Student Researcher'];
const facultyRoles = ['Supervisor', 'Co-Supervisor', 'Advisor', 'Mentor'];
const techCategories = ['Programming', 'Framework', 'Simulation', 'Microcontroller', 'AI Framework', 'Software', 'Database', 'Cloud'];
const pubTypes = ['journal_paper', 'conference_paper', 'book', 'book_chapter', 'technical_report', 'patent', 'prototype', 'software', 'dataset'];

// ─── Component ────────────────────────────────────────────────

export default function ResearchPage() {
  const [researchList, setResearchList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'team' | 'tech' | 'research' | 'docs' | 'seo'>('basic');

  // Array states
  const [researchers, setResearchers] = useState<ResearcherForm[]>([]);
  const [faculty, setFaculty] = useState<FacultyForm[]>([]);
  const [technologies, setTechnologies] = useState<TechForm[]>([]);
  const [components, setComponents] = useState<ComponentForm[]>([]);
  const [publications, setPublications] = useState<PublicationForm[]>([]);
  const [datasets, setDatasets] = useState<DatasetForm[]>([]);
  const [awards, setAwards] = useState<AwardForm[]>([]);
  const [galleryImages, setGalleryImages] = useState<{ url: string; alt: string }[]>([]);

  // Image link/upload toggle
  const [useImageLink, setUseImageLink] = useState(false);
  const [imageTarget, setImageTarget] = useState<'cover' | 'gallery'>('cover');
  const [galleryLinkUrl, setGalleryLinkUrl] = useState('');

  // Icon picker
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconPickerSearch, setIconPickerSearch] = useState('');
  const [techIconTarget, setTechIconTarget] = useState<number | null>(null);
  const [pendingTechIcon, setPendingTechIcon] = useState('');

  // Inline form inputs
  const [researcherName, setResearcherName] = useState('');
  const [researcherRole, setResearcherRole] = useState('Student Researcher');
  const [researcherDesig, setResearcherDesig] = useState('');
  const [researcherDept, setResearcherDept] = useState('');
  const [researcherSession, setResearcherSession] = useState('');
  const [researcherStudentId, setResearcherStudentId] = useState('');
  const [researcherRoll, setResearcherRoll] = useState('');
  const [researcherEmail, setResearcherEmail] = useState('');
  const [researcherPhone, setResearcherPhone] = useState('');
  const [researcherLinkedin, setResearcherLinkedin] = useState('');
  const [researcherGithub, setResearcherGithub] = useState('');
  const [researcherOrcid, setResearcherOrcid] = useState('');
  const [researcherScholar, setResearcherScholar] = useState('');
  const [researcherResearchGate, setResearcherResearchGate] = useState('');
  const [researcherPhotoUrl, setResearcherPhotoUrl] = useState('');
  const [researcherPhotoAlt, setResearcherPhotoAlt] = useState('');
  const [showResearcherMore, setShowResearcherMore] = useState(false);

  const [facultyName, setFacultyName] = useState('');
  const [facultyRole, setFacultyRole] = useState('Supervisor');
  const [facultyDept, setFacultyDept] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');
  const [facultyPhotoUrl, setFacultyPhotoUrl] = useState('');
  const [facultyPhotoAlt, setFacultyPhotoAlt] = useState('');
  const [showFacultyMore, setShowFacultyMore] = useState(false);
  const [techName, setTechName] = useState('');
  const [techCategory, setTechCategory] = useState('');
  const [compName, setCompName] = useState('');
  const [compQty, setCompQty] = useState(1);
  const [compSpec, setCompSpec] = useState('');
  const [pubTitle, setPubTitle] = useState('');
  const [pubAuthors, setPubAuthors] = useState('');
  const [pubJournal, setPubJournal] = useState('');
  const [pubPublisher, setPubPublisher] = useState('');
  const [pubVolume, setPubVolume] = useState('');
  const [pubIssue, setPubIssue] = useState('');
  const [pubPages, setPubPages] = useState('');
  const [pubYear, setPubYear] = useState<number | undefined>(undefined);
  const [pubDoi, setPubDoi] = useState('');
  const [pubUrl, setPubUrl] = useState('');
  const [pubType, setPubType] = useState('journal_paper');
  const [datasetName, setDatasetName] = useState('');
  const [datasetSource, setDatasetSource] = useState('');
  const [datasetURL, setDatasetURL] = useState('');
  const [awardName, setAwardName] = useState('');
  const [awardOrganizer, setAwardOrganizer] = useState('');
  const [awardYear, setAwardYear] = useState<number | undefined>(undefined);
  const [awardCert, setAwardCert] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ResearchForm>({
    defaultValues: {
      title: '', slug: '', shortDescription: '', abstract: '', fullDescription: '', summary: '',
      keywords: '', researchCode: '',
      coverImage: { url: '', alt: '' }, youtubePresentation: '',
      researchArea: 'Robotics', category: '', subCategory: '',
      researchType: 'experimental', researchLevel: 'Undergraduate', difficulty: 'Intermediate',
      status: 'ongoing', visibility: 'public', createdBy: '', createdByType: 'admin',
      startDate: '', expectedCompletion: '',
      funded: false, fundingAgency: '', grantNumber: '', projectBudget: '',
      docGithubRepo: '', docGitlabRepo: '', docResearchPaper: '', docPresentation: '',
      docPoster: '', docReport: '', docDataset: '', docDocumentation: '', docLiveDemo: '', docYoutubePresentation: '',
      seoTitle: '', seoDescription: '', seoKeywords: '',
      featured: false, showOnHomepage: false, displayOrder: 0, isActive: true,
    }
  });

  useEffect(() => { fetchResearch(); }, []);

  const fetchResearch = async () => {
    try {
      const res = await fetch('/api/research?limit=100');
      const data = await res.json();
      setResearchList(data.research || data);
    } catch { toast.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  const handleImageUpload = (url: string, publicId?: string) => {
    if (imageTarget === 'cover') {
      setValue('coverImage', { url, alt: watch('title') || 'Research image', publicId });
      setCurrentImageUrl(url);
    } else if (imageTarget === 'gallery') {
      const newImages = [...galleryImages, { url, alt: '' }];
      setGalleryImages(newImages);
    }
    setUseImageLink(false);
  };

  // ─── Array helpers ──────────────────────────────────────────

  const addResearcher = () => {
    if (!researcherName.trim()) return;
    setResearchers([...researchers, {
      fullName: researcherName.trim(), designation: researcherDesig.trim(), department: researcherDept.trim(),
      session: researcherSession.trim(), studentId: researcherStudentId.trim(), roll: researcherRoll.trim(),
      email: researcherEmail.trim(), phone: researcherPhone.trim(),
      linkedin: researcherLinkedin.trim(), github: researcherGithub.trim(),
      orcid: researcherOrcid.trim(), googleScholar: researcherScholar.trim(),
      researchGate: researcherResearchGate.trim(), role: researcherRole,
      profilePhoto: { url: researcherPhotoUrl.trim(), alt: researcherPhotoAlt.trim() },
    }]);
    setResearcherName(''); setResearcherRole('Student Researcher');
    setResearcherDesig(''); setResearcherDept(''); setResearcherSession('');
    setResearcherStudentId(''); setResearcherRoll(''); setResearcherEmail('');
    setResearcherPhone(''); setResearcherLinkedin(''); setResearcherGithub('');
    setResearcherOrcid(''); setResearcherScholar(''); setResearcherResearchGate('');
    setResearcherPhotoUrl(''); setResearcherPhotoAlt('');
  };

  const removeResearcher = (i: number) => setResearchers(researchers.filter((_, idx) => idx !== i));

  const addFaculty = () => {
    if (!facultyName.trim()) return;
    setFaculty([...faculty, {
      name: facultyName.trim(), role: facultyRole, department: facultyDept.trim(),
      email: facultyEmail.trim(), phone: facultyPhone.trim(),
      profilePhoto: { url: facultyPhotoUrl.trim(), alt: facultyPhotoAlt.trim() },
    }]);
    setFacultyName(''); setFacultyRole('Supervisor'); setFacultyDept('');
    setFacultyEmail(''); setFacultyPhone('');
    setFacultyPhotoUrl(''); setFacultyPhotoAlt('');
  };

  const removeFaculty = (i: number) => setFaculty(faculty.filter((_, idx) => idx !== i));

  const addTechnology = () => {
    if (!techName.trim()) return;
    setTechnologies([...technologies, { name: techName.trim(), icon: pendingTechIcon, category: techCategory.trim() }]);
    setTechName(''); setTechCategory(''); setPendingTechIcon('');
  };

  const removeTechnology = (i: number) => setTechnologies(technologies.filter((_, idx) => idx !== i));

  const addComponent = () => {
    if (!compName.trim()) return;
    setComponents([...components, { componentName: compName.trim(), quantity: compQty, specification: compSpec.trim() }]);
    setCompName(''); setCompQty(1); setCompSpec('');
  };

  const removeComponent = (i: number) => setComponents(components.filter((_, idx) => idx !== i));

  const addPublication = () => {
    if (!pubTitle.trim()) return;
    setPublications([...publications, {
      title: pubTitle.trim(), authors: pubAuthors.trim(), journal: pubJournal.trim(),
      conference: '', publisher: pubPublisher.trim(), volume: pubVolume.trim(),
      issue: pubIssue.trim(), pages: pubPages.trim(),
      year: pubYear, doi: pubDoi.trim(), url: pubUrl.trim(), citationCount: 0, type: pubType,
    }]);
    setPubTitle(''); setPubAuthors(''); setPubJournal(''); setPubPublisher('');
    setPubVolume(''); setPubIssue(''); setPubPages('');
    setPubYear(undefined); setPubDoi(''); setPubUrl(''); setPubType('journal_paper');
  };

  const removePublication = (i: number) => setPublications(publications.filter((_, idx) => idx !== i));

  const addDataset = () => {
    if (!datasetName.trim()) return;
    setDatasets([...datasets, { datasetName: datasetName.trim(), datasetSource: datasetSource.trim(), datasetURL: datasetURL.trim() }]);
    setDatasetName(''); setDatasetSource(''); setDatasetURL('');
  };

  const removeDataset = (i: number) => setDatasets(datasets.filter((_, idx) => idx !== i));

  const addAward = () => {
    if (!awardName.trim()) return;
    setAwards([...awards, { awardName: awardName.trim(), organizer: awardOrganizer.trim(), year: awardYear, certificate: awardCert.trim() }]);
    setAwardName(''); setAwardOrganizer(''); setAwardYear(undefined); setAwardCert('');
  };

  const removeAward = (i: number) => setAwards(awards.filter((_, idx) => idx !== i));

  // ─── Submit ─────────────────────────────────────────────────

  const onSubmit = async (data: ResearchForm) => {
    try {
      if (!data.title) {
        toast.error('Title is required');
        return;
      }

      const payload = {
        title: data.title,
        slug: data.slug || undefined,
        shortDescription: data.shortDescription,
        abstract: data.abstract,
        fullDescription: data.fullDescription,
        summary: data.summary,
        keywords: data.keywords.split(',').map(k => k.trim()).filter(Boolean),
        researchCode: data.researchCode,
        coverImage: data.coverImage?.url ? data.coverImage : { url: '', alt: data.title },
        galleryImages,
        youtubePresentation: data.youtubePresentation,
        researchArea: data.researchArea,
        category: data.category,
        subCategory: data.subCategory,
        researchType: data.researchType,
        researchLevel: data.researchLevel,
        difficulty: data.difficulty,
        status: data.status,
        visibility: data.visibility,
        createdBy: data.createdBy,
        createdByType: data.createdByType,
        researchers,
        faculty,
        startDate: data.startDate || undefined,
        expectedCompletion: data.expectedCompletion || undefined,
        technologies,
        components,
        datasets,
        publications,
        funding: { funded: data.funded, fundingAgency: data.fundingAgency, grantNumber: data.grantNumber, projectBudget: data.projectBudget },
        awards,
        documentation: {
          githubRepo: data.docGithubRepo, gitlabRepo: data.docGitlabRepo,
          researchPaper: data.docResearchPaper, presentation: data.docPresentation,
          poster: data.docPoster, report: data.docReport,
          dataset: data.docDataset, documentation: data.docDocumentation,
          liveDemo: data.docLiveDemo,
          youtubePresentation: data.docYoutubePresentation,
        },
        seo: { metaTitle: data.seoTitle, metaDescription: data.seoDescription, keywords: data.seoKeywords.split(',').map(k => k.trim()).filter(Boolean) },
        homepage: { featured: data.featured, showOnHomepage: data.showOnHomepage, displayOrder: data.displayOrder },
        isActive: data.isActive,
        order: data.displayOrder,
      };

      const url = editingId ? `/api/admin/research/${editingId}` : '/api/admin/research';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Research updated' : 'Research created');
        reset();
        setResearchers([]); setFaculty([]); setTechnologies([]); setComponents([]);
        setPublications([]); setDatasets([]); setAwards([]); setGalleryImages([]);
        setPubTitle(''); setPubAuthors(''); setPubJournal(''); setPubPublisher('');
        setPubVolume(''); setPubIssue(''); setPubPages(''); setPubYear(undefined);
        setPubDoi(''); setPubUrl(''); setPubType('journal_paper');
        setAwardName(''); setAwardOrganizer(''); setAwardYear(undefined); setAwardCert('');
        setEditingId(null); setCurrentImageUrl(''); setActiveTab('basic');
        fetchResearch();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save');
      }
    } catch { toast.error('Failed to save'); }
  };

  // ─── Edit ───────────────────────────────────────────────────

  const handleEdit = (item: Record<string, unknown>) => {
    setEditingId(item._id as string);
    const coverImage = item.coverImage as { url?: string; alt?: string; publicId?: string } | undefined;
    setCurrentImageUrl(coverImage?.url || '');

    setResearchers((item.researchers as ResearcherForm[]) || []);
    setFaculty((item.faculty as FacultyForm[]) || []);
    setTechnologies((item.technologies as TechForm[]) || []);
    setComponents((item.components as ComponentForm[]) || []);
    setPublications((item.publications as PublicationForm[]) || []);
    setDatasets((item.datasets as DatasetForm[]) || []);
    setAwards((item.awards as AwardForm[]) || []);
    setGalleryImages((item.galleryImages as { url: string; alt: string }[]) || []);

    const funding = (item.funding as Record<string, unknown>) || {};
    const docs = (item.documentation as Record<string, string>) || {};
    const seo = (item.seo as Record<string, unknown>) || {};
    const hp = (item.homepage as Record<string, unknown>) || {};
    const keywords = (item.keywords as string[]) || [];

    reset({
      title: (item.title as string) || '',
      slug: (item.slug as string) || '',
      shortDescription: (item.shortDescription as string) || '',
      abstract: (item.abstract as string) || '',
      fullDescription: (item.fullDescription as string) || '',
      summary: (item.summary as string) || '',
      keywords: keywords.join(', '),
      researchCode: (item.researchCode as string) || '',
      coverImage: coverImage || { url: '', alt: '' },
      youtubePresentation: (item.youtubePresentation as string) || '',
      researchArea: (item.researchArea as string) || 'Robotics',
      category: (item.category as string) || '',
      subCategory: (item.subCategory as string) || '',
      researchType: (item.researchType as string) || 'experimental',
      researchLevel: (item.researchLevel as string) || 'Undergraduate',
      difficulty: (item.difficulty as string) || 'Intermediate',
      status: (item.status as string) || 'ongoing',
      visibility: (item.visibility as string) || 'public',
      createdBy: (item.createdBy as string) || '',
      createdByType: (item.createdByType as string) || 'admin',
      startDate: item.startDate ? new Date(item.startDate as string).toISOString().split('T')[0] : '',
      expectedCompletion: item.expectedCompletion ? new Date(item.expectedCompletion as string).toISOString().split('T')[0] : '',
      funded: (funding.funded as boolean) || false,
      fundingAgency: (funding.fundingAgency as string) || '',
      grantNumber: (funding.grantNumber as string) || '',
      projectBudget: (funding.projectBudget as string) || '',
      docGithubRepo: docs.githubRepo || '',
      docGitlabRepo: docs.gitlabRepo || '',
      docResearchPaper: docs.researchPaper || '',
      docPresentation: docs.presentation || '',
      docPoster: docs.poster || '',
      docReport: docs.report || '',
      docDataset: docs.dataset || '',
      docDocumentation: docs.documentation || '',
      docLiveDemo: docs.liveDemo || '',
      docYoutubePresentation: docs.youtubePresentation || '',
      seoTitle: (seo.metaTitle as string) || '',
      seoDescription: (seo.metaDescription as string) || '',
      seoKeywords: ((seo.keywords as string[]) || []).join(', '),
      featured: (hp.featured as boolean) || false,
      showOnHomepage: (hp.showOnHomepage as boolean) || false,
      displayOrder: (hp.displayOrder as number) || 0,
      isActive: (item.isActive as boolean) ?? true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research?')) return;
    try {
      const res = await fetch(`/api/admin/research/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Research deleted'); fetchResearch(); }
      else { const data = await res.json(); toast.error(data.error || 'Failed to delete'); }
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" /></div>;
  }

  // ─── Tabs ───────────────────────────────────────────────────

  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'media', label: 'Media' },
    { key: 'team', label: `Team (${researchers.length + faculty.length})` },
    { key: 'tech', label: `Tech (${technologies.length + components.length})` },
    { key: 'research', label: `Research (${publications.length + datasets.length + awards.length})` },
    { key: 'docs', label: 'Docs & Links' },
    { key: 'seo', label: 'SEO' },
  ] as const;

  const inputClass = 'w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary';
  const labelClass = 'block text-xs font-black text-muted uppercase mb-2';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-4xl font-black text-foreground">Research</h1>
        <p className="text-muted text-sm">{researchList.length} entries</p>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">{editingId ? 'Edit Research' : 'Add New Research'}</h2>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-bold rounded transition-colors whitespace-nowrap ${activeTab === tab.key ? 'bg-white/10 text-foreground' : 'bg-white/5 text-muted hover:text-muted'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ─── Basic Info Tab ──────────────────────── */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                  <input {...register('title', { required: 'Required' })} placeholder="Research Title" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Research Area</label>
                  <select {...register('researchArea')} className={inputClass}>
                    {researchAreas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <input {...register('category')} placeholder="e.g., SLAM, Swarm" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sub Category</label>
                  <input {...register('subCategory')} placeholder="e.g., Indoor Navigation" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Short Description</label>
                <input {...register('shortDescription')} placeholder="Brief research summary" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Abstract</label>
                <textarea {...register('abstract')} rows={4} placeholder="Research abstract..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Full Description (Rich Text)</label>
                <textarea {...register('fullDescription')} rows={8} placeholder="Detailed research description..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Summary</label>
                <textarea {...register('summary')} rows={3} placeholder="Research summary..." className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Research Type</label>
                  <select {...register('researchType')} className={inputClass}>
                    <option value="experimental">Experimental</option><option value="theoretical">Theoretical</option>
                    <option value="computational">Computational</option><option value="review">Review</option><option value="survey">Survey</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Level</label>
                  <select {...register('researchLevel')} className={inputClass}>
                    <option value="Undergraduate">Undergraduate</option><option value="Graduate">Graduate</option>
                    <option value="Faculty">Faculty</option><option value="Club">Club</option><option value="Collaborative">Collaborative</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Difficulty</label>
                  <select {...register('difficulty')} className={inputClass}>
                    <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select {...register('status')} className={inputClass}>
                    {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Keywords (comma-separated)</label>
                  <input {...register('keywords')} placeholder="robotics, AI, SLAM" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Research Code</label>
                  <input {...register('researchCode')} placeholder="DRC-RES-001" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Visibility</label>
                  <select {...register('visibility')} className={inputClass}>
                    <option value="public">Public</option><option value="members">Members Only</option><option value="private">Private</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Created By</label>
                  <input {...register('createdBy')} placeholder="Creator name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Creator Type</label>
                  <select {...register('createdByType')} className={inputClass}>
                    <option value="admin">Admin</option><option value="member">Member</option><option value="faculty">Faculty</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="date" {...register('startDate')} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expected Completion</label>
                  <input type="date" {...register('expectedCompletion')} className={inputClass} />
                </div>
                <div />
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

          {/* ─── Media Tab ───────────────────────────── */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-muted uppercase">Cover Image</label>
                  <button type="button" onClick={() => { setImageTarget('cover'); setUseImageLink(!useImageLink); }}
                    className="text-xs text-primary hover:underline">
                    {useImageLink && imageTarget === 'cover' ? 'Use Upload' : 'Use Link'}
                  </button>
                </div>
                {useImageLink && imageTarget === 'cover' ? (
                  <input type="url" placeholder="https://example.com/image.jpg"
                    onChange={(e) => {
                      setValue('coverImage', { url: e.target.value, alt: watch('title') || 'Research image' });
                      setCurrentImageUrl(e.target.value);
                    }}
                    value={currentImageUrl} className={inputClass} />
                ) : (
                  <ImageUpload onUpload={handleImageUpload} defaultValue={currentImageUrl} folder="research" />
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>Gallery Images</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setImageTarget('gallery'); setUseImageLink(!useImageLink); }}
                      className="text-xs text-primary hover:underline">
                      {useImageLink && imageTarget === 'gallery' ? 'Use Upload' : 'Use Link'}
                    </button>
                    {!useImageLink && (
                      <button type="button" onClick={() => { setImageTarget('gallery'); }} className="text-xs text-primary hover:underline">+ Add Image</button>
                    )}
                  </div>
                </div>
                {useImageLink && imageTarget === 'gallery' ? (
                  <div className="flex gap-2 mb-2">
                    <input type="url" placeholder="https://example.com/image.jpg" value={galleryLinkUrl}
                      onChange={(e) => setGalleryLinkUrl(e.target.value)} className={`${inputClass} flex-1`} />
                    <button type="button" onClick={() => {
                      if (galleryLinkUrl.trim()) {
                        setGalleryImages([...galleryImages, { url: galleryLinkUrl.trim(), alt: '' }]);
                        setGalleryLinkUrl('');
                      }
                    }}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium whitespace-nowrap">
                      Add
                    </button>
                  </div>
                ) : (
                  !useImageLink && imageTarget === 'gallery' && (
                    <div className="mb-2"><ImageUpload onUpload={handleImageUpload} folder="research/gallery" /></div>
                  )
                )}
                {galleryImages.map((img, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-input-bg">
                      <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                    </div>
                    <input value={img.url} onChange={(e) => {
                      const updated = [...galleryImages]; updated[i] = { ...updated[i], url: e.target.value }; setGalleryImages(updated);
                    }} placeholder="Image URL" className={`${inputClass} flex-1`} />
                    <input value={img.alt} onChange={(e) => {
                      const updated = [...galleryImages]; updated[i] = { ...updated[i], alt: e.target.value }; setGalleryImages(updated);
                    }} placeholder="Alt text" className={`${inputClass} flex-1`} />
                    <button type="button" onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))} className="px-3 text-red-500 hover:text-red-400">×</button>
                  </div>
                ))}
              </div>
              <div>
                <label className={labelClass}>YouTube Presentation URL</label>
                <input {...register('youtubePresentation')} placeholder="https://youtube.com/watch?v=..." className={inputClass} />
              </div>
            </div>
          )}

          {/* ─── Team Tab ────────────────────────────── */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Researchers */}
              <div className="bg-white/5 border border-border rounded-lg p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Add Researcher</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <input value={researcherName} onChange={(e) => setResearcherName(e.target.value)} placeholder="Full Name *" className={inputClass} />
                  <select value={researcherRole} onChange={(e) => setResearcherRole(e.target.value)} className={inputClass}>
                    {researcherRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <input value={researcherDesig} onChange={(e) => setResearcherDesig(e.target.value)} placeholder="Designation" className={inputClass} />
                  <input value={researcherDept} onChange={(e) => setResearcherDept(e.target.value)} placeholder="Department" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <input value={researcherSession} onChange={(e) => setResearcherSession(e.target.value)} placeholder="Session (e.g., 2022-23)" className={inputClass} />
                  <input value={researcherStudentId} onChange={(e) => setResearcherStudentId(e.target.value)} placeholder="Student ID" className={inputClass} />
                  <input value={researcherRoll} onChange={(e) => setResearcherRoll(e.target.value)} placeholder="Roll" className={inputClass} />
                  <input value={researcherEmail} onChange={(e) => setResearcherEmail(e.target.value)} placeholder="Email" type="email" className={inputClass} />
                </div>
                <button type="button" onClick={() => setShowResearcherMore(!showResearcherMore)}
                  className="text-xs text-primary hover:underline mb-3">
                  {showResearcherMore ? '− Less fields' : '+ More fields (phone, links, photo)'}
                </button>
                {showResearcherMore && (
                  <div className="space-y-3 mb-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <input value={researcherPhone} onChange={(e) => setResearcherPhone(e.target.value)} placeholder="Phone" className={inputClass} />
                      <input value={researcherLinkedin} onChange={(e) => setResearcherLinkedin(e.target.value)} placeholder="LinkedIn URL" className={inputClass} />
                      <input value={researcherGithub} onChange={(e) => setResearcherGithub(e.target.value)} placeholder="GitHub URL" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <input value={researcherOrcid} onChange={(e) => setResearcherOrcid(e.target.value)} placeholder="ORCID URL" className={inputClass} />
                      <input value={researcherScholar} onChange={(e) => setResearcherScholar(e.target.value)} placeholder="Google Scholar URL" className={inputClass} />
                      <input value={researcherResearchGate} onChange={(e) => setResearcherResearchGate(e.target.value)} placeholder="ResearchGate URL" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={researcherPhotoUrl} onChange={(e) => setResearcherPhotoUrl(e.target.value)} placeholder="Profile Photo URL" className={inputClass} />
                      <input value={researcherPhotoAlt} onChange={(e) => setResearcherPhotoAlt(e.target.value)} placeholder="Photo Alt Text" className={inputClass} />
                    </div>
                  </div>
                )}
                <button type="button" onClick={addResearcher} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add Researcher</button>
              </div>
              {researchers.length > 0 && (
                <div className="space-y-2">
                  {researchers.map((r, i) => (
                    <div key={i} className="bg-white/5 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.profilePhoto?.url ? (
                          <img src={r.profilePhoto.url} alt={r.profilePhoto.alt || r.fullName} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{r.fullName.charAt(0)}</div>
                        )}
                        <span className="text-foreground text-sm font-medium flex-1">{r.fullName}</span>
                        <span className="text-muted text-xs">{r.role}</span>
                        {r.designation && <span className="text-muted text-xs hidden md:inline">{r.designation}</span>}
                        <button type="button" onClick={() => removeResearcher(i)} className="text-muted hover:text-red-500">×</button>
                      </div>
                      {(r.email || r.phone || r.department || r.session || r.studentId || r.linkedin || r.github || r.orcid || r.googleScholar || r.researchGate) && (
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted">
                          {r.department && <span>{r.department}</span>}
                          {r.session && <span>Session: {r.session}</span>}
                          {r.studentId && <span>ID: {r.studentId}</span>}
                          {r.roll && <span>Roll: {r.roll}</span>}
                          {r.email && <span>{r.email}</span>}
                          {r.phone && <span>{r.phone}</span>}
                          {r.linkedin && <a href={r.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>}
                          {r.github && <a href={r.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>}
                          {r.orcid && <a href={r.orcid} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ORCID</a>}
                          {r.googleScholar && <a href={r.googleScholar} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Scholar</a>}
                          {r.researchGate && <a href={r.researchGate} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ResearchGate</a>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Faculty */}
              <div className="border-t border-border pt-4">
                <div className="bg-white/5 border border-border rounded-lg p-4">
                  <h3 className="text-sm font-bold text-foreground mb-3">Add Faculty</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <input value={facultyName} onChange={(e) => setFacultyName(e.target.value)} placeholder="Faculty Name *" className={inputClass} />
                    <select value={facultyRole} onChange={(e) => setFacultyRole(e.target.value)} className={inputClass}>
                      {facultyRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input value={facultyDept} onChange={(e) => setFacultyDept(e.target.value)} placeholder="Department" className={inputClass} />
                    <input value={facultyEmail} onChange={(e) => setFacultyEmail(e.target.value)} placeholder="Email" type="email" className={inputClass} />
                  </div>
                  <button type="button" onClick={() => setShowFacultyMore(!showFacultyMore)}
                    className="text-xs text-primary hover:underline mb-3">
                    {showFacultyMore ? '− Less fields' : '+ More fields (phone, photo)'}
                  </button>
                  {showFacultyMore && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input value={facultyPhone} onChange={(e) => setFacultyPhone(e.target.value)} placeholder="Phone" className={inputClass} />
                      <input value={facultyPhotoUrl} onChange={(e) => setFacultyPhotoUrl(e.target.value)} placeholder="Profile Photo URL" className={inputClass} />
                    </div>
                  )}
                  <button type="button" onClick={addFaculty} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add Faculty</button>
                </div>
                {faculty.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {faculty.map((f, i) => (
                      <div key={i} className="bg-white/5 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3">
                          {f.profilePhoto?.url ? (
                            <img src={f.profilePhoto.url} alt={f.profilePhoto.alt || f.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{f.name.charAt(0)}</div>
                          )}
                          <span className="text-foreground text-sm font-medium flex-1">{f.name}</span>
                          <span className="text-muted text-xs">{f.role}</span>
                          {f.department && <span className="text-muted text-xs hidden md:inline">{f.department}</span>}
                          <button type="button" onClick={() => removeFaculty(i)} className="text-muted hover:text-red-500">×</button>
                        </div>
                        {(f.email || f.phone) && (
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted">
                            {f.email && <span>{f.email}</span>}
                            {f.phone && <span>{f.phone}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Tech Tab ────────────────────────────── */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              {/* Technologies */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Technologies</h3>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => { setTechIconTarget(-1); setShowIconPicker(true); setIconPickerSearch(''); }}
                    className="px-3 py-2 bg-input-bg border border-border rounded-lg text-foreground hover:bg-primary/20 transition-colors flex-shrink-0" title="Pick icon for new tech">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <input value={techName} onChange={(e) => setTechName(e.target.value)} placeholder="Name *" className={`${inputClass} flex-1`} />
                  <select value={techCategory} onChange={(e) => setTechCategory(e.target.value)} className={`${inputClass} flex-1`}>
                    <option value="">Category</option>
                    {techCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button type="button" onClick={addTechnology} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
                {pendingTechIcon && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                    <FocusAreaIcon icon={pendingTechIcon} iconType="lucide" className="text-sm" />
                    <span className="text-xs text-primary">Icon selected: {pendingTechIcon}</span>
                    <button type="button" onClick={() => setPendingTechIcon('')} className="text-muted hover:text-red-500 text-xs ml-auto">Clear</button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-xs text-muted">
                      {t.icon ? <FocusAreaIcon icon={t.icon} iconType="lucide" className="text-sm" /> : <span className="w-4 h-4 inline-block" />}
                      {t.name} {t.category && <span className="text-muted ml-1">({t.category})</span>}
                      <button type="button" onClick={() => { setTechIconTarget(i); setShowIconPicker(true); setIconPickerSearch(''); }}
                        className="w-5 h-5 inline-flex items-center justify-center rounded bg-white/10 hover:bg-primary/30 text-muted hover:text-primary transition-colors" title="Pick icon">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button type="button" onClick={() => removeTechnology(i)} className="text-muted hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>

                {/* Icon Picker Modal */}
                {showIconPicker && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setShowIconPicker(false)}>
                    <div className="bg-[#1a1a1a] border border-border rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between p-4 border-b border-border">
                        <h3 className="text-sm font-bold text-foreground">Pick Icon</h3>
                        <button onClick={() => setShowIconPicker(false)} className="text-muted hover:text-foreground">✕</button>
                      </div>
                      <div className="p-3 border-b border-border">
                        <input type="text" value={iconPickerSearch} onChange={(e) => setIconPickerSearch(e.target.value)}
                          placeholder="Search icons..." className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                      </div>
                      <div className="p-4 max-h-[60vh] overflow-y-auto">
                        {Object.entries(LUCIDE_CATEGORIES).map(([category, icons]) => {
                          const filtered = iconPickerSearch ? icons.filter(i => i.toLowerCase().includes(iconPickerSearch.toLowerCase())) : icons;
                          if (filtered.length === 0) return null;
                          return (
                            <div key={category} className="mb-3">
                              <h4 className="text-[10px] font-black uppercase tracking-wider text-muted mb-1.5">{category}</h4>
                              <div className="flex flex-wrap gap-1">
                                {filtered.map((iconName) => (
                                  <button key={iconName} type="button"
                                    onClick={() => {
                                      if (techIconTarget !== null && techIconTarget >= 0) {
                                        const updated = [...technologies];
                                        updated[techIconTarget] = { ...updated[techIconTarget], icon: iconName };
                                        setTechnologies(updated);
                                      } else {
                                        setPendingTechIcon(iconName);
                                      }
                                      setShowIconPicker(false);
                                    }}
                                    className="p-2 rounded-lg hover:bg-primary/20 transition-colors" title={iconName}>
                                    <FocusAreaIcon icon={iconName} iconType="lucide" className="text-lg" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
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
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 text-sm">
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

          {/* ─── Research Tab ────────────────────────── */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              {/* Publications */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Publications</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <input value={pubTitle} onChange={(e) => setPubTitle(e.target.value)} placeholder="Paper Title *" className={`${inputClass} col-span-2`} />
                  <input value={pubAuthors} onChange={(e) => setPubAuthors(e.target.value)} placeholder="Authors" className={inputClass} />
                  <input value={pubJournal} onChange={(e) => setPubJournal(e.target.value)} placeholder="Journal" className={inputClass} />
                  <input value={pubPublisher} onChange={(e) => setPubPublisher(e.target.value)} placeholder="Publisher (e.g., IEEE)" className={inputClass} />
                  <input value={pubVolume} onChange={(e) => setPubVolume(e.target.value)} placeholder="Volume" className={inputClass} />
                  <input value={pubIssue} onChange={(e) => setPubIssue(e.target.value)} placeholder="Issue" className={inputClass} />
                  <input value={pubPages} onChange={(e) => setPubPages(e.target.value)} placeholder="Pages (e.g., 234-250)" className={inputClass} />
                  <input type="number" value={pubYear || ''} onChange={(e) => setPubYear(e.target.value ? parseInt(e.target.value) : undefined)} placeholder="Year" className={inputClass} />
                  <input value={pubDoi} onChange={(e) => setPubDoi(e.target.value)} placeholder="DOI" className={inputClass} />
                  <input value={pubUrl} onChange={(e) => setPubUrl(e.target.value)} placeholder="URL" className={inputClass} />
                  <select value={pubType} onChange={(e) => setPubType(e.target.value)} className={inputClass}>
                    {pubTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                  </select>
                  <button type="button" onClick={addPublication} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium">Add</button>
                </div>
                {publications.length > 0 && (
                  <div className="space-y-1">
                    {publications.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 text-sm">
                        <span className="text-foreground flex-1 truncate">{p.title}</span>
                        {p.publisher && <span className="text-muted text-xs">{p.publisher}</span>}
                        {p.volume && <span className="text-muted text-xs">Vol.{p.volume}</span>}
                        {p.year && <span className="text-muted text-xs">{p.year}</span>}
                        {p.doi && <span className="text-primary text-xs">DOI</span>}
                        <button type="button" onClick={() => removePublication(i)} className="text-muted hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Datasets */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Datasets</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <input value={datasetName} onChange={(e) => setDatasetName(e.target.value)} placeholder="Dataset Name *" className={inputClass} />
                  <input value={datasetSource} onChange={(e) => setDatasetSource(e.target.value)} placeholder="Source" className={inputClass} />
                  <input value={datasetURL} onChange={(e) => setDatasetURL(e.target.value)} placeholder="URL" className={inputClass} />
                </div>
                <button type="button" onClick={addDataset} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium mb-3">Add Dataset</button>
                {datasets.length > 0 && (
                  <div className="space-y-1">
                    {datasets.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 text-sm">
                        <span className="text-foreground flex-1">{d.datasetName}</span>
                        {d.datasetSource && <span className="text-muted text-xs">{d.datasetSource}</span>}
                        <button type="button" onClick={() => removeDataset(i)} className="text-muted hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Funding */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Funding</h3>
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('funded')} className="w-4 h-4 rounded" />
                    <span className="text-sm text-muted">Funded</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input {...register('fundingAgency')} placeholder="Funding Agency" className={inputClass} />
                  <input {...register('grantNumber')} placeholder="Grant Number" className={inputClass} />
                  <input {...register('projectBudget')} placeholder="Budget" className={inputClass} />
                </div>
              </div>

              {/* Awards */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Awards</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <input value={awardName} onChange={(e) => setAwardName(e.target.value)} placeholder="Award Name *" className={inputClass} />
                  <input value={awardOrganizer} onChange={(e) => setAwardOrganizer(e.target.value)} placeholder="Organizer" className={inputClass} />
                  <input type="number" value={awardYear || ''} onChange={(e) => setAwardYear(e.target.value ? parseInt(e.target.value) : undefined)} placeholder="Year" className={inputClass} />
                  <input value={awardCert} onChange={(e) => setAwardCert(e.target.value)} placeholder="Certificate URL" className={inputClass} />
                </div>
                <button type="button" onClick={addAward} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium mb-3">Add Award</button>
                {awards.length > 0 && (
                  <div className="space-y-1">
                    {awards.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 text-sm">
                        <span className="text-foreground flex-1">{a.awardName}</span>
                        {a.organizer && <span className="text-muted text-xs">{a.organizer}</span>}
                        {a.year && <span className="text-muted text-xs">{a.year}</span>}
                        {a.certificate && <span className="text-primary text-xs">Cert</span>}
                        <button type="button" onClick={() => removeAward(i)} className="text-muted hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Docs Tab ────────────────────────────── */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Documentation Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>GitHub Repository</label><input {...register('docGithubRepo')} placeholder="https://github.com/..." className={inputClass} /></div>
                <div><label className={labelClass}>GitLab Repository</label><input {...register('docGitlabRepo')} placeholder="https://gitlab.com/..." className={inputClass} /></div>
                <div><label className={labelClass}>Research Paper</label><input {...register('docResearchPaper')} placeholder="https://doi.org/..." className={inputClass} /></div>
                <div><label className={labelClass}>Presentation</label><input {...register('docPresentation')} placeholder="https://..." className={inputClass} /></div>
                <div><label className={labelClass}>Poster</label><input {...register('docPoster')} placeholder="https://..." className={inputClass} /></div>
                <div><label className={labelClass}>Report</label><input {...register('docReport')} placeholder="https://drive.google.com/..." className={inputClass} /></div>
                <div><label className={labelClass}>Dataset</label><input {...register('docDataset')} placeholder="https://doi.org/..." className={inputClass} /></div>
                <div><label className={labelClass}>Documentation</label><input {...register('docDocumentation')} placeholder="https://docs..." className={inputClass} /></div>
                <div><label className={labelClass}>Live Demo</label><input {...register('docLiveDemo')} placeholder="https://demo..." className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>YouTube Presentation</label><input {...register('docYoutubePresentation')} placeholder="https://youtube.com/watch?v=..." className={inputClass} /></div>
            </div>
          )}

          {/* ─── SEO Tab ─────────────────────────────── */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div><label className={labelClass}>Meta Title</label><input {...register('seoTitle')} placeholder="SEO title (max 70 chars)" maxLength={70} className={inputClass} /></div>
              <div><label className={labelClass}>Meta Description</label><textarea {...register('seoDescription')} rows={3} placeholder="SEO description (max 160 chars)" maxLength={160} className={`${inputClass} resize-none`} /></div>
              <div><label className={labelClass}>Keywords (comma-separated)</label><input {...register('seoKeywords')} placeholder="robotics, research, DRC" className={inputClass} /></div>
            </div>
          )}

          {/* ─── Form Actions ────────────────────────── */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <button type="submit" className="px-6 py-3 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors">
              {editingId ? 'Update Research' : 'Create Research'}
            </button>
            {editingId && (
              <button type="button" onClick={() => {
                setEditingId(null); reset();
                setResearchers([]); setFaculty([]); setTechnologies([]); setComponents([]);
                setPublications([]); setDatasets([]); setAwards([]); setGalleryImages([]);
                setPubTitle(''); setPubAuthors(''); setPubJournal(''); setPubPublisher('');
                setPubVolume(''); setPubIssue(''); setPubPages(''); setPubYear(undefined);
                setPubDoi(''); setPubUrl(''); setPubType('journal_paper');
                setAwardName(''); setAwardOrganizer(''); setAwardYear(undefined); setAwardCert('');
                setCurrentImageUrl(''); setActiveTab('basic');
              }}
                className="px-6 py-3 border border-border text-muted rounded-lg hover:bg-background/5 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ─── Research List ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {researchList.map((item) => (
          <div key={item._id as string} className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 transition-all relative">
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <button onClick={() => handleEdit(item)} className="px-2 py-1 bg-blue-600 text-foreground text-xs rounded hover:bg-blue-700">Edit</button>
              <button onClick={() => handleDelete(item._id as string)} className="px-2 py-1 bg-red-600 text-foreground text-xs rounded hover:bg-red-700">Del</button>
            </div>
            {Boolean((item.homepage as Record<string, unknown>)?.featured) && <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-foreground text-xs rounded-full">Featured</div>}
            <div className="flex p-4 gap-4">
              <div className="w-24 h-24 flex-shrink-0 bg-input-bg rounded-lg overflow-hidden">
                <img
                  src={(item.coverImage as { url?: string })?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent((item.title as string) || 'R')}&background=1e1e1e&color=e63946&size=200&bold=true&length=2`}
                  alt={item.title as string}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground truncate">{item.title as string}</h3>
                <p className="text-xs text-muted">{(item.researchArea as string) || 'Robotics'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[(item.status as string) || 'ongoing'] || statusColors.ongoing}`}>
                    {(item.status as string || 'ongoing').replace(/_/g, ' ')}
                  </span>
                  {Array.isArray(item.researchers) && item.researchers.length > 0 && (
                    <span className="text-xs text-muted">{item.researchers.length} researcher{item.researchers.length > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {researchList.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <p className="text-muted">No research entries yet. Add your first research above.</p>
        </div>
      )}
    </div>
  );
}
