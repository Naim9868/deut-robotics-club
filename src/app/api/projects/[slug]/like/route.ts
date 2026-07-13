import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as projectController from '@/lib/controllers/project.controller';

/**
 * POST /api/projects/[slug]/like — Increment project likes (public)
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  return projectController.handleLikeProject(req, { params });
}
