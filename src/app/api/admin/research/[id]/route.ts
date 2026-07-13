import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as researchController from '@/lib/controllers/research.controller';
import Research from '@/lib/models/Research';

/**
 * GET /api/admin/research/[id] — Get research by ID (admin)
 * PUT /api/admin/research/[id] — Update research (admin)
 * DELETE /api/admin/research/[id] — Delete research (admin)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const research = await Research.findOne({ _id: id, isDeleted: false }).lean();
  if (!research) {
    return Response.json({ error: 'Research not found' }, { status: 404 });
  }
  return Response.json(research);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  return researchController.handleUpdateResearch(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  return researchController.handleDeleteResearch(req, { params });
}
