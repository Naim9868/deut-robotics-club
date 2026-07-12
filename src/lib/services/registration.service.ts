/**
 * RegistrationApplication Service Layer
 * Contains all business logic for registration application operations.
 * No HTTP concerns here — pure data operations.
 */

import RegistrationApplication from '@/lib/models/RegistrationApplication';
import * as membershipSettingsService from '@/lib/services/membership-settings.service';
import Payment from '@/lib/models/Payment';
import type {
  CreateRegistrationDTO,
  RegistrationQueryParams,
  PaginatedRegistrations,
  IRegistrationApplication,
  RegistrationStatus,
} from '@/lib/types/membership';
import { sanitizeString } from '@/lib/utils/sanitize';

// ─── Create ────────────────────────────────────────────────────

/**
 * Create a new registration application from a public form submission.
 * Automatically sets status to 'submitted' and generates applicationId via pre-save hook.
 */
export async function createApplication(
  data: CreateRegistrationDTO,
  meta: { ipAddress: string; userAgent: string }
): Promise<IRegistrationApplication> {
  const application = await RegistrationApplication.create({
    personal: {
      ...data.personal,
      fullName: sanitizeString(data.personal.fullName),
    },
    university: {
      ...data.university,
      studentId: sanitizeString(data.university.studentId),
      department: sanitizeString(data.university.department),
      session: sanitizeString(data.university.session),
      semester: sanitizeString(data.university.semester),
    },
    contact: {
      ...data.contact,
      email: sanitizeString(data.contact.email).toLowerCase(),
      phone: sanitizeString(data.contact.phone),
      emergencyContact: sanitizeString(data.contact.emergencyContact),
      address: sanitizeString(data.contact.address),
    },
    payment: {
      ...data.payment,
      method: sanitizeString(data.payment.method),
      transactionId: sanitizeString(data.payment.transactionId),
      senderNumber: sanitizeString(data.payment.senderNumber),
    },
    additional: {
      ...data.additional,
      skills: data.additional.skills.map((s) => sanitizeString(s)),
      interests: data.additional.interests.map((s) => sanitizeString(s)),
      previousExperience: sanitizeString(data.additional.previousExperience),
      motivation: sanitizeString(data.additional.motivation),
    },
    status: 'submitted',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return application.toObject() as IRegistrationApplication;
}

// ─── Read ──────────────────────────────────────────────────────

/**
 * Get a single application by ID.
 */
export async function getApplicationById(
  id: string
): Promise<IRegistrationApplication | null> {
  const application = await RegistrationApplication.findOne({
    _id: id,
    isDeleted: false,
  });
  return application?.toObject() as IRegistrationApplication | null;
}

/**
 * List applications with pagination, search, filtering, and sorting.
 */
export async function listApplications(
  params: RegistrationQueryParams
): Promise<PaginatedRegistrations> {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const filter: Record<string, unknown> = { isDeleted: false };

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { applicationId: { $regex: search, $options: 'i' } },
      { 'personal.fullName': { $regex: search, $options: 'i' } },
      { 'contact.email': { $regex: search, $options: 'i' } },
      { 'university.studentId': { $regex: search, $options: 'i' } },
      { 'university.department': { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    RegistrationApplication.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    RegistrationApplication.countDocuments(filter),
  ]);

  return {
    applications: applications as unknown as IRegistrationApplication[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── Update Status ─────────────────────────────────────────────

/**
 * Update the status of a registration application.
 * When approving, creates a Member record and Payment record.
 */
export async function updateApplicationStatus(
  id: string,
  status: RegistrationStatus,
  reviewedBy: string,
  reason?: string
): Promise<IRegistrationApplication | null> {
  const application = await RegistrationApplication.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!application) return null;

  // If rejecting, add rejection note
  if (status === 'rejected' && reason) {
    application.adminNotes.push({
      note: `Rejection reason: ${reason}`,
      addedBy: reviewedBy,
      addedAt: new Date(),
    });
  }

  application.status = status;
  application.reviewedBy = reviewedBy;
  application.reviewedAt = new Date();

  // If approved, create Member record
  if (status === 'approved') {
    const Member = (await import('@/lib/models/Member')).default;
    const settings = await membershipSettingsService.getSettings();

    const member = await Member.create({
      registrationApplication: application._id,
      personal: application.personal,
      university: application.university,
      contact: application.contact,
      additional: application.additional,
      membershipStatus: 'active',
      membershipType: 'regular',
      joinedAt: new Date(),
      expiresAt: new Date(
        Date.now() + settings.membershipDurationMonths * 30 * 24 * 60 * 60 * 1000
      ),
    });

    application.membershipId = (member.toObject() as { membershipId: string }).membershipId;

    // Also create Payment record
    await Payment.create({
      registrationApplication: application._id,
      method: application.payment.method,
      transactionId: application.payment.transactionId,
      senderNumber: application.payment.senderNumber,
      amount: application.payment.amount,
      screenshot: application.payment.screenshot,
      verificationStatus: 'verified',
      verifiedBy: reviewedBy,
      verifiedAt: new Date(),
    });
  }

  await application.save();
  return application.toObject() as IRegistrationApplication;
}

// ─── Admin Notes ───────────────────────────────────────────────

/**
 * Add an admin note to an application.
 */
export async function addAdminNote(
  id: string,
  note: string,
  addedBy: string
): Promise<IRegistrationApplication | null> {
  const application = await RegistrationApplication.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $push: {
        adminNotes: {
          note: sanitizeString(note),
          addedBy: sanitizeString(addedBy),
          addedAt: new Date(),
        },
      },
    },
    { new: true }
  );
  return application?.toObject() as IRegistrationApplication | null;
}

// ─── Payment Verification ──────────────────────────────────────

/**
 * Verify a payment record.
 */
export async function verifyPayment(
  paymentId: string,
  verifiedBy: string
): Promise<boolean> {
  const result = await Payment.findOneAndUpdate(
    { _id: paymentId, isDeleted: false },
    {
      $set: {
        verificationStatus: 'verified',
        verifiedBy,
        verifiedAt: new Date(),
      },
    }
  );
  return !!result;
}

/**
 * Reject a payment record.
 */
export async function rejectPayment(
  paymentId: string,
  rejectedBy: string,
  reason: string
): Promise<boolean> {
  const result = await Payment.findOneAndUpdate(
    { _id: paymentId, isDeleted: false },
    {
      $set: {
        verificationStatus: 'rejected',
        verifiedBy: rejectedBy,
        verifiedAt: new Date(),
        rejectionReason: sanitizeString(reason),
      },
    }
  );
  return !!result;
}

/**
 * Get all pending payments with application details.
 */
export async function getPendingPayments(
  page = 1,
  limit = 20
): Promise<{
  payments: unknown[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> {
  const filter = { isDeleted: false, verificationStatus: 'pending' as const };
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('registrationApplication')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── Delete (Soft) ─────────────────────────────────────────────

/**
 * Soft-delete an application.
 */
export async function softDeleteApplication(
  id: string
): Promise<IRegistrationApplication | null> {
  const application = await RegistrationApplication.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  return application?.toObject() as IRegistrationApplication | null;
}

// ─── Statistics ────────────────────────────────────────────────

/**
 * Get registration statistics for the admin dashboard.
 */
export async function getStats(): Promise<{
  total: number;
  submitted: number;
  pendingVerification: number;
  approved: number;
  rejected: number;
  today: number;
}> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [total, submitted, pendingVerification, approved, rejected, today] =
    await Promise.all([
      RegistrationApplication.countDocuments({ isDeleted: false }),
      RegistrationApplication.countDocuments({ isDeleted: false, status: 'submitted' }),
      RegistrationApplication.countDocuments({
        isDeleted: false,
        status: 'pending_verification',
      }),
      RegistrationApplication.countDocuments({ isDeleted: false, status: 'approved' }),
      RegistrationApplication.countDocuments({ isDeleted: false, status: 'rejected' }),
      RegistrationApplication.countDocuments({
        isDeleted: false,
        createdAt: { $gte: startOfToday },
      }),
    ]);

  return { total, submitted, pendingVerification, approved, rejected, today };
}
