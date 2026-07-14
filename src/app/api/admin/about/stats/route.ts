import connectDB from '@/lib/mongodb';
import * as aboutController from '@/lib/controllers/about.controller';

/**
 * GET /api/admin/about/stats
 * Admin: Get about page statistics.
 */
export async function GET() {
  await connectDB();
  return aboutController.handleGetStats();
}
