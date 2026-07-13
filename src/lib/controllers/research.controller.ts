/**
 * Research Controller Layer
 * Handles HTTP request/response for research operations.
 * Delegates business logic to the service layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import * as researchService from '@/lib/services/research.service';

// ─── Admin Controllers ────────────────────────────────────────

/**
 * Handle POST /api/admin/research — Create research.
 */
export async function handleCreateResearch(req: NextRequest) {
  try {
    const body = await req.json();
    const research = await researchService.createResearch(body);
    return NextResponse.json(research, { status: 201 });
  } catch (error: unknown) {
    console.error('[Research] Create error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create research';
    if (message.includes('duplicate') || message.includes('E11000')) {
      return NextResponse.json({ error: 'A research entry with this title already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Handle PUT /api/admin/research/[id] — Update research.
 */
export async function handleUpdateResearch(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const research = await researchService.updateResearch(id, body);
    if (!research) {
      return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }
    return NextResponse.json(research);
  } catch (error: unknown) {
    console.error('[Research] Update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update research';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Handle DELETE /api/admin/research/[id] — Soft-delete research.
 */
export async function handleDeleteResearch(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = await researchService.softDeleteResearch(id);
    if (!success) {
      return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Research deleted' });
  } catch (error: unknown) {
    console.error('[Research] Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete research' }, { status: 500 });
  }
}

// ─── Public Controllers ───────────────────────────────────────

/**
 * Handle GET /api/research — List research (public).
 */
export async function handleGetResearch(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const researchArea = searchParams.get('researchArea') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const researchLevel = searchParams.get('researchLevel') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const featuredParam = searchParams.get('featured');
    const featured = featuredParam !== null ? featuredParam === 'true' : undefined;

    const result = await researchService.listResearch({
      page,
      limit,
      search,
      researchArea,
      category,
      status,
      researchLevel,
      featured,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Research] List error:', error);
    return NextResponse.json({ error: 'Failed to fetch research' }, { status: 500 });
  }
}

/**
 * Handle GET /api/research/featured — Get featured research.
 */
export async function handleGetFeaturedResearch() {
  try {
    const items = await researchService.getFeaturedResearch(10);
    return NextResponse.json(items);
  } catch (error) {
    console.error('[Research] Featured error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured research' }, { status: 500 });
  }
}

/**
 * Handle GET /api/research/slug/[slug] — Get research by slug.
 */
export async function handleGetResearchBySlug(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const research = await researchService.getResearchBySlug(slug);
    if (!research) {
      return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }

    // Get related research
    const related = await researchService.getRelatedResearch(
      research._id,
      research.researchArea || 'Robotics',
      4
    );

    return NextResponse.json({ research, related });
  } catch (error) {
    console.error('[Research] GetBySlug error:', error);
    return NextResponse.json({ error: 'Failed to fetch research' }, { status: 500 });
  }
}

/**
 * Handle GET /api/admin/research — List all research (admin).
 */
export async function handleGetAllResearchAdmin(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    const result = await researchService.listResearch({
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Research] Admin list error:', error);
    return NextResponse.json({ error: 'Failed to fetch research' }, { status: 500 });
  }
}
