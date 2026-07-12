import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleChangeStatus } from '@/lib/controllers/member.controller';

/**
 * PATCH /api/admin/members/[id]/status — Change membership status (admin)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  return handleChangeStatus(req, resolvedParams);
}
