import { z } from 'zod';

// ─── Shared Sub-Schemas ───────────────────────────────────────

const imageFieldSchema = z.object({
  url: z.string().default(''),
  alt: z.string().optional(),
  publicId: z.string().optional(),
  type: z.enum(['cloudinary', 'link']).default('cloudinary'),
});

const researcherSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100).trim(),
  designation: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  session: z.string().max(50).optional(),
  studentId: z.string().max(50).optional(),
  roll: z.string().max(50).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  profilePhoto: imageFieldSchema.optional(),
  orcid: z.string().optional(),
  googleScholar: z.string().optional(),
  researchGate: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  role: z.enum(['Principal Investigator', 'Co-Investigator', 'Research Assistant', 'Supervisor', 'Student Researcher']).default('Student Researcher'),
});

const facultyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200).trim(),
  role: z.enum(['Supervisor', 'Co-Supervisor', 'Advisor', 'Mentor']),
  department: z.string().max(100).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  profilePhoto: imageFieldSchema.optional(),
});

const technologySchema = z.object({
  name: z.string().min(1, 'Technology name is required').max(100).trim(),
  icon: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
});

const componentSchema = z.object({
  componentId: z.string().optional(),
  componentName: z.string().min(1, 'Component name is required').max(200).trim(),
  quantity: z.number().int().min(0).default(1),
  specification: z.string().max(500).optional(),
});

const datasetSchema = z.object({
  datasetName: z.string().min(1, 'Dataset name is required').max(200).trim(),
  datasetSource: z.string().max(200).optional(),
  datasetURL: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500).trim(),
  authors: z.string().max(500).optional(),
  journal: z.string().max(300).optional(),
  conference: z.string().max(300).optional(),
  publisher: z.string().max(200).optional(),
  volume: z.string().max(50).optional(),
  issue: z.string().max(50).optional(),
  pages: z.string().max(50).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  doi: z.string().optional(),
  isbn: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  citationCount: z.number().int().min(0).default(0),
  type: z.enum(['journal_paper', 'conference_paper', 'book', 'book_chapter', 'technical_report', 'patent', 'prototype', 'software', 'dataset']).default('journal_paper'),
});

const fundingSchema = z.object({
  funded: z.boolean().default(false),
  fundingAgency: z.string().max(200).optional(),
  grantNumber: z.string().max(100).optional(),
  projectBudget: z.string().max(100).optional(),
});

const awardSchema = z.object({
  awardName: z.string().min(1, 'Award name is required').max(200).trim(),
  organizer: z.string().max(200).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  certificate: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const documentationSchema = z.object({
  githubRepo: z.string().url('Invalid URL').optional().or(z.literal('')),
  gitlabRepo: z.string().url('Invalid URL').optional().or(z.literal('')),
  researchPaper: z.string().url('Invalid URL').optional().or(z.literal('')),
  presentation: z.string().url('Invalid URL').optional().or(z.literal('')),
  poster: z.string().url('Invalid URL').optional().or(z.literal('')),
  report: z.string().url('Invalid URL').optional().or(z.literal('')),
  dataset: z.string().url('Invalid URL').optional().or(z.literal('')),
  documentation: z.string().url('Invalid URL').optional().or(z.literal('')),
  liveDemo: z.string().url('Invalid URL').optional().or(z.literal('')),
  youtubePresentation: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const seoSchema = z.object({
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.array(z.string().max(50)).default([]),
});

const homepageSchema = z.object({
  featured: z.boolean().default(false),
  showOnHomepage: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});

// ─── Main Schemas ─────────────────────────────────────────────

export const createResearchSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300).trim(),
  slug: z.string().max(300).trim().optional(),
  shortDescription: z.string().max(500).optional(),
  abstract: z.string().max(2000).optional(),
  fullDescription: z.string().optional(),
  summary: z.string().max(1000).optional(),
  keywords: z.array(z.string().max(50)).default([]),
  researchCode: z.string().max(50).optional(),

  // Media
  coverImage: imageFieldSchema.default({ url: '', alt: '', type: 'cloudinary' }),
  galleryImages: z.array(imageFieldSchema).default([]),
  thumbnail: imageFieldSchema.optional(),
  youtubePresentation: z.string().url('Invalid URL').optional().or(z.literal('')),
  researchPoster: imageFieldSchema.optional(),
  attachments: z.array(imageFieldSchema).default([]),

  // Research Information
  researchArea: z.enum([
    'Robotics', 'Artificial Intelligence', 'Machine Learning',
    'Computer Vision', 'IoT', 'Embedded Systems', 'Automation',
    'Drone', 'Biomedical', 'Control Systems', 'Power Electronics',
    'Mechanical Design', 'Other',
  ]).default('Robotics'),
  category: z.string().max(100).optional(),
  subCategory: z.string().max(100).optional(),
  researchType: z.enum(['experimental', 'theoretical', 'computational', 'review', 'survey']).default('experimental'),
  researchLevel: z.enum(['Undergraduate', 'Graduate', 'Faculty', 'Club', 'Collaborative']).default('Undergraduate'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Intermediate'),

  // Status
  status: z.enum([
    'proposed', 'literature_review', 'ongoing', 'experimentation',
    'paper_writing', 'submitted', 'accepted', 'published',
    'completed', 'archived',
  ]).default('ongoing'),

  // Creator
  createdBy: z.string().max(100).optional(),
  createdByType: z.enum(['admin', 'member', 'faculty']).default('admin'),

  // Research Team
  researchers: z.array(researcherSchema).default([]),

  // Faculty
  faculty: z.array(facultyMemberSchema).default([]),

  // Timeline
  startDate: z.string().optional(),
  expectedCompletion: z.string().optional(),
  completedAt: z.string().optional(),
  publishedAt: z.string().optional(),

  // Technologies
  technologies: z.array(technologySchema).default([]),

  // Components
  components: z.array(componentSchema).default([]),

  // Datasets
  datasets: z.array(datasetSchema).default([]),

  // Publications
  publications: z.array(publicationSchema).default([]),

  // Funding
  funding: fundingSchema.default({ funded: false }),

  // Awards
  awards: z.array(awardSchema).default([]),

  // Documentation
  documentation: documentationSchema.default({}),

  // Visibility
  visibility: z.enum(['public', 'members', 'private']).default('public'),

  // SEO
  seo: seoSchema.default({ keywords: [] as string[] }),

  // Homepage
  homepage: homepageSchema.default({ featured: false, showOnHomepage: false, displayOrder: 0 }),

  // Legacy
  technology: z.string().max(100).optional(),
  icon: z.string().max(10).default('🔬'),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const updateResearchSchema = createResearchSchema.partial();

export const researchQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  researchArea: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  featured: z.boolean().optional(),
  researchLevel: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateResearchInput = z.infer<typeof createResearchSchema>;
export type UpdateResearchInput = z.infer<typeof updateResearchSchema>;
