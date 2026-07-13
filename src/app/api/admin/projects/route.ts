import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as projectController from '@/lib/controllers/project.controller';

/**
 * GET /api/admin/projects — List all projects (admin)
 * POST /api/admin/projects — Create a project (admin)
 */
export async function GET(req: NextRequest) {
  await connectDB();
  return projectController.handleGetProjects(req);
}

export async function POST(req: NextRequest) {
  await connectDB();
  return projectController.handleCreateProject(req);
}
