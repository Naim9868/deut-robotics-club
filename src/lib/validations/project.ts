import { z } from 'zod';

// ─── Shared Sub-Schemas ───────────────────────────────────────

const imageFieldSchema = z.object({
  url: z.string().default(''),
  alt: z.string().optional(),
  publicId: z.string().optional(),
  type: z.enum(['cloudinary', 'link']).default('cloudinary'),
});

const teamMemberSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100).trim(),
  designation: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  session: z.string().max(50).optional(),
  studentId: z.string().max(50).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  profilePhoto: imageFieldSchema.optional(),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  roleInProject: z.string().max(100).optional(),
  isLeader: z.boolean().default(false),
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

const documentationSchema = z.object({
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  liveDemo: z.string().url('Invalid URL').optional().or(z.literal('')),
  documentation: z.string().url('Invalid URL').optional().or(z.literal('')),
  researchPaper: z.string().url('Invalid URL').optional().or(z.literal('')),
  presentation: z.string().url('Invalid URL').optional().or(z.literal('')),
  report: z.string().url('Invalid URL').optional().or(z.literal('')),
  youtubeVideo: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const competitionSchema = z.object({
  competitionName: z.string().max(200).optional(),
  organizer: z.string().max(200).optional(),
  award: z.string().max(200).optional(),
  position: z.string().max(100).optional(),
  certificate: z.string().url('Invalid URL').optional().or(z.literal('')),
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

const facultySchema = z.object({
  advisor: z.string().max(200).optional(),
  coAdvisor: z.string().max(200).optional(),
  mentor: z.string().max(200).optional(),
});

// ─── Main Schemas ─────────────────────────────────────────────

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).trim(),
  slug: z.string().max(200).trim().optional(),
  shortDescription: z.string().max(300).optional(),
  fullDescription: z.string().optional(),
  summary: z.string().max(500).optional(),
  tag: z.string().min(1, 'Tag is required').max(100).trim(),

  // Media
  coverImage: imageFieldSchema.default({ url: '', alt: '', type: 'cloudinary' }),
  galleryImages: z.array(imageFieldSchema).default([]),
  thumbnail: imageFieldSchema.optional(),
  youtubeVideo: z.string().url('Invalid URL').optional().or(z.literal('')),
  attachments: z.array(imageFieldSchema).default([]),

  // Info
  category: z.enum(['COMBAT', 'AI', 'AERO', 'AUTO', 'OTHER'], {
    message: 'Invalid category',
  }),
  subCategory: z.string().max(100).optional(),
  projectType: z.enum(['individual', 'team', 'club']).default('team'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),

  // Creator
  createdBy: z.string().max(100).optional(),
  createdByType: z.enum(['admin', 'member']).default('admin'),

  // Team
  team: z.array(teamMemberSchema).default([]),

  // Faculty
  faculty: facultySchema.default({}),

  // Technologies
  technologies: z.array(technologySchema).default([]),

  // Components
  components: z.array(componentSchema).default([]),

  // Documentation
  documentation: documentationSchema.default({}),

  // Competition
  competition: competitionSchema.default({}),

  // Status
  status: z
    .enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'ongoing', 'completed', 'archived'])
    .default('draft'),

  // Visibility
  visibility: z.enum(['public', 'members', 'private']).default('public'),

  // SEO
  seo: seoSchema.default({ keywords: [] as string[] }),

  // Homepage
  homepage: homepageSchema.default({ featured: false, showOnHomepage: false, displayOrder: 0 }),

  // Legacy
  id: z.string().max(50).optional(),
  latency: z.string().max(20).default('0.00ms'),
  image: imageFieldSchema.optional(),
  github: z.string().url().optional().or(z.literal('')),
  demo: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  featured: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
