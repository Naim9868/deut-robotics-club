/**
 * Executive Committee Controller Layer
 * Handles HTTP request/response for Executive Committee operations.
 * Delegates business logic to the service layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import * as committeeService from '@/lib/services/executive-committee.service';

// ─── Admin Controllers ────────────────────────────────────────

/**
 * POST /api/admin/executive-committees
 * Create a new committee year.
 */
export async function handleCreateCommittee(req: NextRequest) {
  try {
    const body = await req.json();
    const committee = await committeeService.createCommittee(body);
    return NextResponse.json(committee, { status: 201 });
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Create error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create committee';
    if (message.includes('duplicate') || message.includes('E11000')) {
      return NextResponse.json({ error: 'Committee for this year already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/admin/executive-committees
 * List all committees (admin, with filters).
 */
export async function handleAdminListCommittees(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      search: searchParams.get('search') || undefined,
      isPublished: searchParams.get('isPublished') !== null
        ? searchParams.get('isPublished') === 'true'
        : undefined,
      isCurrent: searchParams.get('isCurrent') !== null
        ? searchParams.get('isCurrent') === 'true'
        : undefined,
      sortBy: searchParams.get('sortBy') || 'committeeYear',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const result = await committeeService.listCommittees(params);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Admin list error:', error);
    return NextResponse.json({ error: 'Failed to fetch committees' }, { status: 500 });
  }
}

/**
 * GET /api/admin/executive-committees/[id]
 * Get a single committee by ID (admin).
 */
export async function handleAdminGetCommittee(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const committee = await committeeService.getCommitteeById(id);
    if (!committee) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 });
    }
    return NextResponse.json(committee);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Admin get error:', error);
    return NextResponse.json({ error: 'Failed to fetch committee' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/executive-committees/[id]
 * Update a committee (including members array).
 */
export async function handleUpdateCommittee(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const committee = await committeeService.updateCommittee(id, body);
    if (!committee) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 });
    }
    return NextResponse.json(committee);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update committee';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/executive-committees/[id]
 * Soft-delete a committee.
 */
export async function handleDeleteCommittee(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await committeeService.softDeleteCommittee(id);
    if (!success) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Committee deleted successfully' });
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete committee' }, { status: 500 });
  }
}

/**
 * POST /api/admin/executive-committees/reorder
 * Reorder committees.
 */
export async function handleReorderCommittees(req: NextRequest) {
  try {
    const { updates } = await req.json();
    await committeeService.reorderCommittees(updates);
    return NextResponse.json({ message: 'Order updated' });
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Reorder error:', error);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}

/**
 * POST /api/admin/executive-committees/[id]/publish
 * Toggle publish status.
 */
export async function handleTogglePublish(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isPublished } = await req.json();
    const committee = await committeeService.togglePublish(id, isPublished);
    if (!committee) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 });
    }
    return NextResponse.json(committee);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Publish toggle error:', error);
    return NextResponse.json({ error: 'Failed to update publish status' }, { status: 500 });
  }
}

/**
 * POST /api/admin/executive-committees/[id]/set-current
 * Set a committee as the current committee for its year.
 */
export async function handleSetCurrent(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const committee = await committeeService.setCurrentCommittee(id);
    if (!committee) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 });
    }
    return NextResponse.json(committee);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Set current error:', error);
    return NextResponse.json({ error: 'Failed to set current committee' }, { status: 500 });
  }
}

/**
 * GET /api/admin/executive-committees/stats
 * Get committee statistics.
 */
export async function handleGetStats() {
  try {
    const stats = await committeeService.getCommitteeStats();
    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

// ─── Public Controllers ───────────────────────────────────────

/**
 * GET /api/executive-committees
 * List all published committees.
 */
export async function handleGetPublishedCommittees() {
  try {
    const committees = await committeeService.listPublishedCommittees();
    return NextResponse.json(committees);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Public list error:', error);
    return NextResponse.json({ error: 'Failed to fetch committees' }, { status: 500 });
  }
}

/**
 * GET /api/executive-committees/[year]
 * Get committee by year.
 */
export async function handleGetCommitteeByYear(
  _req: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const committeeYear = parseInt(year);
    if (isNaN(committeeYear)) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
    }
    const committee = await committeeService.getCommitteeByYear(committeeYear);
    if (!committee) {
      return NextResponse.json({ error: 'Committee not found' }, { status: 404 });
    }
    return NextResponse.json(committee);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Get by year error:', error);
    return NextResponse.json({ error: 'Failed to fetch committee' }, { status: 500 });
  }
}

/**
 * GET /api/executive-committees/member/[slug]
 * Get a committee member by slug across all committees.
 */
export async function handleGetMemberBySlug(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = await committeeService.findMemberBySlug(slug);
    if (!result) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[ExecutiveCommittee] Get member by slug error:', error);
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
  }
}
