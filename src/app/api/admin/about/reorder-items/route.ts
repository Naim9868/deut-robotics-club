import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as aboutController from '@/lib/controllers/about.controller';

/**
 * POST /api/admin/about/reorder-items
 * Admin: Reorder items within a section.
 */
export async function POST(req: NextRequest) {
  await connectDB();
  return aboutController.handleReorderItems(req);
}
