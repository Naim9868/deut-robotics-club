import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as committeeController from '@/lib/controllers/executive-committee.controller';

/**
 * POST /api/admin/executive-committees/reorder
 * Admin: Reorder committees by updating displayOrder.
 */
export async function POST(req: NextRequest) {
  await connectDB();
  return committeeController.handleReorderCommittees(req);
}
