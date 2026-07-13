/**
 * Registration Controller Layer
 * Handles HTTP request/response mapping for all registration endpoints.
 * Delegates business logic to the Service layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import * as registrationService from '@/lib/services/registration.service';
import * as membershipSettingsService from '@/lib/services/membership-settings.service';
import {
  createRegistrationSchema,
  updateRegistrationStatusSchema,
  addAdminNoteSchema,
  registrationQuerySchema,
  mongoIdSchema,
} from '@/lib/validations/membership';
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

// ═══════════════════════════════════════════════════════════════════
// PUBLIC ENDPOINTS
// ═══════════════════════════════════════════════════════════════════

/**
 * Handle public registration form submission.
 * Includes rate limiting: 3 requests per minute per IP.
 * Checks if registration is open before accepting.
 */
export async function handleCreateRegistration(req: NextRequest) {
  try {
    // Check if registration is open
    const isOpen = await membershipSettingsService.isRegistrationOpen();
    if (!isOpen) {
      return NextResponse.json(
        { error: 'Registration is currently closed. Please check back later.' },
        { status: 403 }
      );
    }

    // Rate limit: 3 per minute per IP
    const ip = getClientIp(req);
    const rl = rateLimit(`registration:${ip}`, 3, 60_000);
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
    const parsed = createRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const application = await registrationService.createApplication(parsed.data, {
      ipAddress: ip,
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      {
        message: 'Registration application submitted successfully',
        data: application,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[Registration] Create error:', error);

    // Mongoose validation error — extract per-field details
    if (error instanceof Error && error.name === 'ValidationError') {
      const mongooseError = error as unknown as {
        errors: Record<string, { path: string; message: string; kind: string }>;
      };
      const fieldErrors: Record<string, string> = {};
      if (mongooseError.errors) {
        for (const [field, err] of Object.entries(mongooseError.errors)) {
          fieldErrors[field] = err.message;
        }
      }
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: error.message,
          fieldErrors,
        },
        { status: 400 }
      );
    }

    // Mongoose cast error (invalid ObjectId, etc.)
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid data format', message: error.message },
        { status: 400 }
      );
    }

    // Duplicate key error
    if (error instanceof Error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate entry', message: 'A record with this data already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit registration. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Check registration status (public).
 * Returns whether registration is open and basic settings.
 */
export async function handleGetRegistrationStatus() {
  try {
    const settings = await membershipSettingsService.getSettings();
    return NextResponse.json({
      registrationOpen: settings.registrationOpen,
      registrationFee: settings.registrationFee,
      paymentMethods: settings.paymentMethods.filter((m) => m.enabled),
      instructions: settings.registrationInstructions,
    });
  } catch (error) {
    console.error('[Registration] Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check registration status' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS
// ═══════════════════════════════════════════════════════════════════

/**
 * List registration applications with pagination, search, filtering, and sorting.
 */
export async function handleListApplications(req: NextRequest) {
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

    const parsed = registrationQuerySchema.safeParse(query);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const result = await registrationService.listApplications(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Registration] List error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

/**
 * Get a single registration application by ID.
 */
export async function handleGetApplication(
  _req: NextRequest,
  params: { id: string }
) {
  try {
    const parsed = mongoIdSchema.safeParse(params);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const application = await registrationService.getApplicationById(parsed.data.id);
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('[Registration] Get error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

/**
 * Update registration application status (approve/reject/etc).
 */
export async function handleUpdateStatus(
  req: NextRequest,
  params: { id: string }
) {
  try {
    const parsedParams = mongoIdSchema.safeParse(params);
    if (!parsedParams.success) {
      return zodErrorResponse(parsedParams.error);
    }

    const body = await req.json();
    const parsedBody = updateRegistrationStatusSchema.safeParse(body);
    if (!parsedBody.success) {
      return zodErrorResponse(parsedBody.error);
    }

    const application = await registrationService.updateApplicationStatus(
      parsedParams.data.id,
      parsedBody.data.status,
      'Admin', // TODO: Extract from JWT token
      parsedBody.data.reason
    );

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Application ${parsedBody.data.status}`,
      data: application,
    });
  } catch (error) {
    console.error('[Registration] UpdateStatus error:', error);
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    );
  }
}

/**
 * Add an admin note to a registration application.
 */
export async function handleAddNote(
  req: NextRequest,
  params: { id: string }
) {
  try {
    const parsedParams = mongoIdSchema.safeParse(params);
    if (!parsedParams.success) {
      return zodErrorResponse(parsedParams.error);
    }

    const body = await req.json();
    const parsedBody = addAdminNoteSchema.safeParse(body);
    if (!parsedBody.success) {
      return zodErrorResponse(parsedBody.error);
    }

    const application = await registrationService.addAdminNote(
      parsedParams.data.id,
      parsedBody.data.note,
      parsedBody.data.addedBy
    );

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Note added successfully',
      data: application,
    });
  } catch (error) {
    console.error('[Registration] AddNote error:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}

/**
 * Soft-delete a registration application.
 */
export async function handleDeleteApplication(
  _req: NextRequest,
  params: { id: string }
) {
  try {
    const parsed = mongoIdSchema.safeParse(params);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const application = await registrationService.softDeleteApplication(parsed.data.id);
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('[Registration] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}

/**
 * Get registration statistics.
 */
export async function handleGetStats() {
  try {
    const stats = await registrationService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[Registration] Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

/**
 * Get payments for verification (all or filtered by status).
 */
export async function handleGetPayments(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status') || undefined;

    const result = await registrationService.getPayments(page, limit, status);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Registration] Payments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
