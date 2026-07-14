import { z } from 'zod';

// ─── Shared Sub-Schemas ───────────────────────────────────────

const imageFieldSchema = z.object({
  url: z.string().default(''),
  alt: z.string().default(''),
  publicId: z.string().default(''),
});

const socialLinksSchema = z.object({
  facebook: z.string().default(''),
  linkedin: z.string().default(''),
  github: z.string().default(''),
  portfolio: z.string().default(''),
  website: z.string().default(''),
});

// ─── Member Sub-Schema ────────────────────────────────────────

const committeeMemberSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200).trim(),
  slug: z.string().max(200).trim().optional(),
  profilePhoto: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  coverPhoto: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  designation: z.string().max(100).default(''),
  department: z.string().max(200).default(''),
  session: z.string().max(50).default(''),
  studentId: z.string().max(50).default(''),
  shortBio: z.string().max(500).default(''),
  fullBiography: z.string().default(''),
  email: z.string().email('Invalid email').or(z.literal('')).default(''),
  phone: z.string().max(30).default(''),
  socialLinks: socialLinksSchema.default({
    facebook: '', linkedin: '', github: '', portfolio: '', website: '',
  }),
  responsibilities: z.array(z.string().max(500)).default([]),
  achievements: z.array(z.string().max(500)).default([]),
  messageFromMember: z.string().max(1000).default(''),
  displayOrder: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
});

// ─── Main Schemas ─────────────────────────────────────────────

export const createExecutiveCommitteeSchema = z.object({
  committeeYear: z.number().int().min(2000).max(2100),
  title: z.string().min(1, 'Title is required').max(200).trim(),
  slug: z.string().max(200).trim().optional(),
  description: z.string().max(1000).default(''),
  isCurrent: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  members: z.array(committeeMemberSchema).default([]),
});

export const updateExecutiveCommitteeSchema = createExecutiveCommitteeSchema.partial();

export const executiveCommitteeQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  year: z.number().int().min(2000).max(2100).optional(),
  search: z.string().max(200).optional(),
  isPublished: z.boolean().optional(),
  isCurrent: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Inferred Types ───────────────────────────────────────────

export type CreateExecutiveCommitteeInput = z.infer<typeof createExecutiveCommitteeSchema>;
export type UpdateExecutiveCommitteeInput = z.infer<typeof updateExecutiveCommitteeSchema>;
