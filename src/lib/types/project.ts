// ─── Project Types ────────────────────────────────────────────

export type ProjectStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'ongoing'
  | 'completed'
  | 'archived';

export type ProjectVisibility = 'public' | 'members' | 'private';
export type ProjectCategory = 'COMBAT' | 'AI' | 'AERO' | 'AUTO' | 'OTHER';
export type ProjectType = 'individual' | 'team' | 'club';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CreatedByType = 'admin' | 'member';

// ─── Sub-schemas ──────────────────────────────────────────────

export interface ImageField {
  url: string;
  alt?: string;
  publicId?: string;
  type?: 'cloudinary' | 'link';
}

export interface ProjectTeamMember {
  fullName: string;
  designation?: string;
  department?: string;
  session?: string;
  studentId?: string;
  email?: string;
  phone?: string;
  profilePhoto?: ImageField;
  github?: string;
  linkedin?: string;
  roleInProject?: string;
  isLeader?: boolean;
}

export interface ProjectFaculty {
  advisor?: string;
  coAdvisor?: string;
  mentor?: string;
}

export interface ProjectTechnology {
  name: string;
  icon?: string;
  category?: string;
}

export interface ProjectComponent {
  componentId?: string;
  componentName: string;
  quantity?: number;
  specification?: string;
}

export interface ProjectDocumentation {
  github?: string;
  liveDemo?: string;
  documentation?: string;
  researchPaper?: string;
  presentation?: string;
  report?: string;
  youtubeVideo?: string;
}

export interface ProjectCompetition {
  competitionName?: string;
  organizer?: string;
  award?: string;
  position?: string;
  certificate?: string;
}

export interface ProjectSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface ProjectHomepage {
  featured: boolean;
  showOnHomepage: boolean;
  displayOrder: number;
}

export interface ProjectAnalytics {
  views: number;
  likes: number;
}

export interface ProjectAdmin {
  adminFeedback?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

// ─── Main Project Interface ───────────────────────────────────

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  summary?: string;
  tag: string;

  // Media
  coverImage: ImageField;
  galleryImages: ImageField[];
  thumbnail?: ImageField;
  youtubeVideo?: string;
  attachments: ImageField[];

  // Info
  category: ProjectCategory;
  subCategory?: string;
  projectType: ProjectType;
  difficulty: Difficulty;

  // Creator
  createdBy?: string;
  createdByType: CreatedByType;

  // Team
  team: ProjectTeamMember[];

  // Faculty
  faculty: ProjectFaculty;

  // Technologies
  technologies: ProjectTechnology[];

  // Components
  components: ProjectComponent[];

  // Documentation
  documentation: ProjectDocumentation;

  // Competition
  competition: ProjectCompetition;

  // Status
  status: ProjectStatus;

  // Visibility
  visibility: ProjectVisibility;

  // SEO
  seo: ProjectSEO;

  // Homepage
  homepage: ProjectHomepage;

  // Analytics
  analytics: ProjectAnalytics;

  // Admin
  admin: ProjectAdmin;

  // Legacy fields (kept for backward compat)
  id: string;
  latency: string;
  image: ImageField;
  github?: string;
  demo?: string;
  isActive: boolean;
  order: number;

  // System
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// ─── API DTOs ─────────────────────────────────────────────────

export type CreateProjectDTO = Omit<IProject, '_id' | 'createdAt' | 'updatedAt' | 'analytics' | 'admin'>;

export type UpdateProjectDTO = Partial<CreateProjectDTO>;

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProjects {
  projects: IProject[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
