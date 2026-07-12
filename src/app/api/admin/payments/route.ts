import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { handleGetPendingPayments } from '@/lib/controllers/registration.controller';
import * as registrationService from '@/lib/services/registration.service';

/**
 * GET /api/admin/payments — List pending payments (admin)
 * PATCH /api/admin/payments — Verify or reject a payment (admin)
 */
export async function GET(req: NextRequest) {
  await connectDB();
  return handleGetPendingPayments(req);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { paymentId, action, reason } = body;

    if (!paymentId || !action) {
      return Response.json(
        { error: 'paymentId and action are required' },
        { status: 400 }
      );
    }

    if (action === 'verify') {
      const success = await registrationService.verifyPayment(paymentId, 'Admin');
      if (!success) {
        return Response.json({ error: 'Payment not found' }, { status: 404 });
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
      const success = await registrationService.rejectPayment(paymentId, 'Admin', reason);
      if (!success) {
        return Response.json({ error: 'Payment not found' }, { status: 404 });
      }
      return Response.json({ message: 'Payment rejected' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[Payments] PATCH error:', error);
    return Response.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
