import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleCreateRegistration, handleGetRegistrationStatus } from '@/lib/controllers/registration.controller';

/**
 * POST /api/registration — Submit a new registration application (public)
 * GET /api/registration — Check registration status (public)
 */
export async function POST(req: NextRequest) {
  await connectDB();
  return handleCreateRegistration(req);
}

export async function GET(req: NextRequest) {
  await connectDB();
  return handleGetRegistrationStatus();
}
