/**
 * ContactMessage Service Layer
 * Contains all business logic for contact message operations.
 * No HTTP concerns here — pure data operations.
 *
 * Follows Single Responsibility & Open/Closed principles.
 * Email sending is stubbed for future integration.
 */

import ContactMessage from '@/lib/models/ContactMessage';
import type {
  CreateContactMessageDTO,
  ReplyContactMessageDTO,
  ContactMessageQueryParams,
  PaginatedContactMessages,
  ContactMessageStats,
  IContactMessage,
} from '@/lib/types/contact-message';
import { sanitizeString } from '@/lib/utils/sanitize';

// ─── Create ────────────────────────────────────────────────────────────

/**
 * Create a new contact message from a public form submission.
 * Returns the created message document.
 */
export async function createMessage(
  data: CreateContactMessageDTO,
  meta: { ipAddress: string; userAgent: string }
): Promise<IContactMessage> {
  const message = await ContactMessage.create({
    name: sanitizeString(data.name),
    email: sanitizeString(data.email),
    subject: sanitizeString(data.subject),
    message: sanitizeString(data.message),
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    status: 'unread',
  });

  return message.toObject() as IContactMessage;
}

// ─── Read ──────────────────────────────────────────────────────────────

/**
 * Get a single message by ID (admin). Marks as read if currently unread.
 */
export async function getMessageById(
  id: string
): Promise<IContactMessage | null> {
  const message = await ContactMessage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { status: 'read' } },
    { new: true }
  );
  return message?.toObject() as IContactMessage | null;
}

/**
 * List messages with pagination, search, filtering, and sorting.
 */
export async function listMessages(
  params: ContactMessageQueryParams
): Promise<PaginatedContactMessages> {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  // Build filter
  const filter: Record<string, unknown> = { isDeleted: false };

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  // Build sort
  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    ContactMessage.countDocuments(filter),
  ]);

  return {
    messages: messages as unknown as IContactMessage[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── Update ────────────────────────────────────────────────────────────

/**
 * Mark a message as read.
 */
export async function markAsRead(
  id: string
): Promise<IContactMessage | null> {
  const message = await ContactMessage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { status: 'read' } },
    { new: true }
  );
  return message?.toObject() as IContactMessage | null;
}

/**
 * Archive a message.
 */
export async function archiveMessage(
  id: string
): Promise<IContactMessage | null> {
  const message = await ContactMessage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { status: 'archived' } },
    { new: true }
  );
  return message?.toObject() as IContactMessage | null;
}

/**
 * Reply to a message. Stores the reply text and metadata.
 * NOTE: Actual email sending is intentionally excluded here.
 *       The architecture supports plugging in an email service later.
 */
export async function replyToMessage(
  id: string,
  data: ReplyContactMessageDTO
): Promise<IContactMessage | null> {
  const message = await ContactMessage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $set: {
        reply: sanitizeString(data.reply),
        repliedBy: sanitizeString(data.repliedBy),
        repliedAt: new Date(),
        status: 'replied',
      },
    },
    { new: true }
  );

  // ── Future: Send email here ──
  // await emailService.send({
  //   to: message.email,
  //   subject: `Re: ${message.subject}`,
  //   body: data.reply,
  // });

  return message?.toObject() as IContactMessage | null;
}

// ─── Delete (Soft) ─────────────────────────────────────────────────────

/**
 * Soft-delete a message (sets isDeleted: true).
 */
export async function softDeleteMessage(
  id: string
): Promise<IContactMessage | null> {
  const message = await ContactMessage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  return message?.toObject() as IContactMessage | null;
}

// ─── Bulk Actions ──────────────────────────────────────────────────────

/**
 * Bulk update status for multiple messages.
 */
export async function bulkUpdateStatus(
  ids: string[],
  status: 'read' | 'archived'
): Promise<{ modifiedCount: number }> {
  const result = await ContactMessage.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { $set: { status } }
  );
  return { modifiedCount: result.modifiedCount };
}

/**
 * Soft-delete multiple messages.
 */
export async function bulkDelete(
  ids: string[]
): Promise<{ deletedCount: number }> {
  const result = await ContactMessage.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { $set: { isDeleted: true } }
  );
  return { deletedCount: result.modifiedCount };
}

// ─── Statistics ────────────────────────────────────────────────────────

/**
 * Get dashboard statistics: total, unread, today's, and this week's counts.
 */
export async function getStats(): Promise<ContactMessageStats> {
  const now = new Date();

  // Start of today (UTC)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // Start of this week (Monday, UTC)
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - ((dayOfWeek + 6) % 7));

  const [total, unread, today, thisWeek] = await Promise.all([
    ContactMessage.countDocuments({ isDeleted: false }),
    ContactMessage.countDocuments({ isDeleted: false, status: 'unread' }),
    ContactMessage.countDocuments({
      isDeleted: false,
      createdAt: { $gte: startOfToday },
    }),
    ContactMessage.countDocuments({
      isDeleted: false,
      createdAt: { $gte: startOfWeek },
    }),
  ]);

  return { total, unread, today, thisWeek };
}

/**
 * Get unread count for the admin navbar badge.
 */
export async function getUnreadCount(): Promise<number> {
  return ContactMessage.countDocuments({ isDeleted: false, status: 'unread' });
}
