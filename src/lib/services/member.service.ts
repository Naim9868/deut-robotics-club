/**
 * Member Service Layer
 * Contains all business logic for member management operations.
 * No HTTP concerns here — pure data operations.
 */

import Member from '@/lib/models/Member';
import type {
  IMember,
  MemberQueryParams,
  PaginatedMembers,
  MembershipStatus,
} from '@/lib/types/membership';
import { sanitizeString } from '@/lib/utils/sanitize';

// ─── Read ──────────────────────────────────────────────────────

/**
 * Get a single member by ID.
 */
export async function getMemberById(id: string): Promise<IMember | null> {
  const member = await Member.findOne({ _id: id, isDeleted: false })
    .populate('registrationApplication');
  return member?.toObject() as IMember | null;
}

/**
 * Get a member by membershipId (e.g., DRC-2026-001).
 */
export async function getMemberByMembershipId(
  membershipId: string
): Promise<IMember | null> {
  const member = await Member.findOne({ membershipId, isDeleted: false });
  return member?.toObject() as IMember | null;
}

/**
 * List members with pagination, search, filtering, and sorting.
 */
export async function listMembers(
  params: MemberQueryParams
): Promise<PaginatedMembers> {
  const {
    page = 1,
    limit = 10,
    search = '',
    membershipStatus = 'all',
    membershipType = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const filter: Record<string, unknown> = { isDeleted: false };

  if (membershipStatus && membershipStatus !== 'all') {
    filter.membershipStatus = membershipStatus;
  }

  if (membershipType && membershipType !== 'all') {
    filter.membershipType = membershipType;
  }

  if (search) {
    filter.$or = [
      { membershipId: { $regex: search, $options: 'i' } },
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

  const [members, total] = await Promise.all([
    Member.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Member.countDocuments(filter),
  ]);

  return {
    members: members as unknown as IMember[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── Update ────────────────────────────────────────────────────

/**
 * Update member details (personal, university, contact, additional, type).
 */
export async function updateMember(
  id: string,
  data: Partial<{
    personal: Partial<IMember['personal']>;
    university: Partial<IMember['university']>;
    contact: Partial<IMember['contact']>;
    additional: Partial<IMember['additional']>;
    membershipType: string;
  }>
): Promise<IMember | null> {
  const updateData: Record<string, unknown> = {};

  if (data.personal) {
    for (const [key, value] of Object.entries(data.personal)) {
      if (typeof value === 'string') {
        updateData[`personal.${key}`] = sanitizeString(value);
      } else {
        updateData[`personal.${key}`] = value;
      }
    }
  }

  if (data.university) {
    for (const [key, value] of Object.entries(data.university)) {
      if (typeof value === 'string') {
        updateData[`university.${key}`] = sanitizeString(value);
      } else {
        updateData[`university.${key}`] = value;
      }
    }
  }

  if (data.contact) {
    for (const [key, value] of Object.entries(data.contact)) {
      if (typeof value === 'string') {
        updateData[`contact.${key}`] = sanitizeString(value);
      } else {
        updateData[`contact.${key}`] = value;
      }
    }
  }

  if (data.additional) {
    for (const [key, value] of Object.entries(data.additional)) {
      if (typeof value === 'string') {
        updateData[`additional.${key}`] = sanitizeString(value);
      } else if (Array.isArray(value)) {
        updateData[`additional.${key}`] = value.map((v) =>
          typeof v === 'string' ? sanitizeString(v) : v
        );
      } else {
        updateData[`additional.${key}`] = value;
      }
    }
  }

  if (data.membershipType) {
    updateData.membershipType = data.membershipType;
  }

  const member = await Member.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true }
  );

  return member?.toObject() as IMember | null;
}

/**
 * Change membership status (suspend, activate, expire, alumni).
 */
export async function changeMembershipStatus(
  id: string,
  status: MembershipStatus,
  reason?: string
): Promise<IMember | null> {
  const updateData: Record<string, unknown> = {
    membershipStatus: status,
  };

  if (status === 'suspended') {
    updateData.suspendedAt = new Date();
    updateData.suspendedReason = reason || '';
  } else if (status === 'active') {
    updateData.suspendedAt = null;
    updateData.suspendedReason = '';
  }

  const member = await Member.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true }
  );

  return member?.toObject() as IMember | null;
}

// ─── Delete (Soft) ─────────────────────────────────────────────

/**
 * Soft-delete a member.
 */
export async function softDeleteMember(id: string): Promise<IMember | null> {
  const member = await Member.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  return member?.toObject() as IMember | null;
}

// ─── Statistics ────────────────────────────────────────────────

/**
 * Get member statistics for the admin dashboard.
 */
export async function getStats(): Promise<{
  total: number;
  active: number;
  suspended: number;
  expired: number;
  alumni: number;
  thisMonth: number;
}> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, active, suspended, expired, alumni, thisMonth] = await Promise.all([
    Member.countDocuments({ isDeleted: false }),
    Member.countDocuments({ isDeleted: false, membershipStatus: 'active' }),
    Member.countDocuments({ isDeleted: false, membershipStatus: 'suspended' }),
    Member.countDocuments({ isDeleted: false, membershipStatus: 'expired' }),
    Member.countDocuments({ isDeleted: false, membershipStatus: 'alumni' }),
    Member.countDocuments({
      isDeleted: false,
      createdAt: { $gte: startOfMonth },
    }),
  ]);

  return { total, active, suspended, expired, alumni, thisMonth };
}
