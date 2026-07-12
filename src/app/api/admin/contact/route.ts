/**
 * GET /api/admin/contact
 * Admin endpoint: List contact messages with pagination, search, filter, sort.
 *
 * POST /api/admin/contact (via bulk routes below)
 * Admin endpoint: Bulk status update and bulk delete.
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { isAuthenticated } from '@/lib/utils/auth';
import {
  handleListMessages,
  handleBulkStatus,
  handleBulkDelete,
  handleGetStats,
  handleGetUnreadCount,
} from '@/lib/controllers/contact-message.controller';

/** Require admin authentication */
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

export async function GET(req: NextRequest) {
  await connectDB();

  const denied = await requireAdmin(req);
  if (denied) return denied;

  // Route to stats or unread-count based on query param
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'stats') return handleGetStats();
  if (action === 'unread-count') return handleGetUnreadCount();

  return handleListMessages(req);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const denied = await requireAdmin(req);
  if (denied) return denied;

  // Route to bulk action based on body
  const clonedReq = req.clone();
  const body = await clonedReq.json().catch(() => ({}));

  if (body.action === 'bulk-status') return handleBulkStatus(req);
  if (body.action === 'bulk-delete') return handleBulkDelete(req);

  return new Response(JSON.stringify({ error: 'Invalid action' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}
