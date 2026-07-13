// ─── Research Types ────────────────────────────────────────────

export type ResearchArea =
  | 'Robotics'
  | 'Artificial Intelligence'
  | 'Machine Learning'
  | 'Computer Vision'
  | 'IoT'
  | 'Embedded Systems'
  | 'Automation'
  | 'Drone'
  | 'Biomedical'
  | 'Control Systems'
  | 'Power Electronics'
  | 'Mechanical Design'
  | 'Other';

export type ResearchLevel = 'Undergraduate' | 'Graduate' | 'Faculty' | 'Club' | 'Collaborative';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ResearchStatus =
  | 'proposed'
  | 'literature_review'
  | 'ongoing'
  | 'experimentation'
  | 'paper_writing'
  | 'submitted'
  | 'accepted'
  | 'published'
  | 'completed'
  | 'archived';

export type ResearchType = 'experimental' | 'theoretical' | 'computational' | 'review' | 'survey';

export type Visibility = 'public' | 'members' | 'private';

export type CreatedByType = 'admin' | 'member' | 'faculty';

export type ResearcherRole =
  | 'Principal Investigator'
  | 'Co-Investigator'
  | 'Research Assistant'
  | 'Supervisor'
  | 'Student Researcher';

export type FacultyRole = 'Supervisor' | 'Co-Supervisor' | 'Advisor' | 'Mentor';

export type PublicationType =
  | 'journal_paper'
  | 'conference_paper'
  | 'book'
  | 'book_chapter'
  | 'technical_report'
  | 'patent'
  | 'prototype'
  | 'software'
  | 'dataset';

export type TechCategory =
  | 'Programming'
  | 'Framework'
  | 'Simulation'
  | 'Microcontroller'
  | 'AI Framework'
  | 'Software'
  | 'Database'
  | 'Cloud';

// ─── Sub-schemas ──────────────────────────────────────────────

export interface ImageField {
  url: string;
  alt?: string;
  publicId?: string;
  type?: 'cloudinary' | 'link';
}

export interface Researcher {
  fullName: string;
  designation?: string;
  department?: string;
  session?: string;
  studentId?: string;
  roll?: string;
  email?: string;
  phone?: string;
  profilePhoto?: ImageField;
  orcid?: string;
  googleScholar?: string;
  researchGate?: string;
  linkedin?: string;
  github?: string;
  role?: ResearcherRole;
}

export interface FacultyMember {
  name: string;
  role: FacultyRole;
  department?: string;
  email?: string;
  phone?: string;
  profilePhoto?: ImageField;
}

export interface ResearchTechnology {
  name: string;
  icon?: string;
  category?: TechCategory;
}

export interface ResearchComponent {
  componentId?: string;
  componentName: string;
  quantity?: number;
  specification?: string;
}

export interface Dataset {
  datasetName: string;
  datasetSource?: string;
  datasetURL?: string;
}

export interface Publication {
  title: string;
  authors?: string;
  journal?: string;
  conference?: string;
  publisher?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  year?: number;
  doi?: string;
  isbn?: string;
  url?: string;
  citationCount?: number;
  type?: PublicationType;
}

export interface Funding {
  funded: boolean;
  fundingAgency?: string;
  grantNumber?: string;
  projectBudget?: string;
}

export interface Award {
  awardName: string;
  organizer?: string;
  year?: number;
  certificate?: string;
}

export interface Documentation {
  githubRepo?: string;
  gitlabRepo?: string;
  researchPaper?: string;
  presentation?: string;
  poster?: string;
  report?: string;
  dataset?: string;
  documentation?: string;
  liveDemo?: string;
  youtubePresentation?: string;
}

export interface ResearchSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface ResearchHomepage {
  featured: boolean;
  showOnHomepage: boolean;
  displayOrder: number;
}

export interface ResearchAnalytics {
  views: number;
  downloads: number;
  citations: number;
  bookmarks: number;
}

export interface ResearchApproval {
  adminFeedback?: string;
  approvedBy?: string;
  approvedAt?: Date;
  reviewStatus?: 'pending' | 'under_review' | 'approved' | 'rejected';
}

// ─── Main Research Interface ─────────────────────────────────

export interface IResearch {
  _id: string;

  // Basic Information
  title: string;
  slug: string;
  shortDescription?: string;
  abstract?: string;
  fullDescription?: string;
  summary?: string;
  keywords?: string[];
  researchCode?: string;

  // Media
  coverImage: ImageField;
  galleryImages: ImageField[];
  thumbnail?: ImageField;
  youtubePresentation?: string;
  researchPoster?: ImageField;
  attachments: ImageField[];

  // Research Information
  researchArea?: ResearchArea;
  category?: string;
  subCategory?: string;
  researchType?: ResearchType;
  researchLevel?: ResearchLevel;
  difficulty?: Difficulty;

  // Status
  status: ResearchStatus;

  // Creator
  createdBy?: string;
  createdByType: CreatedByType;

  // Research Team
  researchers: Researcher[];

  // Faculty
  faculty: FacultyMember[];

  // Timeline
  startDate?: Date;
  expectedCompletion?: Date;
  completedAt?: Date;
  publishedAt?: Date;

  // Technologies
  technologies: ResearchTechnology[];

  // Components
  components: ResearchComponent[];

  // Datasets
  datasets: Dataset[];

  // Publications
  publications: Publication[];

  // Funding
  funding: Funding;

  // Awards
  awards: Award[];

  // Documentation
  documentation: Documentation;

  // Visibility
  visibility: Visibility;

  // SEO
  seo: ResearchSEO;

  // Homepage
  homepage: ResearchHomepage;

  // Analytics
  analytics: ResearchAnalytics;

  // Approval
  approval: ResearchApproval;

  // Legacy fields (backward compat)
  technology?: string;
  icon?: string;
  order?: number;
  isActive: boolean;

  // System
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// ─── API DTOs ─────────────────────────────────────────────────

export type CreateResearchDTO = Omit<IResearch, '_id' | 'createdAt' | 'updatedAt' | 'analytics' | 'approval'>;

export type UpdateResearchDTO = Partial<CreateResearchDTO>;

export interface ResearchQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  researchArea?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  researchLevel?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResearch {
  research: IResearch[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
