import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as committeeController from '@/lib/controllers/executive-committee.controller';

/**
 * GET /api/admin/executive-committees/[id]
 * Admin: Get a single committee by ID.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  return committeeController.handleAdminGetCommittee(req, { params });
}

/**
 * PUT /api/admin/executive-committees/[id]
 * Admin: Update a committee (including embedded members).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  return committeeController.handleUpdateCommittee(req, { params });
}

/**
 * DELETE /api/admin/executive-committees/[id]
 * Admin: Soft-delete a committee.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  return committeeController.handleDeleteCommittee(req, { params });
}
