import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleListApplications, handleGetStats } from '@/lib/controllers/registration.controller';

/**
 * GET /api/admin/registration — List registration applications (admin)
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

  return handleListApplications(req);
}
