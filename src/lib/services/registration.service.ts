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
import { sendPaymentVerifiedEmail, sendPaymentRejectedEmail } from '@/lib/utils/email';

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
 * Get registration applications with payment info for verification.
 * Shows applications that are submitted or pending_verification.
 */
export async function getPayments(
  page = 1,
  limit = 20,
  status?: string
): Promise<{
  payments: unknown[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (status && ['pending', 'verified', 'rejected'].includes(status)) {
    // Map payment verification statuses to registration statuses
    if (status === 'pending') {
      filter.status = { $in: ['submitted', 'pending_payment', 'pending_verification'] };
    } else if (status === 'verified') {
      filter.status = 'approved';
    } else if (status === 'rejected') {
      filter.status = 'rejected';
    }
  } else {
    // No filter — show all non-deleted applications that have payment info
    filter.status = { $nin: ['draft'] };
  }

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    RegistrationApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    RegistrationApplication.countDocuments(filter),
  ]);

  // Shape the data to match the payment verification UI
  const payments = applications.map((app: Record<string, unknown>) => {
    const payment = (app.payment as Record<string, unknown>) || {};
    const personal = (app.personal as Record<string, unknown>) || {};
    const contact = (app.contact as Record<string, unknown>) || {};
    return {
      _id: app._id,
      applicationId: app.applicationId,
      name: personal.fullName,
      email: contact.email,
      phone: contact.phone,
      senderNumber: payment.senderNumber,
      method: payment.method,
      transactionId: payment.transactionId,
      amount: payment.amount,
      screenshot: payment.screenshot,
      status: app.status,
      createdAt: app.createdAt,
    };
  });

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

/**
 * Verify a registration application's payment and send confirmation email.
 */
export async function verifyPayment(
  applicationId: string,
  verifiedBy: string
): Promise<boolean> {
  const application = await RegistrationApplication.findOne({
    _id: applicationId,
    isDeleted: false,
  });

  if (!application) return false;

  // Update status to approved
  application.status = 'approved';
  application.reviewedBy = verifiedBy;
  application.reviewedAt = new Date();

  // Create Member record
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

  // Create Payment record
  await Payment.create({
    registrationApplication: application._id,
    method: application.payment.method,
    transactionId: application.payment.transactionId,
    senderNumber: application.payment.senderNumber,
    amount: application.payment.amount,
    screenshot: application.payment.screenshot,
    verificationStatus: 'verified',
    verifiedBy,
    verifiedAt: new Date(),
  });

  await application.save();

  // Send verification email
  const appObj = application.toObject() as Record<string, unknown>;
  const contactInfo = appObj.contact as { email?: string } | undefined;
  const personalInfo = appObj.personal as { fullName?: string } | undefined;
  if (contactInfo?.email) {
    await sendPaymentVerifiedEmail({
      to: contactInfo.email,
      name: personalInfo?.fullName || 'Member',
      transactionId: application.payment.transactionId,
      amount: application.payment.amount,
      method: application.payment.method,
      membershipId: application.membershipId || undefined,
    });
  }

  return true;
}

/**
 * Reject a registration application's payment and send rejection email.
 */
export async function rejectPayment(
  applicationId: string,
  rejectedBy: string,
  reason: string
): Promise<boolean> {
  const application = await RegistrationApplication.findOne({
    _id: applicationId,
    isDeleted: false,
  });

  if (!application) return false;

  application.status = 'rejected';
  application.reviewedBy = rejectedBy;
  application.reviewedAt = new Date();

  // Add rejection note
  application.adminNotes.push({
    note: `Payment rejected: ${reason}`,
    addedBy: rejectedBy,
    addedAt: new Date(),
  });

  // Create rejected Payment record
  await Payment.create({
    registrationApplication: application._id,
    method: application.payment.method,
    transactionId: application.payment.transactionId,
    senderNumber: application.payment.senderNumber,
    amount: application.payment.amount,
    screenshot: application.payment.screenshot,
    verificationStatus: 'rejected',
    verifiedBy: rejectedBy,
    verifiedAt: new Date(),
    rejectionReason: sanitizeString(reason),
  });

  await application.save();

  // Send rejection email
  const appObj = application.toObject() as Record<string, unknown>;
  const contactInfo = appObj.contact as { email?: string } | undefined;
  const personalInfo = appObj.personal as { fullName?: string } | undefined;
  if (contactInfo?.email) {
    await sendPaymentRejectedEmail({
      to: contactInfo.email,
      name: personalInfo?.fullName || 'Member',
      transactionId: application.payment.transactionId,
      amount: application.payment.amount,
      method: application.payment.method,
      reason,
    });
  }

  return true;
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
