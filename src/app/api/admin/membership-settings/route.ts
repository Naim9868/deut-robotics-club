import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleGetSettings, handleUpdateSettings } from '@/lib/controllers/membership-settings.controller';

/**
 * GET /api/admin/membership-settings — Get settings (admin)
 * PUT /api/admin/membership-settings — Update settings (admin)
 */
export async function GET() {
  await connectDB();
  return handleGetSettings();
}

export async function PUT(req: NextRequest) {
  await connectDB();
  return handleUpdateSettings(req);
}
