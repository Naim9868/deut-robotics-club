import { z } from 'zod';

// ─── Shared Sub-Schemas ───────────────────────────────────────

const imageFieldSchema = z.object({
  url: z.string().default(''),
  alt: z.string().optional(),
  publicId: z.string().optional(),
  type: z.enum(['cloudinary', 'link']).default('cloudinary'),
});

const technologySchema = z.object({
  name: z.string().min(1, 'Technology name is required').max(100).trim(),
  icon: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
});

const componentSchema = z.object({
  componentName: z.string().min(1, 'Component name is required').max(200).trim(),
  specification: z.string().max(500).optional(),
  quantity: z.number().int().min(0).default(1),
  inventoryReference: z.string().max(100).optional(),
});

const learningResourceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).trim(),
  url: z.string().url('Invalid URL').or(z.literal('')),
  type: z.enum(['book', 'documentation', 'github', 'youtube', 'research_paper', 'tutorial', 'course']),
  description: z.string().max(500).optional(),
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
  facultyAdvisor: z.string().max(200).optional(),
  mentors: z.array(z.string().max(200)).default([]),
  industryMentors: z.array(z.string().max(200)).default([]),
});

const relatedContentSchema = z.object({
  projects: z.array(z.string()).default([]),
  research: z.array(z.string()).default([]),
  events: z.array(z.string()).default([]),
  workshops: z.array(z.string()).default([]),
  competitions: z.array(z.string()).default([]),
  members: z.array(z.string()).default([]),
});

// ─── Main Schemas ─────────────────────────────────────────────

const CATEGORIES = [
  'Robotics',
  'Artificial Intelligence',
  'Machine Learning',
  'Computer Vision',
  'Embedded Systems',
  'IoT',
  'Drone',
  'Automation',
  'Biomedical Robotics',
  'Control Systems',
  'Power Electronics',
  'Mechanical Design',
  'Other',
] as const;

export const createFocusAreaSchema = z.object({
  // Basic Information
  title: z.string().min(1, 'Title is required').max(200).trim(),
  slug: z.string().max(200).trim().optional(),
  shortDescription: z.string().max(300).optional(),
  fullDescription: z.string().optional(),
  summary: z.string().max(500).optional(),

  // Media
  icon: z.string().max(200).default('Bot'),
  iconType: z.enum(['lucide', 'image']).default('lucide'),
  coverImage: imageFieldSchema.default({ url: '', alt: '', type: 'cloudinary' }),
  galleryImages: z.array(imageFieldSchema).default([]),
  bannerImage: imageFieldSchema.default({ url: '', alt: '', type: 'cloudinary' }),
  thumbnail: imageFieldSchema.default({ url: '', alt: '', type: 'cloudinary' }),
  color: z.string().max(20).default('#e63946'),

  // Classification
  category: z.enum(CATEGORIES, { message: 'Invalid category' }),
  subCategory: z.string().max(100).optional(),
  researchLevel: z.enum(['beginner', 'intermediate', 'advanced', 'research']).default('beginner'),

  // Overview
  vision: z.string().optional(),
  mission: z.string().optional(),
  objectives: z.array(z.string().max(500)).default([]),

  // Technologies
  technologies: z.array(technologySchema).default([]),

  // Hardware & Components
  components: z.array(componentSchema).default([]),

  // Applications
  applications: z.array(z.string().max(100)).default([]),

  // Skills Required
  skillsRequired: z.array(z.string().max(100)).default([]),

  // Learning Resources
  learningResources: z.array(learningResourceSchema).default([]),

  // Related Content
  relatedContent: relatedContentSchema.default({ projects: [], research: [], events: [], workshops: [], competitions: [], members: [] }),

  // Faculty & Mentors
  faculty: facultySchema.default({ facultyAdvisor: '', mentors: [], industryMentors: [] }),

  // Statistics
  statistics: z.object({
    totalProjects: z.number().int().min(0).default(0),
    totalResearch: z.number().int().min(0).default(0),
    totalMembers: z.number().int().min(0).default(0),
    totalAwards: z.number().int().min(0).default(0),
  }).default({ totalProjects: 0, totalResearch: 0, totalMembers: 0, totalAwards: 0 }),

  // Homepage
  homepage: homepageSchema.default({ featured: false, showOnHomepage: false, displayOrder: 0 }),

  // Visibility
  visibility: z.enum(['public', 'members', 'private']).default('public'),

  // SEO
  seo: seoSchema.default({ keywords: [] as string[] }),

  // Analytics
  analytics: z.object({
    views: z.number().int().min(0).default(0),
    followers: z.number().int().min(0).default(0),
  }).default({ views: 0, followers: 0 }),

  // System
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const updateFocusAreaSchema = createFocusAreaSchema.partial();

export const focusAreaQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateFocusAreaInput = z.infer<typeof createFocusAreaSchema>;
export type UpdateFocusAreaInput = z.infer<typeof updateFocusAreaSchema>;
