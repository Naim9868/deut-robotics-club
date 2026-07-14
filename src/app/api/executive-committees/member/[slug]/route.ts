import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as committeeController from '@/lib/controllers/executive-committee.controller';

/**
 * GET /api/executive-committees/member/[slug]
 * Public: Get a committee member by slug across all committees.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  return committeeController.handleGetMemberBySlug(req, { params });
}
