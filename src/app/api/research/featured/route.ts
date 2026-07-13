import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as researchController from '@/lib/controllers/research.controller';

/**
 * GET /api/research/featured — Get featured research (public)
 */
export async function GET(_req: NextRequest) {
  await connectDB();
  return researchController.handleGetFeaturedResearch();
}
