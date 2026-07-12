import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleAddNote } from '@/lib/controllers/registration.controller';

/**
 * POST /api/admin/registration/[id]/notes — Add admin note (admin)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  return handleAddNote(req, resolvedParams);
}
