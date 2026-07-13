import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as projectController from '@/lib/controllers/project.controller';

/**
 * GET /api/projects/[slug] — Get project by slug (public)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  return projectController.handleGetProjectBySlug(req, { params });
}
