import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as researchController from '@/lib/controllers/research.controller';

/**
 * GET /api/admin/research — List all research (admin)
 * POST /api/admin/research — Create research (admin)
 */
export async function GET(req: NextRequest) {
  await connectDB();
  return researchController.handleGetAllResearchAdmin(req);
}

export async function POST(req: NextRequest) {
  await connectDB();
  return researchController.handleCreateResearch(req);
}
