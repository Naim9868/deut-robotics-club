/**
 * ContactMessage Controller Layer
 * Handles HTTP request/response mapping for all contact message endpoints.
 * Delegates business logic to the Service layer.
 *
 * This layer is responsible for:
 * - Parsing and validating request inputs (Zod)
 * - Extracting metadata (IP, User-Agent)
 * - Mapping service results to NextResponse objects
 * - Error formatting
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import * as contactMessageService from '@/lib/services/contact-message.service';
import {
  createContactMessageSchema,
  replyContactMessageSchema,
  contactMessageQuerySchema,
  mongoIdParamSchema,
} from '@/lib/validations/contact-message';
import { getClientIp, rateLimit } from '@/lib/utils/rate-limit';

/** Helper: format ZodError into a user-friendly error response */
function zodErrorResponse(error: ZodError) {
  const details: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const field = issue.path.join('.');
    details[field] = issue.message;
  });
  return NextResponse.json(
    { error: 'Validation failed', details },
    { status: 400 }
  );
}

/** Helper: extract User-Agent header */
function getUserAgent(req: NextRequest): string {
  return req.headers.get('user-agent') || 'unknown';
}

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC ENDPOINT — POST /api/contact
// ═══════════════════════════════════════════════════════════════════════

/**
 * Handle public contact form submission.
 * Includes rate limiting: 5 requests per minute per IP.
 */
export async function handleCreateMessage(req: NextRequest) {
  try {
    // Rate limit: 5 per minute per IP
    const ip = getClientIp(req);
    const rl = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rl.retryAfter,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Validate input
    const parsed = createContactMessageSchema.safeParse(body);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const message = await contactMessageService.createMessage(parsed.data, {
      ipAddress: ip,
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      { message: 'Message sent successfully', data: message },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[ContactMessage] Create error:', error);

    // Mongoose validation error
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINT — GET /api/admin/contact
// ═══════════════════════════════════════════════════════════════════════

/**
 * List messages with pagination, search, filtering, and sorting.
 */
export async function handleListMessages(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    };

    const parsed = contactMessageQuerySchema.safeParse(query);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const result = await contactMessageService.listMessages(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[ContactMessage] List error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINT — GET /api/admin/contact/:id
// ═══════════════════════════════════════════════════════════════════════

/**
 * Get a single message by ID. Marks as read automatically.
 */
export async function handleGetMessage(
  _req: NextRequest,
  params: { id: string }
) {
  try {
    const parsed = mongoIdParamSchema.safeParse(params);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const message = await contactMessageService.getMessageById(parsed.data.id);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('[ContactMessage] Get error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINT — PATCH /api/admin/contact/:id/read
// ═══════════════════════════════════════════════════════════════════════

/**
 * Mark a message as read.
 */
export async function handleMarkAsRead(
  _req: NextRequest,
  params: { id: string }
) {
  try {
    const parsed = mongoIdParamSchema.safeParse(params);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const message = await contactMessageService.markAsRead(parsed.data.id);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Marked as read', data: message });
  } catch (error) {
    console.error('[ContactMessage] MarkRead error:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINT — PATCH /api/admin/contact/:id/archive
// ═══════════════════════════════════════════════════════════════════════

/**
 * Archive a message.
 */
export async function handleArchiveMessage(
  _req: NextRequest,
  params: { id: string }
) {
  try {
    const parsed = mongoIdParamSchema.safeParse(params);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const message = await contactMessageService.archiveMessage(parsed.data.id);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Archived successfully', data: message });
  } catch (error) {
    console.error('[ContactMessage] Archive error:', error);
    return NextResponse.json(
      { error: 'Failed to archive message' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINT — PATCH /api/admin/contact/:id/reply
// ═══════════════════════════════════════════════════════════════════════

/**
 * Reply to a message. Stores reply text and metadata.
 * Email sending is intentionally deferred to a future integration point.
 */
export async function handleReplyMessage(
  req: NextRequest,
  params: { id: string }
) {
  try {
    const parsedParams = mongoIdParamSchema.safeParse(params);
    if (!parsedParams.success) {
      return zodErrorResponse(parsedParams.error);
    }

    const body = await req.json();
    const parsedBody = replyContactMessageSchema.safeParse(body);
    if (!parsedBody.success) {
      return zodErrorResponse(parsedBody.error);
    }

    const message = await contactMessageService.replyToMessage(
      parsedParams.data.id,
      parsedBody.data
    );

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Reply sent successfully', data: message });
  } catch (error) {
    console.error('[ContactMessage] Reply error:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINT — DELETE /api/admin/contact/:id
// ═══════════════════════════════════════════════════════════════════════

/**
 * Soft-delete a message (sets isDeleted: true, never hard-deletes).
 */
export async function handleDeleteMessage(
  _req: NextRequest,
  params: { id: string }
) {
  try {
    const parsed = mongoIdParamSchema.safeParse(params);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const message = await contactMessageService.softDeleteMessage(parsed.data.id);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('[ContactMessage] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS — BULK ACTIONS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Bulk update status for selected messages.
 */
export async function handleBulkStatus(req: NextRequest) {
  try {
    const body = await req.json();
    const { ids, status } = body as { ids: string[]; status: 'read' | 'archived' };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'No message IDs provided' },
        { status: 400 }
      );
    }

    if (!['read', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "read" or "archived"' },
        { status: 400 }
      );
    }

    const result = await contactMessageService.bulkUpdateStatus(ids, status);
    return NextResponse.json({
      message: `${result.modifiedCount} message(s) updated`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('[ContactMessage] BulkStatus error:', error);
    return NextResponse.json(
      { error: 'Failed to update messages' },
      { status: 500 }
    );
  }
}

/**
 * Soft-delete multiple messages.
 */
export async function handleBulkDelete(req: NextRequest) {
  try {
    const body = await req.json();
    const { ids } = body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'No message IDs provided' },
        { status: 400 }
      );
    }

    const result = await contactMessageService.bulkDelete(ids);
    return NextResponse.json({
      message: `${result.deletedCount} message(s) deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('[ContactMessage] BulkDelete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete messages' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS — STATS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Get dashboard statistics for contact messages.
 */
export async function handleGetStats() {
  try {
    const stats = await contactMessageService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[ContactMessage] Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

/**
 * Get unread count for the admin navbar badge.
 */
export async function handleGetUnreadCount() {
  try {
    const count = await contactMessageService.getUnreadCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('[ContactMessage] UnreadCount error:', error);
    return NextResponse.json({ count: 0 });
  }
}
