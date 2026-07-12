import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import {
  handleGetApplication,
  handleUpdateStatus,
  handleDeleteApplication,
} from '@/lib/controllers/registration.controller';

/**
 * GET /api/admin/registration/[id] — Get single application (admin)
 * PATCH /api/admin/registration/[id] — Update application status (admin)
 * DELETE /api/admin/registration/[id] — Soft-delete application (admin)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  return handleGetApplication(req, resolvedParams);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  return handleUpdateStatus(req, resolvedParams);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  return handleDeleteApplication(req, resolvedParams);
}
