import mongoose from 'mongoose';

/**
 * Research Mongoose Schema — Production-ready Research Management System
 * Supports rich researchers, structured technologies, components,
 * publications, datasets, funding, awards, documentation, SEO, analytics, and more.
 */

// ─── Sub-Schemas ──────────────────────────────────────────────

const ImageFieldSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    alt: { type: String, default: '' },
    publicId: { type: String, default: '' },
    type: { type: String, enum: ['cloudinary', 'link'], default: 'cloudinary' },
  },
  { _id: false }
);

const ResearcherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    designation: { type: String, trim: true, default: '', maxlength: 100 },
    department: { type: String, trim: true, default: '', maxlength: 100 },
    session: { type: String, trim: true, default: '', maxlength: 50 },
    studentId: { type: String, trim: true, default: '', maxlength: 50 },
    roll: { type: String, trim: true, default: '', maxlength: 50 },
    email: { type: String, trim: true, default: '', maxlength: 254 },
    phone: { type: String, trim: true, default: '', maxlength: 20 },
    profilePhoto: { type: ImageFieldSchema, default: () => ({}) },
    orcid: { type: String, trim: true, default: '' },
    googleScholar: { type: String, trim: true, default: '' },
    researchGate: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    role: {
      type: String,
      enum: ['Principal Investigator', 'Co-Investigator', 'Research Assistant', 'Supervisor', 'Student Researcher'],
      default: 'Student Researcher',
    },
  },
  { _id: false }
);

const FacultyMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    role: {
      type: String,
      enum: ['Supervisor', 'Co-Supervisor', 'Advisor', 'Mentor'],
      required: true,
    },
    department: { type: String, trim: true, default: '', maxlength: 100 },
    email: { type: String, trim: true, default: '', maxlength: 254 },
    phone: { type: String, trim: true, default: '', maxlength: 20 },
    profilePhoto: { type: ImageFieldSchema, default: () => ({}) },
  },
  { _id: false }
);

const TechnologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    icon: { type: String, trim: true, default: '', maxlength: 50 },
    category: { type: String, trim: true, default: '', maxlength: 50 },
  },
  { _id: false }
);

const ComponentSchema = new mongoose.Schema(
  {
    componentId: { type: String, trim: true, default: '' },
    componentName: { type: String, required: true, trim: true, maxlength: 200 },
    quantity: { type: Number, default: 1, min: 0 },
    specification: { type: String, trim: true, default: '', maxlength: 500 },
  },
  { _id: false }
);

const DatasetSchema = new mongoose.Schema(
  {
    datasetName: { type: String, required: true, trim: true, maxlength: 200 },
    datasetSource: { type: String, trim: true, default: '', maxlength: 200 },
    datasetURL: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const PublicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 500 },
    authors: { type: String, trim: true, default: '', maxlength: 500 },
    journal: { type: String, trim: true, default: '', maxlength: 300 },
    conference: { type: String, trim: true, default: '', maxlength: 300 },
    publisher: { type: String, trim: true, default: '', maxlength: 200 },
    volume: { type: String, trim: true, default: '', maxlength: 50 },
    issue: { type: String, trim: true, default: '', maxlength: 50 },
    pages: { type: String, trim: true, default: '', maxlength: 50 },
    year: { type: Number, min: 1900, max: 2100 },
    doi: { type: String, trim: true, default: '' },
    isbn: { type: String, trim: true, default: '' },
    url: { type: String, trim: true, default: '' },
    citationCount: { type: Number, default: 0, min: 0 },
    type: {
      type: String,
      enum: ['journal_paper', 'conference_paper', 'book', 'book_chapter', 'technical_report', 'patent', 'prototype', 'software', 'dataset'],
      default: 'journal_paper',
    },
  },
  { _id: false }
);

const FundingSchema = new mongoose.Schema(
  {
    funded: { type: Boolean, default: false },
    fundingAgency: { type: String, trim: true, default: '', maxlength: 200 },
    grantNumber: { type: String, trim: true, default: '', maxlength: 100 },
    projectBudget: { type: String, trim: true, default: '', maxlength: 100 },
  },
  { _id: false }
);

const AwardSchema = new mongoose.Schema(
  {
    awardName: { type: String, required: true, trim: true, maxlength: 200 },
    organizer: { type: String, trim: true, default: '', maxlength: 200 },
    year: { type: Number, min: 1900, max: 2100 },
    certificate: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const DocumentationSchema = new mongoose.Schema(
  {
    githubRepo: { type: String, trim: true, default: '' },
    gitlabRepo: { type: String, trim: true, default: '' },
    researchPaper: { type: String, trim: true, default: '' },
    presentation: { type: String, trim: true, default: '' },
    poster: { type: String, trim: true, default: '' },
    report: { type: String, trim: true, default: '' },
    dataset: { type: String, trim: true, default: '' },
    documentation: { type: String, trim: true, default: '' },
    liveDemo: { type: String, trim: true, default: '' },
    youtubePresentation: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const SEOSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, default: '', maxlength: 70 },
    metaDescription: { type: String, trim: true, default: '', maxlength: 160 },
    keywords: [{ type: String, trim: true }],
  },
  { _id: false }
);

const HomepageSchema = new mongoose.Schema(
  {
    featured: { type: Boolean, default: false },
    showOnHomepage: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const AnalyticsSchema = new mongoose.Schema(
  {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    citations: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
  },
  { _id: false }
);

const ApprovalSchema = new mongoose.Schema(
  {
    adminFeedback: { type: String, trim: true, default: '' },
    approvedBy: { type: String, trim: true, default: '' },
    approvedAt: { type: Date, default: null },
    reviewStatus: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────

const ResearchSchema = new mongoose.Schema(
  {
    // ─── Basic Information ─────────────────────────
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [300, 'Slug cannot exceed 300 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    abstract: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Abstract cannot exceed 2000 characters'],
    },
    fullDescription: {
      type: String,
      trim: true,
      default: '',
    },
    summary: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Summary cannot exceed 1000 characters'],
    },
    keywords: [{ type: String, trim: true, maxlength: 50 }],
    researchCode: {
      type: String,
      trim: true,
      default: '',
      maxlength: [50, 'Research code cannot exceed 50 characters'],
    },

    // ─── Media ─────────────────────────────────────
    coverImage: { type: ImageFieldSchema, default: () => ({ url: '', alt: '', type: 'cloudinary' }) },
    galleryImages: [ImageFieldSchema],
    thumbnail: { type: ImageFieldSchema, default: () => ({}) },
    youtubePresentation: { type: String, trim: true, default: '' },
    researchPoster: { type: ImageFieldSchema, default: () => ({}) },
    attachments: [ImageFieldSchema],

    // ─── Research Information ───────────────────────
    researchArea: {
      type: String,
      enum: {
        values: [
          'Robotics', 'Artificial Intelligence', 'Machine Learning',
          'Computer Vision', 'IoT', 'Embedded Systems', 'Automation',
          'Drone', 'Biomedical', 'Control Systems', 'Power Electronics',
          'Mechanical Design', 'Other',
        ],
        message: 'Invalid research area',
      },
      default: 'Robotics',
    },
    category: { type: String, trim: true, default: '', maxlength: 100 },
    subCategory: { type: String, trim: true, default: '', maxlength: 100 },
    researchType: {
      type: String,
      enum: ['experimental', 'theoretical', 'computational', 'review', 'survey'],
      default: 'experimental',
    },
    researchLevel: {
      type: String,
      enum: ['Undergraduate', 'Graduate', 'Faculty', 'Club', 'Collaborative'],
      default: 'Undergraduate',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },

    // ─── Status ────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: [
          'proposed', 'literature_review', 'ongoing', 'experimentation',
          'paper_writing', 'submitted', 'accepted', 'published',
          'completed', 'archived',
        ],
        message: 'Invalid status',
      },
      default: 'ongoing',
    },

    // ─── Creator ───────────────────────────────────
    createdBy: { type: String, trim: true, default: '' },
    createdByType: { type: String, enum: ['admin', 'member', 'faculty'], default: 'admin' },

    // ─── Research Team ─────────────────────────────
    researchers: [ResearcherSchema],

    // ─── Faculty ───────────────────────────────────
    faculty: [FacultyMemberSchema],

    // ─── Timeline ──────────────────────────────────
    startDate: { type: Date, default: null },
    expectedCompletion: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },

    // ─── Technologies ──────────────────────────────
    technologies: [TechnologySchema],

    // ─── Components Used ───────────────────────────
    components: [ComponentSchema],

    // ─── Datasets ──────────────────────────────────
    datasets: [DatasetSchema],

    // ─── Publications ──────────────────────────────
    publications: [PublicationSchema],

    // ─── Funding ───────────────────────────────────
    funding: { type: FundingSchema, default: () => ({}) },

    // ─── Awards ────────────────────────────────────
    awards: [AwardSchema],

    // ─── Documentation ─────────────────────────────
    documentation: { type: DocumentationSchema, default: () => ({}) },

    // ─── Visibility ────────────────────────────────
    visibility: {
      type: String,
      enum: ['public', 'members', 'private'],
      default: 'public',
    },

    // ─── SEO ───────────────────────────────────────
    seo: { type: SEOSchema, default: () => ({}) },

    // ─── Homepage ──────────────────────────────────
    homepage: { type: HomepageSchema, default: () => ({}) },

    // ─── Analytics ─────────────────────────────────
    analytics: { type: AnalyticsSchema, default: () => ({}) },

    // ─── Approval ──────────────────────────────────
    approval: { type: ApprovalSchema, default: () => ({}) },

    // ─── Legacy Fields (backward compat) ───────────
    technology: { type: String, trim: true, default: '' },
    icon: { type: String, trim: true, default: '🔬' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // ─── System ────────────────────────────────────
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────
ResearchSchema.index({ slug: 1 }, { unique: true });
ResearchSchema.index({ 'homepage.featured': -1, order: 1 });
ResearchSchema.index({ researchArea: 1, order: 1 });
ResearchSchema.index({ category: 1, order: 1 });
ResearchSchema.index({ status: 1, isDeleted: 1 });
ResearchSchema.index({ createdBy: 1 });
ResearchSchema.index({ 'researchers.fullName': 1 });
ResearchSchema.index({ createdAt: -1 });
ResearchSchema.index({ keywords: 1 });

// ─── Pre-save: Generate slug from title ───────────────────────
ResearchSchema.pre('save', async function (next) {
  // Generate slug from title if not provided
  if (!this.slug && this.title) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (true) {
      const existing = await mongoose.models.Research.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  next();
});

// ─── Virtual: statusColor ─────────────────────────────────────
ResearchSchema.virtual('statusColor').get(function () {
  const colors: Record<string, string> = {
    proposed: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    literature_review: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    ongoing: 'bg-green-500/15 text-green-400 border border-green-500/20',
    experimentation: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    paper_writing: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
    submitted: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
    accepted: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    published: 'bg-primary/15 text-primary border border-primary/20',
    completed: 'bg-green-500/15 text-green-400 border border-green-500/20',
    archived: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
  };
  return colors[this.status] || colors.ongoing;
});

// ─── Virtual: leadResearcher ──────────────────────────────────
ResearchSchema.virtual('leadResearcher').get(function () {
  return (
    this.researchers.find((r: { role?: string }) => r.role === 'Principal Investigator') ||
    this.researchers[0] ||
    null
  );
});

// ─── Soft-delete middleware ────────────────────────────────────
ResearchSchema.pre('find', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

ResearchSchema.pre('findOne', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

export default mongoose.models.Research || mongoose.model('Research', ResearchSchema);
