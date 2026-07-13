import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as researchController from '@/lib/controllers/research.controller';

/**
 * GET /api/research/slug/[slug] — Get research by slug (public)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  return researchController.handleGetResearchBySlug(req, { params });
}
