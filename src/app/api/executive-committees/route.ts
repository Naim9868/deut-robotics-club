import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as committeeController from '@/lib/controllers/executive-committee.controller';

/**
 * GET /api/executive-committees
 * Public: List all published committees grouped by year.
 */
export async function GET() {
  await connectDB();
  return committeeController.handleGetPublishedCommittees();
}
