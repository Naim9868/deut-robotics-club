import { z } from 'zod';

/**
 * Membership Module Zod Validation Schemas
 * Used for server-side input validation on all membership-related API routes.
 */

// ─── Shared Sub-Schemas ─────────────────────────────────────────

const imageFieldSchema = z.object({
  url: z.string().default(''),
  publicId: z.string().optional(),
  type: z.enum(['cloudinary', 'link']).default('cloudinary'),
});

const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  profilePhoto: imageFieldSchema,
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    message: 'Invalid gender option',
  }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z
    .string()
    .optional()
    .default(''),
});

const universityInfoSchema = z.object({
  studentId: z
    .string()
    .min(1, 'Student ID is required')
    .max(50, 'Student ID cannot exceed 50 characters')
    .trim(),
  registrationNumber: z
    .string()
    .max(50, 'Registration number cannot exceed 50 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .min(1, 'Department is required')
    .max(100, 'Department cannot exceed 100 characters')
    .trim(),
  session: z
    .string()
    .min(1, 'Session is required')
    .max(50, 'Session cannot exceed 50 characters')
    .trim(),
  semester: z
    .string()
    .min(1, 'Semester is required')
    .max(20, 'Semester cannot exceed 20 characters')
    .trim(),
});

const contactInfoSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(254, 'Email cannot exceed 254 characters')
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number cannot exceed 20 characters')
    .trim(),
  whatsappNumber: z
    .string()
    .max(20, 'WhatsApp number cannot exceed 20 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  emergencyContact: z
    .string()
    .min(1, 'Emergency contact is required')
    .max(100, 'Emergency contact cannot exceed 100 characters')
    .trim(),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(500, 'Address cannot exceed 500 characters')
    .trim(),
});

const paymentInfoSchema = z.object({
  method: z.string().min(1, 'Payment method is required').trim(),
  transactionId: z
    .string()
    .min(1, 'Transaction ID is required')
    .max(100, 'Transaction ID cannot exceed 100 characters')
    .trim(),
  senderNumber: z
    .string()
    .min(1, 'Sender number is required')
    .max(20, 'Sender number cannot exceed 20 characters')
    .trim(),
  amount: z.coerce
    .number()
    .min(0, 'Amount must be a positive number'),
  screenshot: imageFieldSchema,
});

const additionalInfoSchema = z.object({
  skills: z.array(z.string().trim()).default([]),
  interests: z.array(z.string().trim()).default([]),
  previousExperience: z
    .string()
    .max(2000, 'Previous experience cannot exceed 2000 characters')
    .trim()
    .default(''),
  motivation: z
    .string()
    .min(1, 'Motivation is required')
    .max(2000, 'Motivation cannot exceed 2000 characters')
    .trim(),
});

// ═══════════════════════════════════════════════════════════════════
// REGISTRATION SCHEMAS
// ═══════════════════════════════════════════════════════════════════

/** Schema for public registration form submission */
export const createRegistrationSchema = z.object({
  personal: personalInfoSchema,
  university: universityInfoSchema,
  contact: contactInfoSchema,
  payment: paymentInfoSchema,
  additional: additionalInfoSchema,
});

/** Schema for admin status update */
export const updateRegistrationStatusSchema = z.object({
  status: z.enum(['submitted', 'pending_payment', 'pending_verification', 'approved', 'rejected'], {
    message: 'Invalid status',
  }),
  reason: z
    .string()
    .max(500, 'Reason cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
});

/** Schema for admin notes */
export const addAdminNoteSchema = z.object({
  note: z
    .string()
    .min(1, 'Note is required')
    .max(1000, 'Note cannot exceed 1000 characters')
    .trim(),
  addedBy: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author cannot exceed 100 characters')
    .trim(),
});

/** Schema for listing registration applications */
export const registrationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(200).default(''),
  status: z
    .enum(['draft', 'submitted', 'pending_payment', 'pending_verification', 'approved', 'rejected', 'all'])
    .default('all'),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'status', 'personal.fullName', 'university.studentId'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ═══════════════════════════════════════════════════════════════════
// MEMBER SCHEMAS
// ═══════════════════════════════════════════════════════════════════

/** Schema for updating a member */
export const updateMemberSchema = z.object({
  personal: personalInfoSchema.partial().optional(),
  university: universityInfoSchema.partial().optional(),
  contact: contactInfoSchema.partial().optional(),
  additional: additionalInfoSchema.partial().optional(),
  membershipType: z.enum(['regular', 'executive', 'honorary']).optional(),
});

/** Schema for changing membership status */
export const changeMembershipStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'expired', 'alumni'], {
    message: 'Invalid membership status',
  }),
  reason: z
    .string()
    .max(500, 'Reason cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
});

/** Schema for listing members */
export const memberQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(200).default(''),
  membershipStatus: z
    .enum(['pending', 'active', 'suspended', 'expired', 'alumni', 'all'])
    .default('all'),
  membershipType: z
    .enum(['regular', 'executive', 'honorary', 'all'])
    .default('all'),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'membershipId', 'personal.fullName', 'joinedAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ═══════════════════════════════════════════════════════════════════
// MEMBERSHIP SETTINGS SCHEMA
// ═══════════════════════════════════════════════════════════════════

const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Payment method name is required').trim(),
  enabled: z.boolean(),
  details: z.string().trim().default(''),
});

/** Schema for updating membership settings */
export const updateMembershipSettingsSchema = z.object({
  registrationOpen: z.boolean().optional(),
  registrationFee: z.coerce.number().min(0, 'Fee must be a positive number').optional(),
  paymentMethods: z.array(paymentMethodSchema).optional(),
  registrationInstructions: z
    .string()
    .max(5000, 'Instructions cannot exceed 5000 characters')
    .trim()
    .optional(),
  maxMembers: z.coerce.number().int().min(1, 'Max members must be at least 1').optional(),
  membershipDurationMonths: z.coerce.number().int().min(1, 'Duration must be at least 1 month').optional(),
});

/** Schema for MongoDB ObjectId params */
export const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});

// ─── Inferred Types ─────────────────────────────────────────────

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
export type UpdateRegistrationStatusInput = z.infer<typeof updateRegistrationStatusSchema>;
export type AddAdminNoteInput = z.infer<typeof addAdminNoteSchema>;
export type RegistrationQueryInput = z.infer<typeof registrationQuerySchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type ChangeMembershipStatusInput = z.infer<typeof changeMembershipStatusSchema>;
export type MemberQueryInput = z.infer<typeof memberQuerySchema>;
export type UpdateMembershipSettingsInput = z.infer<typeof updateMembershipSettingsSchema>;
