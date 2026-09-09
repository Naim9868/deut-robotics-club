// ─── Executive Committee Types ─────────────────────────────────

export type CommitteeDesignation =
  | 'President'
  | 'Senior Vice President'
  | 'Vice President'
  | 'General Secretary'
  | 'Asst. General Secretary'
  | 'Joint Secretary'
  | 'Treasurer'
  | 'Organizing Secretary'
  | 'Asst. Organizing Secretary'
  | 'Technical Secretary'
  | 'Research Secretary'
  | 'Publication Secretary'
  | 'Media & Communication Secretary'
  | 'Asst. Media & Communication Secretary'
  | 'Event & Outreach Secretary'
  | 'Media & Publicity Secretary'
  | 'Asst. Media & Publicity Secretary'
  | 'Finance Secretary'
  | 'Asst. Finance Secretary'
  | 'Executive Member'
  | 'Software Development Team Lead'
  | 'Software Development Team Member'
  | 'Hardware Development Team Lead'
  | 'Hardware Development Team Member'
  | 'AI & Robotics Team Lead'
  | 'AI & Robotics Team Member'
  | 'Research & Development Team Lead'
  | 'Research & Development Team Member'
  | 'Design & Multimedia Team Lead'
  | 'Faculty Advisor'
  | 'Advisor'
  | string; // Allow custom positions

/** Image field sub-document */
export interface CommitteeImageField {
  url: string;
  alt: string;
  publicId: string;
}

/** Social links sub-document */
export interface CommitteeSocialLinks {
  facebook: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
}

/** Embedded committee member document */
export interface ICommitteeMember {
  _id?: string;
  fullName: string;
  slug: string;
  profilePhoto: CommitteeImageField;
  coverPhoto: CommitteeImageField;
  designation: string;
  department: string;
  session: string;
  studentId: string;
  shortBio: string;
  fullBiography: string;
  email: string;
  phone: string;
  socialLinks: CommitteeSocialLinks;
  responsibilities: string[];
  achievements: string[];
  messageFromMember: string;
  displayOrder: number;
  featured: boolean;
  isVisible: boolean;
}

/** Main Executive Committee document */
export interface IExecutiveCommittee {
  _id: string;
  committeeYear: number;
  title: string;
  slug: string;
  description: string;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
  members: ICommitteeMember[];
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

/** Create committee DTO */
export type CreateExecutiveCommitteeDTO = Omit<
  IExecutiveCommittee,
  '_id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'isDeleted'
>;

/** Update committee DTO */
export type UpdateExecutiveCommitteeDTO = Partial<CreateExecutiveCommitteeDTO>;

/** Query params for listing committees */
export interface ExecutiveCommitteeQueryParams {
  page?: number;
  limit?: number;
  year?: number;
  search?: string;
  isPublished?: boolean;
  isCurrent?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Paginated response */
export interface PaginatedExecutiveCommittees {
  committees: IExecutiveCommittee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
