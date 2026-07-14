/**
 * Focus Area Controller Layer
 * Handles HTTP request/response for focus area operations.
 * Delegates business logic to the service layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import * as focusAreaService from '@/lib/services/focus-area.service';

// ─── Admin Controllers ────────────────────────────────────────

/**
 * Handle POST /api/focus-areas — Create a focus area.
 */
export async function handleCreateFocusArea(req: NextRequest) {
  try {
    const body = await req.json();
    const focusArea = await focusAreaService.createFocusArea(body);
    return NextResponse.json(focusArea, { status: 201 });
  } catch (error: unknown) {
    console.error('[FocusArea] Create error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create focus area';
    if (message.includes('duplicate') || message.includes('E11000')) {
      return NextResponse.json({ error: 'A focus area with this title already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Handle PUT /api/focus-areas/[id] — Update a focus area.
 */
export async function handleUpdateFocusArea(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const focusArea = await focusAreaService.updateFocusArea(id, body);
    if (!focusArea) {
      return NextResponse.json({ error: 'Focus area not found' }, { status: 404 });
    }
    return NextResponse.json(focusArea);
  } catch (error: unknown) {
    console.error('[FocusArea] Update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update focus area';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Handle DELETE /api/focus-areas/[id] — Soft-delete a focus area.
 */
export async function handleDeleteFocusArea(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await focusAreaService.softDeleteFocusArea(id);
    if (!success) {
      return NextResponse.json({ error: 'Focus area not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Focus area deleted' });
  } catch (error: unknown) {
    console.error('[FocusArea] Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete focus area' }, { status: 500 });
  }
}

// ─── Public Controllers ───────────────────────────────────────

/**
 * Handle GET /api/focus-areas — List all focus areas (public).
 * Supports query params: page, limit, search, category, featured, sortBy, sortOrder
 */
export async function handleGetFocusAreas(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Check if this is a simple list request (no pagination params)
    const hasPageParam = searchParams.has('page');
    const hasLimitParam = searchParams.has('limit');

    if (!hasPageParam && !hasLimitParam && !searchParams.has('search') && !searchParams.has('category')) {
      // Simple list for homepage/cards — return all active
      const focusAreas = await focusAreaService.getHomepageFocusAreas();
      return NextResponse.json(focusAreas);
    }

    // Paginated list
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'order';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';

    const result = await focusAreaService.listFocusAreas({
      page,
      limit,
      search,
      category,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[FocusArea] List error:', error);
    return NextResponse.json({ error: 'Failed to fetch focus areas' }, { status: 500 });
  }
}

/**
 * Handle GET /api/focus-areas/featured — Get featured focus areas.
 */
export async function handleGetFeaturedFocusAreas() {
  try {
    const focusAreas = await focusAreaService.getFeaturedFocusAreas(6);
    return NextResponse.json(focusAreas);
  } catch (error) {
    console.error('[FocusArea] Featured error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured focus areas' }, { status: 500 });
  }
}

/**
 * Handle GET /api/focus-areas/[id] — Get focus area by ID or slug.
 * Detects whether the identifier is a MongoDB ObjectId (24-char hex) or a slug.
 * When accessed by slug (public page), returns related focus areas too.
 */
export async function handleGetFocusArea(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: identifier } = await params;

    // Detect if identifier is a MongoDB ObjectId (24-char hex string)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    let focusArea;
    if (isObjectId) {
      focusArea = await focusAreaService.getFocusAreaById(identifier);
    } else {
      focusArea = await focusAreaService.getFocusAreaBySlug(identifier);
    }

    if (!focusArea) {
      return NextResponse.json({ error: 'Focus area not found' }, { status: 404 });
    }

    // If accessed by slug (public page), include related focus areas
    if (!isObjectId) {
      const related = await focusAreaService.getRelatedFocusAreas(
        focusArea._id,
        focusArea.category,
        4
      );
      return NextResponse.json({ focusArea, related });
    }

    // If accessed by ID (admin), return the focus area directly
    return NextResponse.json(focusArea);
  } catch (error) {
    console.error('[FocusArea] Get error:', error);
    return NextResponse.json({ error: 'Failed to fetch focus area' }, { status: 500 });
  }
}
