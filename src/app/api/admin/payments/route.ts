import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleGetPayments } from '@/lib/controllers/registration.controller';
import * as registrationService from '@/lib/services/registration.service';

/**
 * GET /api/admin/payments — List registration applications for payment verification
 * PATCH /api/admin/payments — Verify or reject a registration application's payment
 */
export async function GET(req: NextRequest) {
  await connectDB();
  return handleGetPayments(req);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { applicationId, action, reason } = body;

    if (!applicationId || !action) {
      return Response.json(
        { error: 'applicationId and action are required' },
        { status: 400 }
      );
    }

    if (action === 'verify') {
      const success = await registrationService.verifyPayment(applicationId, 'Admin');
      if (!success) {
        return Response.json({ error: 'Application not found' }, { status: 404 });
      }
      return Response.json({ message: 'Payment verified successfully' });
    }

    if (action === 'reject') {
      if (!reason) {
        return Response.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }
      const success = await registrationService.rejectPayment(applicationId, 'Admin', reason);
      if (!success) {
        return Response.json({ error: 'Application not found' }, { status: 404 });
      }
      return Response.json({ message: 'Payment rejected' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[Payments] PATCH error:', error);
    return Response.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
