import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleListMembers, handleGetStats } from '@/lib/controllers/member.controller';

/**
 * GET /api/admin/members — List members (admin)
 * Supports: pagination, search, filtering, sorting
 * Query: ?action=stats for dashboard statistics
 */
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'stats') {
    return handleGetStats();
  }

  return handleListMembers(req);
}
