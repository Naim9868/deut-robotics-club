import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as focusAreaController from '@/lib/controllers/focus-area.controller';

/**
 * GET /api/focus-areas — List focus areas (public)
 * POST /api/focus-areas — Create a focus area (admin)
 */
export async function GET(req: NextRequest) {
  await connectDB();
  return focusAreaController.handleGetFocusAreas(req);
}

export async function POST(req: NextRequest) {
  await connectDB();
  return focusAreaController.handleCreateFocusArea(req);
}
