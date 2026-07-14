import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as committeeController from '@/lib/controllers/executive-committee.controller';

/**
 * GET /api/executive-committees/[year]
 * Public: Get committee by year (e.g., /api/executive-committees/2026).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  await connectDB();
  return committeeController.handleGetCommitteeByYear(req, { params });
}
