/**
 * Member Controller Layer
 * Handles HTTP request/response mapping for all member management endpoints.
 * Delegates business logic to the Service layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import * as memberService from '@/lib/services/member.service';
import * as registrationService from '@/lib/services/registration.service';
import {
  updateMemberSchema,
  changeMembershipStatusSchema,
  memberQuerySchema,
  mongoIdSchema,
} from '@/lib/validations/membership';

/** Helper: format ZodError into a user-friendly error response */
function zodErrorResponse(error: import('zod').ZodError) {
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

// ═══════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS
// ═══════════════════════════════════════════════════════════════════

/**
 * List members with pagination, search, filtering, and sorting.
 */
export async function handleListMembers(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
      membershipStatus: searchParams.get('membershipStatus') || undefined,
      membershipType: searchParams.get('membershipType') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    };

    const parsed = memberQuerySchema.safeParse(query);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const result = await memberService.listMembers(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Member] List error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

/**
 * Get a single member by ID.
 */
export async function handleGetMember(
  _req: NextRequest,
  params: { id: string }
) {
  try {
    const parsed = mongoIdSchema.safeParse(params);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const member = await memberService.getMemberById(parsed.data.id);
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('[Member] Get error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

/**
 * Update member details.
 */
export async function handleUpdateMember(
  req: NextRequest,
  params: { id: string }
) {
  try {
    const parsedParams = mongoIdSchema.safeParse(params);
    if (!parsedParams.success) {
      return zodErrorResponse(parsedParams.error);
    }

    const body = await req.json();
    const parsedBody = updateMemberSchema.safeParse(body);
    if (!parsedBody.success) {
      return zodErrorResponse(parsedBody.error);
    }

    const member = await memberService.updateMember(
      parsedParams.data.id,
      parsedBody.data
    );

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Member updated successfully',
      data: member,
    });
  } catch (error) {
    console.error('[Member] Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

/**
 * Change membership status (suspend, activate, expire, alumni).
 */
export async function handleChangeStatus(
  req: NextRequest,
  params: { id: string }
) {
  try {
    const parsedParams = mongoIdSchema.safeParse(params);
    if (!parsedParams.success) {
      return zodErrorResponse(parsedParams.error);
    }

    const body = await req.json();
    const parsedBody = changeMembershipStatusSchema.safeParse(body);
    if (!parsedBody.success) {
      return zodErrorResponse(parsedBody.error);
    }

    const member = await memberService.changeMembershipStatus(
      parsedParams.data.id,
      parsedBody.data.status,
      parsedBody.data.reason
    );

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Member ${parsedBody.data.status}`,
      data: member,
    });
  } catch (error) {
    console.error('[Member] ChangeStatus error:', error);
    return NextResponse.json(
      { error: 'Failed to change member status' },
      { status: 500 }
    );
  }
}

/**
 * Soft-delete a member.
 */
export async function handleDeleteMember(
  _req: NextRequest,
  params: { id: string }
) {
  try {
    const parsed = mongoIdSchema.safeParse(params);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const member = await memberService.softDeleteMember(parsed.data.id);
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('[Member] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}

/**
 * Get member statistics.
 */
export async function handleGetStats() {
  try {
    const stats = await memberService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[Member] Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
