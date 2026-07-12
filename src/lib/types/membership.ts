/**
 * Membership Module Type Definitions
 * Centralized TypeScript interfaces for Registration, Members, Payments, and Settings.
 */

// ═══════════════════════════════════════════════════════════════════
// REGISTRATION APPLICATION
// ═══════════════════════════════════════════════════════════════════

/** Status lifecycle of a registration application */
export type RegistrationStatus =
  | 'draft'
  | 'submitted'
  | 'pending_payment'
  | 'pending_verification'
  | 'approved'
  | 'rejected';

/** Membership status assigned after approval */
export type MembershipStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'expired'
  | 'alumni';

/** Gender options */
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

/** Blood group options */
export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | string;

/** Image field supporting Cloudinary or external link */
export interface ImageField {
  url: string;
  publicId?: string;
  type: 'cloudinary' | 'link';
}

/** Personal information section */
export interface PersonalInfo {
  fullName: string;
  profilePhoto: ImageField;
  gender: Gender;
  dateOfBirth: string;
  bloodGroup?: BloodGroup;
}

/** University information section */
export interface UniversityInfo {
  studentId: string;
  registrationNumber?: string;
  department: string;
  session: string;
  semester: string;
}

/** Contact information section */
export interface ContactInfo {
  email: string;
  phone: string;
  whatsappNumber?: string;
  emergencyContact: string;
  address: string;
}

/** Payment information section */
export interface PaymentInfo {
  method: string;
  transactionId: string;
  senderNumber: string;
  amount: number;
  screenshot: ImageField;
}

/** Additional information section */
export interface AdditionalInfo {
  skills: string[];
  interests: string[];
  previousExperience: string;
  motivation: string;
}

/** Admin notes on an application */
export interface AdminNote {
  note: string;
  addedBy: string;
  addedAt: Date;
}

/** Full RegistrationApplication document shape */
export interface IRegistrationApplication {
  _id: string;
  applicationId: string;
  personal: PersonalInfo;
  university: UniversityInfo;
  contact: ContactInfo;
  payment: PaymentInfo;
  additional: AdditionalInfo;
  status: RegistrationStatus;
  membershipId?: string;
  adminNotes: AdminNote[];
  reviewedBy?: string;
  reviewedAt?: Date;
  ipAddress: string;
  userAgent: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO for public registration form submission */
export interface CreateRegistrationDTO {
  personal: PersonalInfo;
  university: UniversityInfo;
  contact: ContactInfo;
  payment: PaymentInfo;
  additional: AdditionalInfo;
}

/** Query params for listing registration applications */
export interface RegistrationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RegistrationStatus | 'all';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Paginated response for registration applications */
export interface PaginatedRegistrations {
  applications: IRegistrationApplication[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ═══════════════════════════════════════════════════════════════════
// MEMBER
// ═══════════════════════════════════════════════════════════════════

/** Membership type */
export type MembershipType = 'regular' | 'executive' | 'honorary';

/** Full Member document shape */
export interface IMember {
  _id: string;
  membershipId: string;
  registrationApplication: string | IRegistrationApplication;
  personal: PersonalInfo;
  university: UniversityInfo;
  contact: ContactInfo;
  additional: AdditionalInfo;
  membershipStatus: MembershipStatus;
  membershipType: MembershipType;
  joinedAt: Date;
  expiresAt?: Date;
  suspendedAt?: Date;
  suspendedReason?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Query params for listing members */
export interface MemberQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  membershipStatus?: MembershipStatus | 'all';
  membershipType?: MembershipType | 'all';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Paginated response for members */
export interface PaginatedMembers {
  members: IMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ═══════════════════════════════════════════════════════════════════
// PAYMENT
// ═══════════════════════════════════════════════════════════════════

/** Payment verification status */
export type PaymentVerificationStatus =
  | 'pending'
  | 'verified'
  | 'rejected';

/** Full Payment document shape */
export interface IPayment {
  _id: string;
  registrationApplication: string | IRegistrationApplication;
  method: string;
  transactionId: string;
  senderNumber: string;
  amount: number;
  screenshot: ImageField;
  verificationStatus: PaymentVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════════════════
// MEMBERSHIP SETTINGS
// ═══════════════════════════════════════════════════════════════════

/** Configuration for the membership system */
export interface IMembershipSettings {
  _id: string;
  registrationOpen: boolean;
  registrationFee: number;
  paymentMethods: {
    name: string;
    enabled: boolean;
    details: string;
  }[];
  registrationInstructions: string;
  maxMembers: number;
  membershipDurationMonths: number;
  updatedAt: Date;
}
