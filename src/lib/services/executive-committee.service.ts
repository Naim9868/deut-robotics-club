/**
 * Executive Committee Service Layer
 * Contains all business logic for Executive Committee operations.
 * No HTTP concerns here — pure data operations.
 */

import ExecutiveCommittee from '@/lib/models/ExecutiveCommittee';
import type {
  IExecutiveCommittee,
  ICommitteeMember,
  ExecutiveCommitteeQueryParams,
  PaginatedExecutiveCommittees,
} from '@/lib/types/executive-committee';

// ─── Create ────────────────────────────────────────────────────

export async function createCommittee(
  data: Record<string, unknown>
): Promise<IExecutiveCommittee> {
  const committee = await ExecutiveCommittee.create(data);
  return committee.toObject() as IExecutiveCommittee;
}

// ─── Read ──────────────────────────────────────────────────────

export async function getCommitteeById(
  id: string
): Promise<IExecutiveCommittee | null> {
  const committee = await ExecutiveCommittee.findOne({
    _id: id,
    isDeleted: { $ne: true },
  });
  return (committee?.toObject() as IExecutiveCommittee) || null;
}

export async function getCommitteeBySlug(
  slug: string
): Promise<IExecutiveCommittee | null> {
  const committee = await ExecutiveCommittee.findOne({
    slug,
    isDeleted: { $ne: true },
    isPublished: true,
  });
  return (committee?.toObject() as IExecutiveCommittee) || null;
}

export async function getCommitteeByYear(
  year: number
): Promise<IExecutiveCommittee | null> {
  const committee = await ExecutiveCommittee.findOne({
    committeeYear: year,
    isDeleted: { $ne: true },
    isPublished: true,
  });
  return (committee?.toObject() as IExecutiveCommittee) || null;
}

/**
 * Get all published committees, sorted by year descending.
 */
export async function listPublishedCommittees(): Promise<IExecutiveCommittee[]> {
  const committees = await ExecutiveCommittee.find({
    isDeleted: { $ne: true },
    isPublished: true,
  })
    .sort({ committeeYear: -1, displayOrder: 1 })
    .lean();
  return committees as unknown as IExecutiveCommittee[];
}

/**
 * List committees with pagination and filters (admin).
 */
export async function listCommittees(
  params: ExecutiveCommitteeQueryParams
): Promise<PaginatedExecutiveCommittees> {
  const {
    page = 1,
    limit = 20,
    year,
    search,
    isPublished,
    isCurrent,
    sortBy = 'committeeYear',
    sortOrder = 'desc',
  } = params;

  const filter: Record<string, unknown> = { isDeleted: { $ne: true } };

  if (year) filter.committeeYear = year;
  if (isPublished !== undefined) filter.isPublished = isPublished;
  if (isCurrent !== undefined) filter.isCurrent = isCurrent;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'members.fullName': { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [committees, total] = await Promise.all([
    ExecutiveCommittee.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    ExecutiveCommittee.countDocuments(filter),
  ]);

  return {
    committees: committees as unknown as IExecutiveCommittee[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── Find member by slug across all committees ─────────────────

export async function findMemberBySlug(
  slug: string
): Promise<{ committee: IExecutiveCommittee; member: ICommitteeMember } | null> {
  const committee = await ExecutiveCommittee.findOne({
    'members.slug': slug,
    isDeleted: { $ne: true },
    isPublished: true,
  }).lean();

  if (!committee) return null;

  const typedCommittee = committee as unknown as IExecutiveCommittee;
  const member = typedCommittee.members.find((m) => m.slug === slug);
  if (!member) return null;

  return { committee: typedCommittee, member };
}

// ─── Update ────────────────────────────────────────────────────

export async function updateCommittee(
  id: string,
  data: Record<string, unknown>
): Promise<IExecutiveCommittee | null> {
  const committee = await ExecutiveCommittee.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { $set: data },
    { new: true, runValidators: true }
  );
  return (committee?.toObject() as IExecutiveCommittee) || null;
}

// ─── Delete (Soft) ─────────────────────────────────────────────

export async function softDeleteCommittee(id: string): Promise<boolean> {
  const result = await ExecutiveCommittee.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } }
  );
  return !!result;
}

// ─── Reorder Committees ────────────────────────────────────────

export async function reorderCommittees(
  updates: { id: string; displayOrder: number }[]
): Promise<boolean> {
  const ops = updates.map(({ id, displayOrder }) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { displayOrder } },
    },
  }));

  await ExecutiveCommittee.bulkWrite(ops);
  return true;
}

// ─── Publish / Unpublish ──────────────────────────────────────

export async function togglePublish(
  id: string,
  isPublished: boolean
): Promise<IExecutiveCommittee | null> {
  const committee = await ExecutiveCommittee.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { $set: { isPublished } },
    { new: true }
  );
  return (committee?.toObject() as IExecutiveCommittee) || null;
}

// ─── Set Current Committee ────────────────────────────────────

export async function setCurrentCommittee(
  id: string
): Promise<IExecutiveCommittee | null> {
  const committee = await ExecutiveCommittee.findById(id);
  if (!committee) return null;

  // Unset all other current committees for the same year
  await ExecutiveCommittee.updateMany(
    { _id: { $ne: id }, committeeYear: committee.committeeYear, isCurrent: true },
    { $set: { isCurrent: false } }
  );

  committee.isCurrent = true;
  await committee.save();
  return committee.toObject() as IExecutiveCommittee;
}

// ─── Statistics ────────────────────────────────────────────────

export async function getCommitteeStats(): Promise<{
  total: number;
  published: number;
  current: number;
  totalMembers: number;
  latestYear: number;
}> {
  const [total, published, current, totalMembersResult, latest] =
    await Promise.all([
      ExecutiveCommittee.countDocuments({ isDeleted: { $ne: true } }),
      ExecutiveCommittee.countDocuments({ isDeleted: { $ne: true }, isPublished: true }),
      ExecutiveCommittee.countDocuments({ isDeleted: { $ne: true }, isCurrent: true }),
      ExecutiveCommittee.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        { $project: { memberCount: { $size: '$members' } } },
        { $group: { _id: null, total: { $sum: '$memberCount' } } },
      ]),
      ExecutiveCommittee.findOne({ isDeleted: { $ne: true } })
        .sort({ committeeYear: -1 })
        .select('committeeYear')
        .lean(),
    ]);

  return {
    total,
    published,
    current,
    totalMembers: totalMembersResult[0]?.total || 0,
    latestYear: (latest as any)?.committeeYear || new Date().getFullYear(),
  };
}
