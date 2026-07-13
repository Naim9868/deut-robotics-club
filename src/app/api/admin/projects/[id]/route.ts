import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as projectController from '@/lib/controllers/project.controller';

/**
 * GET /api/admin/projects/[id] — Get project by ID (admin)
 * PUT /api/admin/projects/[id] — Update project (admin)
 * DELETE /api/admin/projects/[id] — Delete project (admin)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const { default: Project } = await import('@/lib/models/Project');
  const project = await Project.findOne({ _id: id, isDeleted: false }).lean();
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 });
  }
  return Response.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  return projectController.handleUpdateProject(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  return projectController.handleDeleteProject(req, { params });
}
