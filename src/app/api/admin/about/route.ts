import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as aboutController from '@/lib/controllers/about.controller';

/**
 * GET /api/admin/about
 * Admin: Get the full About document for editing.
 */
export async function GET() {
  await connectDB();
  return aboutController.handleGetAboutAdmin();
}

/**
 * PUT /api/admin/about
 * Admin: Update the About document (partial update).
 */
export async function PUT(req: NextRequest) {
  await connectDB();
  return aboutController.handleUpdateAbout(req);
}
