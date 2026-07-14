import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as focusAreaController from '@/lib/controllers/focus-area.controller';

/**
 * GET /api/focus-areas/[id] — Get focus area by ID or slug (public)
 * PUT /api/focus-areas/[id] — Update focus area (admin)
 * DELETE /api/focus-areas/[id] — Soft-delete focus area (admin)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  return focusAreaController.handleGetFocusArea(req, { params });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  return focusAreaController.handleUpdateFocusArea(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  return focusAreaController.handleDeleteFocusArea(req, { params });
}
