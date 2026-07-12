/**
 * /api/admin/contact/[id]
 * GET    → Fetch single message (marks as read)
 * DELETE → Soft-delete message
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { isAuthenticated } from '@/lib/utils/auth';
import {
  handleGetMessage,
  handleDeleteMessage,
} from '@/lib/controllers/contact-message.controller';

async function requireAdmin(req: NextRequest) {
  const authed = await isAuthenticated(req);
  if (!authed) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  return handleGetMessage(req, { id });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  return handleDeleteMessage(req, { id });
}
