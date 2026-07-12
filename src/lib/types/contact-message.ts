/**
 * ContactMessage Type Definitions
 * Centralized TypeScript interfaces for the Contact Message module.
 */

/** Status options for a contact message */
export type ContactMessageStatus = 'unread' | 'read' | 'replied' | 'archived';

/** Shape of a ContactMessage document as stored in MongoDB */
export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  reply: string;
  repliedBy: string | null;
  repliedAt: Date | null;
  ipAddress: string;
  userAgent: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Payload for creating a new contact message (public form) */
export interface CreateContactMessageDTO {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Payload for replying to a contact message (admin) */
export interface ReplyContactMessageDTO {
  reply: string;
  repliedBy: string;
}

/** Query parameters for listing contact messages (admin) */
export interface ContactMessageQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContactMessageStatus | 'all';
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'email' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/** Paginated response shape */
export interface PaginatedContactMessages {
  messages: IContactMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Dashboard statistics for contact messages */
export interface ContactMessageStats {
  total: number;
  unread: number;
  today: number;
  thisWeek: number;
}
