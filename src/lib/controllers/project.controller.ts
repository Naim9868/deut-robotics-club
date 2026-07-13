/**
 * Project Controller Layer
 * Handles HTTP request/response for project operations.
 * Delegates business logic to the service layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import * as projectService from '@/lib/services/project.service';

// ─── Admin Controllers ────────────────────────────────────────

/**
 * Handle POST /api/admin/projects — Create a project.
 */
export async function handleCreateProject(req: NextRequest) {
  try {
    const body = await req.json();
    const project = await projectService.createProject(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    console.error('[Project] Create error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create project';
    if (message.includes('duplicate') || message.includes('E11000')) {
      return NextResponse.json({ error: 'A project with this title or ID already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Handle PUT /api/admin/projects/[id] — Update a project.
 */
export async function handleUpdateProject(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const project = await projectService.updateProject(id, body);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error: unknown) {
    console.error('[Project] Update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Handle DELETE /api/admin/projects/[id] — Soft-delete a project.
 */
export async function handleDeleteProject(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = await projectService.softDeleteProject(id);
    if (!success) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error: unknown) {
    console.error('[Project] Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// ─── Public Controllers ───────────────────────────────────────

/**
 * Handle GET /api/projects — List all projects.
 */
export async function handleGetProjects(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    const result = await projectService.listProjects({
      page,
      limit,
      search,
      category,
      status,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Project] List error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

/**
 * Handle GET /api/projects/featured — Get featured projects.
 */
export async function handleGetFeaturedProjects() {
  try {
    const projects = await projectService.getFeaturedProjects(6);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[Project] Featured error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured projects' }, { status: 500 });
  }
}

/**
 * Handle GET /api/projects/[slug] — Get project by slug.
 */
export async function handleGetProjectBySlug(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get related projects
    const related = await projectService.getRelatedProjects(project._id, project.category, 4);

    return NextResponse.json({ project, related });
  } catch (error) {
    console.error('[Project] GetBySlug error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

/**
 * Handle POST /api/projects/[slug]/like — Increment likes.
 */
export async function handleLikeProject(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    await projectService.incrementLikes(project._id);
    return NextResponse.json({ message: 'Liked' });
  } catch (error) {
    console.error('[Project] Like error:', error);
    return NextResponse.json({ error: 'Failed to like project' }, { status: 500 });
  }
}
