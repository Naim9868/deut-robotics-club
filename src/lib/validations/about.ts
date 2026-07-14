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
  website: z.string().default(''),
});

// ─── Item Schemas ─────────────────────────────────────────────

const coreValueItemSchema = z.object({
  title: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  icon: z.string().max(100).default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const objectiveItemSchema = z.object({
  title: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  icon: z.string().max(100).default(''),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const timelineItemSchema = z.object({
  year: z.string().max(20).default(''),
  title: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const achievementItemSchema = z.object({
  title: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  year: z.string().max(20).default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const statItemSchema = z.object({
  label: z.string().max(100).default(''),
  value: z.string().max(50).default(''),
  icon: z.string().max(100).default(''),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const whyJoinItemSchema = z.object({
  title: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  icon: z.string().max(100).default(''),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const facultyAdvisorItemSchema = z.object({
  name: z.string().max(200).default(''),
  designation: z.string().max(200).default(''),
  department: z.string().max(200).default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  message: z.string().max(1000).default(''),
  socialLinks: socialLinksSchema.default({ facebook: '', linkedin: '', github: '', website: '' }),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const facilityItemSchema = z.object({
  name: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const laboratoryItemSchema = z.object({
  name: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  equipment: z.array(z.string().max(200)).default([]),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const sponsorItemSchema = z.object({
  name: z.string().max(200).default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  website: z.string().default(''),
  tier: z.enum(['platinum', 'gold', 'silver', 'bronze', 'partner', '']).default(''),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const galleryItemSchema = z.object({
  url: z.string().default(''),
  alt: z.string().default(''),
  caption: z.string().max(500).default(''),
  type: z.enum(['image', 'video', '']).default('image'),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const faqItemSchema = z.object({
  question: z.string().max(500).default(''),
  answer: z.string().max(5000).default(''),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

// ─── Section Schemas ──────────────────────────────────────────

const heroSectionSchema = z.object({
  isEnabled: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  bannerImage: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
  title: z.string().max(200).default(''),
  subtitle: z.string().max(500).default(''),
  ctaButton: z.object({ text: z.string().max(100).default(''), link: z.string().default('') }).default({ text: '', link: '' }),
});

const introductionSectionSchema = z.object({
  isEnabled: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  shortIntro: z.string().max(1000).default(''),
  longDescription: z.string().default(''),
});

const contentSectionSchema = z.object({
  isEnabled: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  content: z.string().default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
});

const itemsSectionSchema = z.object({
  isEnabled: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});

const gallerySectionSchema = z.object({
  isEnabled: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  items: z.array(galleryItemSchema).default([]),
});

const videoSectionSchema = z.object({
  isEnabled: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  title: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  videoUrl: z.string().default(''),
  thumbnailUrl: z.string().default(''),
});

const ctaSectionSchema = z.object({
  isEnabled: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  title: z.string().max(200).default(''),
  description: z.string().max(1000).default(''),
  buttonText: z.string().max(100).default(''),
  buttonLink: z.string().default(''),
  image: imageFieldSchema.default({ url: '', alt: '', publicId: '' }),
});

// ─── Main Schema ──────────────────────────────────────────────

export const updateAboutSchema = z.object({
  hero: heroSectionSchema.optional(),
  introduction: introductionSectionSchema.optional(),
  story: contentSectionSchema.optional(),
  mission: contentSectionSchema.optional(),
  vision: contentSectionSchema.optional(),
  coreValues: itemsSectionSchema.extend({ items: z.array(coreValueItemSchema).default([]) }).optional(),
  objectives: itemsSectionSchema.extend({ items: z.array(objectiveItemSchema).default([]) }).optional(),
  journeyTimeline: itemsSectionSchema.extend({ items: z.array(timelineItemSchema).default([]) }).optional(),
  achievements: itemsSectionSchema.extend({ items: z.array(achievementItemSchema).default([]) }).optional(),
  statistics: itemsSectionSchema.extend({ items: z.array(statItemSchema).default([]) }).optional(),
  whyJoin: itemsSectionSchema.extend({ items: z.array(whyJoinItemSchema).default([]) }).optional(),
  facultyAdvisors: itemsSectionSchema.extend({ items: z.array(facultyAdvisorItemSchema).default([]) }).optional(),
  facilities: itemsSectionSchema.extend({ items: z.array(facilityItemSchema).default([]) }).optional(),
  laboratories: itemsSectionSchema.extend({ items: z.array(laboratoryItemSchema).default([]) }).optional(),
  sponsorsPartners: itemsSectionSchema.extend({ items: z.array(sponsorItemSchema).default([]) }).optional(),
  gallery: gallerySectionSchema.optional(),
  promotionalVideo: videoSectionSchema.optional(),
  faqs: itemsSectionSchema.extend({ items: z.array(faqItemSchema).default([]) }).optional(),
  callToAction: ctaSectionSchema.optional(),
});

export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;
