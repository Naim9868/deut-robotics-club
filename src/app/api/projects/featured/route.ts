import connectDB from '@/lib/mongodb';
import * as projectController from '@/lib/controllers/project.controller';

/**
 * GET /api/projects/featured — Get featured projects (public)
 */
export async function GET() {
  await connectDB();
  return projectController.handleGetFeaturedProjects();
}
