import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as aboutController from '@/lib/controllers/about.controller';

/**
 * PUT /api/admin/about/section
 * Admin: Toggle or update a specific section.
 */
export async function PUT(req: NextRequest) {
  await connectDB();
  return aboutController.handleUpdateSection(req);
}
