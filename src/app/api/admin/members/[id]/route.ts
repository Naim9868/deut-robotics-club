import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import {
  handleGetMember,
  handleUpdateMember,
  handleDeleteMember,
} from '@/lib/controllers/member.controller';

/**
 * GET /api/admin/members/[id] — Get single member (admin)
 * PUT /api/admin/members/[id] — Update member details (admin)
 * DELETE /api/admin/members/[id] — Soft-delete member (admin)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  return handleGetMember(req, resolvedParams);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  return handleUpdateMember(req, resolvedParams);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  return handleDeleteMember(req, resolvedParams);
}
