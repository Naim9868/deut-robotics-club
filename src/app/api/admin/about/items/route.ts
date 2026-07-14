import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as aboutController from '@/lib/controllers/about.controller';

/**
 * POST /api/admin/about/items
 * Admin: Add an item to a section.
 */
export async function POST(req: NextRequest) {
  await connectDB();
  return aboutController.handleAddItem(req);
}

/**
 * PUT /api/admin/about/items
 * Admin: Update an item in a section.
 */
export async function PUT(req: NextRequest) {
  await connectDB();
  return aboutController.handleUpdateItem(req);
}

/**
 * DELETE /api/admin/about/items
 * Admin: Remove an item from a section.
 */
export async function DELETE(req: NextRequest) {
  await connectDB();
  return aboutController.handleRemoveItem(req);
}
