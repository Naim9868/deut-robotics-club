/**
 * Project Service Layer
 * Contains all business logic for project operations.
 * No HTTP concerns here — pure data operations.
 */

import Project from '@/lib/models/Project';
import type { IProject, ProjectQueryParams, PaginatedProjects } from '@/lib/types/project';
import { sanitizeString } from '@/lib/utils/sanitize';

// ─── Create ────────────────────────────────────────────────────

/**
 * Create a new project.
 */
export async function createProject(data: Record<string, unknown>): Promise<IProject> {
  const project = await Project.create(data);
  return project.toObject() as IProject;
}

// ─── Read ──────────────────────────────────────────────────────

/**
 * Get a single project by ID.
 */
export async function getProjectById(id: string): Promise<IProject | null> {
  const project = await Project.findOne({ _id: id, isDeleted: false });
  return project?.toObject() as IProject | null;
}

/**
 * Get a single project by slug.
 */
export async function getProjectBySlug(slug: string): Promise<IProject | null> {
  const project = await Project.findOne({ slug, isDeleted: false });
  if (!project) return null;

  // Increment views
  await Project.findOneAndUpdate({ slug }, { $inc: { 'analytics.views': 1 } });

  return project.toObject() as IProject;
}

/**
 * List projects with pagination, search, filtering, and sorting.
 */
export async function listProjects(params: ProjectQueryParams): Promise<PaginatedProjects> {
  const {
    page = 1,
    limit = 20,
    search = '',
    category = '',
    status = '',
    featured,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const filter: Record<string, unknown> = { isDeleted: false };

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  if (featured !== undefined) {
    filter['homepage.featured'] = featured;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tag: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { 'team.fullName': { $regex: search, $options: 'i' } },
      { 'technologies.name': { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Project.countDocuments(filter),
  ]);

  return {
    projects: projects as unknown as IProject[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get featured projects for homepage.
 */
export async function getFeaturedProjects(limit = 6): Promise<IProject[]> {
  const projects = await Project.find({
    isDeleted: false,
    'homepage.featured': true,
    status: { $in: ['approved', 'completed', 'ongoing'] },
  })
    .sort({ 'homepage.displayOrder': 1, createdAt: -1 })
    .limit(limit)
    .lean();

  return projects as unknown as IProject[];
}

/**
 * Get related projects by category, excluding current project.
 */
export async function getRelatedProjects(
  projectId: string,
  category: string,
  limit = 4
): Promise<IProject[]> {
  const projects = await Project.find({
    _id: { $ne: projectId },
    isDeleted: false,
    category,
    status: { $in: ['approved', 'completed', 'ongoing'] },
  })
    .sort({ 'homepage.featured': -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return projects as unknown as IProject[];
}

// ─── Update ────────────────────────────────────────────────────

/**
 * Update a project by ID.
 */
export async function updateProject(
  id: string,
  data: Record<string, unknown>
): Promise<IProject | null> {
  const project = await Project.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: data },
    { new: true, runValidators: true }
  );
  return project?.toObject() as IProject | null;
}

// ─── Delete (Soft) ─────────────────────────────────────────────

/**
 * Soft-delete a project.
 */
export async function softDeleteProject(id: string): Promise<boolean> {
  const result = await Project.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } }
  );
  return !!result;
}

// ─── Analytics ─────────────────────────────────────────────────

/**
 * Increment project views.
 */
export async function incrementViews(id: string): Promise<void> {
  await Project.findOneAndUpdate({ _id: id, isDeleted: false }, { $inc: { 'analytics.views': 1 } });
}

/**
 * Increment project likes.
 */
export async function incrementLikes(id: string): Promise<void> {
  await Project.findOneAndUpdate({ _id: id, isDeleted: false }, { $inc: { 'analytics.likes': 1 } });
}

// ─── Statistics ────────────────────────────────────────────────

/**
 * Get project statistics for admin dashboard.
 */
export async function getProjectStats(): Promise<{
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  completed: number;
  featured: number;
}> {
  const [total, draft, submitted, approved, completed, featured] = await Promise.all([
    Project.countDocuments({ isDeleted: false }),
    Project.countDocuments({ isDeleted: false, status: 'draft' }),
    Project.countDocuments({ isDeleted: false, status: 'submitted' }),
    Project.countDocuments({ isDeleted: false, status: 'approved' }),
    Project.countDocuments({ isDeleted: false, status: 'completed' }),
    Project.countDocuments({ isDeleted: false, 'homepage.featured': true }),
  ]);

  return { total, draft, submitted, approved, completed, featured };
}
