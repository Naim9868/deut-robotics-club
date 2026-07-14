/**
 * About Controller Layer
 * Handles HTTP request/response for About CMS operations.
 * Delegates business logic to the service layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import * as aboutService from '@/lib/services/about.service';

// ─── Public Controllers ───────────────────────────────────────

/**
 * GET /api/about
 * Public: Get the About page data (enabled sections only).
 */
export async function handleGetAbout() {
  try {
    const data = await aboutService.getPublicAbout();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('[About] Public get error:', error);
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
  }
}

// ─── Admin Controllers ────────────────────────────────────────

/**
 * GET /api/admin/about
 * Admin: Get the full About document for editing.
 */
export async function handleGetAboutAdmin() {
  try {
    const about = await aboutService.getAbout();
    return NextResponse.json(about);
  } catch (error: unknown) {
    console.error('[About] Admin get error:', error);
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/about
 * Admin: Update the About document (partial update).
 */
export async function handleUpdateAbout(req: NextRequest) {
  try {
    const body = await req.json();
    const about = await aboutService.updateAbout(body);
    return NextResponse.json(about);
  } catch (error: unknown) {
    console.error('[About] Update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/about/section
 * Admin: Toggle or update a specific section.
 */
export async function handleUpdateSection(req: NextRequest) {
  try {
    const { sectionKey, ...data } = await req.json();
    if (!sectionKey) {
      return NextResponse.json({ error: 'sectionKey is required' }, { status: 400 });
    }

    // If only isEnabled is provided, toggle the section
    if ('isEnabled' in data && Object.keys(data).length === 1) {
      const about = await aboutService.toggleSection(sectionKey, data.isEnabled);
      return NextResponse.json(about);
    }

    // Otherwise update section content
    const about = await aboutService.updateSectionContent(sectionKey, data);
    return NextResponse.json(about);
  } catch (error: unknown) {
    console.error('[About] Section update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update section';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/about/items
 * Admin: Add an item to a section.
 */
export async function handleAddItem(req: NextRequest) {
  try {
    const { sectionKey, item } = await req.json();
    if (!sectionKey || !item) {
      return NextResponse.json({ error: 'sectionKey and item are required' }, { status: 400 });
    }
    const about = await aboutService.addItem(sectionKey, item);
    return NextResponse.json(about, { status: 201 });
  } catch (error: unknown) {
    console.error('[About] Add item error:', error);
    const message = error instanceof Error ? error.message : 'Failed to add item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/about/items
 * Admin: Update an item in a section.
 */
export async function handleUpdateItem(req: NextRequest) {
  try {
    const { sectionKey, itemId, data } = await req.json();
    if (!sectionKey || !itemId || !data) {
      return NextResponse.json({ error: 'sectionKey, itemId, and data are required' }, { status: 400 });
    }
    const about = await aboutService.updateItem(sectionKey, itemId, data);
    return NextResponse.json(about);
  } catch (error: unknown) {
    console.error('[About] Update item error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/about/items
 * Admin: Remove an item from a section.
 */
export async function handleRemoveItem(req: NextRequest) {
  try {
    const { sectionKey, itemId } = await req.json();
    if (!sectionKey || !itemId) {
      return NextResponse.json({ error: 'sectionKey and itemId are required' }, { status: 400 });
    }
    const about = await aboutService.deleteItem(sectionKey, itemId);
    return NextResponse.json(about);
  } catch (error: unknown) {
    console.error('[About] Remove item error:', error);
    const message = error instanceof Error ? error.message : 'Failed to remove item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/about/reorder-items
 * Admin: Reorder items within a section.
 */
export async function handleReorderItems(req: NextRequest) {
  try {
    const { sectionKey, updates } = await req.json();
    if (!sectionKey || !updates) {
      return NextResponse.json({ error: 'sectionKey and updates are required' }, { status: 400 });
    }
    const about = await aboutService.reorderItems(sectionKey, updates);
    return NextResponse.json(about);
  } catch (error: unknown) {
    console.error('[About] Reorder items error:', error);
    return NextResponse.json({ error: 'Failed to reorder items' }, { status: 500 });
  }
}

/**
 * GET /api/admin/about/stats
 * Admin: Get about page statistics.
 */
export async function handleGetStats() {
  try {
    const stats = await aboutService.getAboutStats();
    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error('[About] Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
