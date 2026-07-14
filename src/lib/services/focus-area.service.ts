/**
 * Focus Area Service Layer
 * Contains all business logic for focus area operations.
 * No HTTP concerns here — pure data operations.
 */

import FocusArea from '@/lib/models/FocusArea';
import type { IFocusArea, FocusAreaQueryParams, PaginatedFocusAreas } from '@/lib/types/focus-area';

// ─── Create ────────────────────────────────────────────────────

/**
 * Create a new focus area.
 */
export async function createFocusArea(data: Record<string, unknown>): Promise<IFocusArea> {
  const focusArea = await FocusArea.create(data);
  return focusArea.toObject() as IFocusArea;
}

// ─── Read ──────────────────────────────────────────────────────

/**
 * Get a single focus area by ID.
 */
export async function getFocusAreaById(id: string): Promise<IFocusArea | null> {
  const focusArea = await FocusArea.findOne({ _id: id, isDeleted: false });
  return focusArea?.toObject() as IFocusArea | null;
}

/**
 * Get a single focus area by slug. Increments view count.
 */
export async function getFocusAreaBySlug(slug: string): Promise<IFocusArea | null> {
  const focusArea = await FocusArea.findOne({ slug, isDeleted: false, isActive: true });
  if (!focusArea) return null;

  // Increment views
  await FocusArea.findOneAndUpdate({ slug }, { $inc: { 'analytics.views': 1 } });

  return focusArea.toObject() as IFocusArea;
}

/**
 * Get a single focus area by slug for admin (includes inactive).
 */
export async function getFocusAreaBySlugAdmin(slug: string): Promise<IFocusArea | null> {
  const focusArea = await FocusArea.findOne({ slug, isDeleted: false });
  return focusArea?.toObject() as IFocusArea | null;
}

/**
 * List focus areas with pagination, search, filtering, and sorting.
 */
export async function listFocusAreas(params: FocusAreaQueryParams): Promise<PaginatedFocusAreas> {
  const {
    page = 1,
    limit = 20,
    search = '',
    category = '',
    featured,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const filter: Record<string, unknown> = { isDeleted: false };

  if (category) {
    filter.category = category;
  }

  if (featured !== undefined) {
    filter['homepage.featured'] = featured;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { applications: { $regex: search, $options: 'i' } },
      { skillsRequired: { $regex: search, $options: 'i' } },
      { 'technologies.name': { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [focusAreas, total] = await Promise.all([
    FocusArea.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    FocusArea.countDocuments(filter),
  ]);

  return {
    focusAreas: focusAreas as unknown as IFocusArea[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get all active focus areas for the homepage (no pagination).
 */
export async function getHomepageFocusAreas(): Promise<IFocusArea[]> {
  const focusAreas = await FocusArea.find({
    isDeleted: false,
    isActive: true,
  })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return focusAreas as unknown as IFocusArea[];
}

/**
 * Get featured focus areas for homepage.
 */
export async function getFeaturedFocusAreas(limit = 6): Promise<IFocusArea[]> {
  const focusAreas = await FocusArea.find({
    isDeleted: false,
    isActive: true,
    'homepage.featured': true,
  })
    .sort({ 'homepage.displayOrder': 1, createdAt: -1 })
    .limit(limit)
    .lean();

  return focusAreas as unknown as IFocusArea[];
}

/**
 * Get related focus areas by category, excluding current.
 */
export async function getRelatedFocusAreas(
  focusAreaId: string,
  category: string,
  limit = 4
): Promise<IFocusArea[]> {
  const focusAreas = await FocusArea.find({
    _id: { $ne: focusAreaId },
    isDeleted: false,
    isActive: true,
    category,
  })
    .sort({ 'homepage.featured': -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return focusAreas as unknown as IFocusArea[];
}

// ─── Update ────────────────────────────────────────────────────

/**
 * Update a focus area by ID.
 */
export async function updateFocusArea(
  id: string,
  data: Record<string, unknown>
): Promise<IFocusArea | null> {
  const focusArea = await FocusArea.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: data },
    { new: true, runValidators: true }
  );
  return focusArea?.toObject() as IFocusArea | null;
}

// ─── Delete (Soft) ─────────────────────────────────────────────

/**
 * Soft-delete a focus area.
 */
export async function softDeleteFocusArea(id: string): Promise<boolean> {
  const result = await FocusArea.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } }
  );
  return !!result;
}

// ─── Analytics ─────────────────────────────────────────────────

/**
 * Increment focus area followers.
 */
export async function incrementFollowers(id: string): Promise<void> {
  await FocusArea.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $inc: { 'analytics.followers': 1 } }
  );
}

// ─── Statistics ────────────────────────────────────────────────

/**
 * Get focus area statistics for admin dashboard.
 */
export async function getFocusAreaStats(): Promise<{
  total: number;
  active: number;
  featured: number;
  byCategory: Record<string, number>;
}> {
  const [total, active, featured, categoryStats] = await Promise.all([
    FocusArea.countDocuments({ isDeleted: false }),
    FocusArea.countDocuments({ isDeleted: false, isActive: true }),
    FocusArea.countDocuments({ isDeleted: false, 'homepage.featured': true }),
    FocusArea.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const byCategory: Record<string, number> = {};
  categoryStats.forEach((stat: { _id: string; count: number }) => {
    byCategory[stat._id] = stat.count;
  });

  return { total, active, featured, byCategory };
}
