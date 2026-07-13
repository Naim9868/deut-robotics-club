/**
 * Research Service Layer
 * Contains all business logic for research operations.
 * No HTTP concerns here — pure data operations.
 */

import Research from '@/lib/models/Research';
import type { IResearch, ResearchQueryParams, PaginatedResearch } from '@/lib/types/research';

// ─── Create ────────────────────────────────────────────────────

/**
 * Create a new research entry.
 */
export async function createResearch(data: Record<string, unknown>): Promise<IResearch> {
  const research = await Research.create(data);
  return research.toObject() as IResearch;
}

// ─── Read ──────────────────────────────────────────────────────

/**
 * Get a single research by ID.
 */
export async function getResearchById(id: string): Promise<IResearch | null> {
  const research = await Research.findOne({ _id: id, isDeleted: false });
  return research?.toObject() as IResearch | null;
}

/**
 * Get a single research by slug. Increments view count.
 */
export async function getResearchBySlug(slug: string): Promise<IResearch | null> {
  const research = await Research.findOne({ slug, isDeleted: false });
  if (!research) return null;

  // Increment views
  await Research.findOneAndUpdate({ slug }, { $inc: { 'analytics.views': 1 } });

  return research.toObject() as IResearch;
}

/**
 * List research with pagination, search, filtering, and sorting.
 */
export async function listResearch(params: ResearchQueryParams): Promise<PaginatedResearch> {
  const {
    page = 1,
    limit = 20,
    search = '',
    researchArea = '',
    category = '',
    status = '',
    featured,
    researchLevel = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const filter: Record<string, unknown> = { isDeleted: false };

  if (researchArea) {
    filter.researchArea = researchArea;
  }

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  if (researchLevel) {
    filter.researchLevel = researchLevel;
  }

  if (featured !== undefined) {
    filter['homepage.featured'] = featured;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { abstract: { $regex: search, $options: 'i' } },
      { keywords: { $in: [new RegExp(search, 'i')] } },
      { 'researchers.fullName': { $regex: search, $options: 'i' } },
      { 'technologies.name': { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [research, total] = await Promise.all([
    Research.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Research.countDocuments(filter),
  ]);

  return {
    research: research as unknown as IResearch[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get featured research for homepage.
 */
export async function getFeaturedResearch(limit = 10): Promise<IResearch[]> {
  const items = await Research.find({
    isDeleted: false,
    isActive: true,
    'homepage.featured': true,
    status: { $nin: ['archived'] },
  })
    .sort({ 'homepage.displayOrder': 1, createdAt: -1 })
    .limit(limit)
    .lean();

  return items as unknown as IResearch[];
}

/**
 * Get related research by researchArea, excluding current.
 */
export async function getRelatedResearch(
  researchId: string,
  researchArea: string,
  limit = 4
): Promise<IResearch[]> {
  const items = await Research.find({
    _id: { $ne: researchId },
    isDeleted: false,
    isActive: true,
    researchArea,
    status: { $nin: ['archived'] },
  })
    .sort({ 'homepage.featured': -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return items as unknown as IResearch[];
}

// ─── Update ────────────────────────────────────────────────────

/**
 * Update a research entry by ID.
 */
export async function updateResearch(
  id: string,
  data: Record<string, unknown>
): Promise<IResearch | null> {
  const research = await Research.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: data },
    { new: true, runValidators: true }
  );
  return research?.toObject() as IResearch | null;
}

// ─── Delete (Soft) ─────────────────────────────────────────────

/**
 * Soft-delete a research entry.
 */
export async function softDeleteResearch(id: string): Promise<boolean> {
  const result = await Research.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } }
  );
  return !!result;
}

// ─── Analytics ─────────────────────────────────────────────────

/**
 * Increment research views.
 */
export async function incrementViews(id: string): Promise<void> {
  await Research.findOneAndUpdate({ _id: id, isDeleted: false }, { $inc: { 'analytics.views': 1 } });
}

/**
 * Increment research downloads.
 */
export async function incrementDownloads(id: string): Promise<void> {
  await Research.findOneAndUpdate({ _id: id, isDeleted: false }, { $inc: { 'analytics.downloads': 1 } });
}

// ─── Statistics ────────────────────────────────────────────────

/**
 * Get research statistics for admin dashboard.
 */
export async function getResearchStats(): Promise<{
  total: number;
  ongoing: number;
  completed: number;
  published: number;
  featured: number;
}> {
  const [total, ongoing, completed, published, featured] = await Promise.all([
    Research.countDocuments({ isDeleted: false }),
    Research.countDocuments({ isDeleted: false, status: 'ongoing' }),
    Research.countDocuments({ isDeleted: false, status: 'completed' }),
    Research.countDocuments({ isDeleted: false, status: 'published' }),
    Research.countDocuments({ isDeleted: false, 'homepage.featured': true }),
  ]);

  return { total, ongoing, completed, published, featured };
}
