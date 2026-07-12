/**
 * POST /api/contact
 * Public endpoint for submitting contact messages.
 * Includes rate limiting (5 req/min per IP) and input validation.
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleCreateMessage } from '@/lib/controllers/contact-message.controller';

export async function POST(req: NextRequest) {
  await connectDB();
  return handleCreateMessage(req);
}
