import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as committeeController from '@/lib/controllers/executive-committee.controller';

/**
 * GET /api/admin/executive-committees
 * Admin: List all committees with filters and pagination.
 */
export async function GET(req: NextRequest) {
  await connectDB();
  return committeeController.handleAdminListCommittees(req);
}

/**
 * POST /api/admin/executive-committees
 * Admin: Create a new committee year.
 */
export async function POST(req: NextRequest) {
  await connectDB();
  return committeeController.handleCreateCommittee(req);
}
