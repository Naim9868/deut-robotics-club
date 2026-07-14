import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as aboutController from '@/lib/controllers/about.controller';

/**
 * GET /api/about/[id]
 * Public: Redirects to singleton endpoint. Kept for backward compatibility.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  return aboutController.handleGetAbout();
}
