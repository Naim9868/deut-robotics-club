// ─── Focus Area Types ─────────────────────────────────────────

export type FocusAreaIconType = 'lucide' | 'image';

export type FocusAreaCategory =
  | 'Robotics'
  | 'Artificial Intelligence'
  | 'Machine Learning'
  | 'Computer Vision'
  | 'Embedded Systems'
  | 'IoT'
  | 'Drone'
  | 'Automation'
  | 'Biomedical Robotics'
  | 'Control Systems'
  | 'Power Electronics'
  | 'Mechanical Design'
  | 'Other';

export type ResearchLevel = 'beginner' | 'intermediate' | 'advanced' | 'research';

export type FocusAreaVisibility = 'public' | 'members' | 'private';

export type LearningResourceType =
  | 'book'
  | 'documentation'
  | 'github'
  | 'youtube'
  | 'research_paper'
  | 'tutorial'
  | 'course';

export type TechnologyCategory =
  | 'Programming Language'
  | 'Framework'
  | 'Microcontroller'
  | 'Simulation'
  | 'Cloud'
  | 'Database'
  | 'Hardware'
  | 'Software';

// ─── Sub-interfaces ───────────────────────────────────────────

export interface ImageField {
  url: string;
  alt?: string;
  publicId?: string;
  type?: 'cloudinary' | 'link';
}

export interface FocusAreaTechnology {
  name: string;
  icon?: string;
  category?: string;
}

export interface FocusAreaComponent {
  componentName: string;
  specification?: string;
  quantity?: number;
  inventoryReference?: string;
}

export interface FocusAreaLearningResource {
  title: string;
  url: string;
  type: LearningResourceType;
  description?: string;
}

export interface FocusAreaSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface FocusAreaHomepage {
  featured: boolean;
  showOnHomepage: boolean;
  displayOrder: number;
}

export interface FocusAreaAnalytics {
  views: number;
  followers: number;
}

export interface FocusAreaStatistics {
  totalProjects: number;
  totalResearch: number;
  totalMembers: number;
  totalAwards: number;
}

export interface FocusAreaFaculty {
  facultyAdvisor?: string;
  mentors?: string[];
  industryMentors?: string[];
}

export interface FocusAreaRelatedContent {
  projects: string[];
  research: string[];
  events: string[];
  workshops: string[];
  competitions: string[];
  members: string[];
}

// ─── Main Interface ───────────────────────────────────────────

export interface IFocusArea {
  _id: string;

  // Basic Information
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  summary: string;

  // Media
  icon: string;
  iconType: FocusAreaIconType;
  coverImage: ImageField;
  galleryImages: ImageField[];
  bannerImage: ImageField;
  thumbnail: ImageField;
  color: string;

  // Classification
  category: FocusAreaCategory;
  subCategory: string;
  researchLevel: ResearchLevel;

  // Overview
  vision: string;
  mission: string;
  objectives: string[];

  // Technologies
  technologies: FocusAreaTechnology[];

  // Hardware & Components
  components: FocusAreaComponent[];

  // Applications
  applications: string[];

  // Skills Required
  skillsRequired: string[];

  // Learning Resources
  learningResources: FocusAreaLearningResource[];

  // Related Content
  relatedContent: FocusAreaRelatedContent;

  // Faculty & Mentors
  faculty: FocusAreaFaculty;

  // Statistics
  statistics: FocusAreaStatistics;

  // Homepage
  homepage: FocusAreaHomepage;

  // Visibility
  visibility: FocusAreaVisibility;

  // SEO
  seo: FocusAreaSEO;

  // Analytics
  analytics: FocusAreaAnalytics;

  // System
  isActive: boolean;
  order: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API DTOs ─────────────────────────────────────────────────

export type CreateFocusAreaDTO = Omit<IFocusArea, '_id' | 'createdAt' | 'updatedAt' | 'analytics'>;

export type UpdateFocusAreaDTO = Partial<CreateFocusAreaDTO>;

export interface FocusAreaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedFocusAreas {
  focusAreas: IFocusArea[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
