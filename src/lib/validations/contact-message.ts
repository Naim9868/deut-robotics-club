import { z } from 'zod';

/**
 * Contact Message Zod Validation Schemas
 * Used for server-side input validation on API routes.
 */

/** Schema for creating a contact message (public form submission) */
export const createContactMessageSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(254, 'Email cannot exceed 254 characters')
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase(),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters')
    .trim(),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message cannot exceed 5000 characters')
    .trim(),
});

/** Schema for replying to a contact message (admin) */
export const replyContactMessageSchema = z.object({
  reply: z
    .string()
    .min(1, 'Reply text is required')
    .max(5000, 'Reply cannot exceed 5000 characters')
    .trim(),
  repliedBy: z
    .string()
    .min(1, 'RepliedBy is required')
    .max(100, 'RepliedBy cannot exceed 100 characters')
    .trim(),
});

/** Schema for validating query params when listing messages */
export const contactMessageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(200).default(''),
  status: z
    .enum(['unread', 'read', 'replied', 'archived', 'all'])
    .default('all'),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'name', 'email', 'status'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/** Schema for validating MongoDB ObjectId params */
export const mongoIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid message ID format'),
});

// Export inferred types for use in services/controllers
export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
export type ReplyContactMessageInput = z.infer<typeof replyContactMessageSchema>;
export type ContactMessageQueryInput = z.infer<typeof contactMessageQuerySchema>;
