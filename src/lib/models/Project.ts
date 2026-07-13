import mongoose from 'mongoose';

/**
 * Project Mongoose Schema — Production-ready Project Management System
 * Supports rich team members, structured technologies, components,
 * documentation, competition info, SEO, analytics, and more.
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

const TeamMemberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    designation: { type: String, trim: true, default: '', maxlength: 100 },
    department: { type: String, trim: true, default: '', maxlength: 100 },
    session: { type: String, trim: true, default: '', maxlength: 50 },
    studentId: { type: String, trim: true, default: '', maxlength: 50 },
    email: { type: String, trim: true, default: '', maxlength: 254 },
    phone: { type: String, trim: true, default: '', maxlength: 20 },
    profilePhoto: { type: ImageFieldSchema, default: () => ({}) },
    github: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    roleInProject: { type: String, trim: true, default: '', maxlength: 100 },
    isLeader: { type: Boolean, default: false },
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

const DocumentationSchema = new mongoose.Schema(
  {
    github: { type: String, trim: true, default: '' },
    liveDemo: { type: String, trim: true, default: '' },
    documentation: { type: String, trim: true, default: '' },
    researchPaper: { type: String, trim: true, default: '' },
    presentation: { type: String, trim: true, default: '' },
    report: { type: String, trim: true, default: '' },
    youtubeVideo: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const CompetitionSchema = new mongoose.Schema(
  {
    competitionName: { type: String, trim: true, default: '', maxlength: 200 },
    organizer: { type: String, trim: true, default: '', maxlength: 200 },
    award: { type: String, trim: true, default: '', maxlength: 200 },
    position: { type: String, trim: true, default: '', maxlength: 100 },
    certificate: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const FacultySchema = new mongoose.Schema(
  {
    advisor: { type: String, trim: true, default: '', maxlength: 200 },
    coAdvisor: { type: String, trim: true, default: '', maxlength: 200 },
    mentor: { type: String, trim: true, default: '', maxlength: 200 },
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
    likes: { type: Number, default: 0 },
  },
  { _id: false }
);

const AdminSchema = new mongoose.Schema(
  {
    adminFeedback: { type: String, trim: true, default: '' },
    approvedBy: { type: String, trim: true, default: '' },
    approvedAt: { type: Date, default: null },
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────

const ProjectSchema = new mongoose.Schema(
  {
    // ─── Basic Information ─────────────────────────
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [200, 'Slug cannot exceed 200 characters'],
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Short description cannot exceed 300 characters'],
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
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    tag: {
      type: String,
      required: [true, 'Tag is required'],
      trim: true,
      maxlength: [100, 'Tag cannot exceed 100 characters'],
    },

    // ─── Media ─────────────────────────────────────
    coverImage: { type: ImageFieldSchema, default: () => ({ url: '', alt: '', type: 'cloudinary' }) },
    galleryImages: [ImageFieldSchema],
    thumbnail: { type: ImageFieldSchema, default: () => ({}) },
    youtubeVideo: { type: String, trim: true, default: '' },
    attachments: [ImageFieldSchema],

    // ─── Project Information ───────────────────────
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['COMBAT', 'AI', 'AERO', 'AUTO', 'OTHER'],
        message: 'Invalid category',
      },
      index: true,
    },
    subCategory: { type: String, trim: true, default: '', maxlength: 100 },
    projectType: {
      type: String,
      enum: ['individual', 'team', 'club'],
      default: 'team',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate',
    },

    // ─── Creator ───────────────────────────────────
    createdBy: { type: String, trim: true, default: '' },
    createdByType: { type: String, enum: ['admin', 'member'], default: 'admin' },

    // ─── Team ──────────────────────────────────────
    team: [TeamMemberSchema],

    // ─── Faculty ───────────────────────────────────
    faculty: { type: FacultySchema, default: () => ({}) },

    // ─── Technologies ──────────────────────────────
    technologies: [TechnologySchema],

    // ─── Components Used ───────────────────────────
    components: [ComponentSchema],

    // ─── Documentation ─────────────────────────────
    documentation: { type: DocumentationSchema, default: () => ({}) },

    // ─── Competition Information ───────────────────
    competition: { type: CompetitionSchema, default: () => ({}) },

    // ─── Project Status ────────────────────────────
    status: {
      type: String,
      enum: {
        values: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'ongoing', 'completed', 'archived'],
        message: 'Invalid status',
      },
      default: 'draft',
      index: true,
    },

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

    // ─── Admin ─────────────────────────────────────
    admin: { type: AdminSchema, default: () => ({}) },

    // ─── Legacy Fields (backward compat) ───────────
    id: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [50, 'ID cannot exceed 50 characters'],
    },
    latency: { type: String, trim: true, default: '0.00ms', maxlength: 20 },
    image: { type: ImageFieldSchema, default: () => ({ url: '', alt: '', type: 'cloudinary' }) },
    github: { type: String, trim: true, default: '' },
    demo: { type: String, trim: true, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // ─── System ────────────────────────────────────
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ 'homepage.featured': -1, order: 1 });
ProjectSchema.index({ category: 1, order: 1 });
ProjectSchema.index({ status: 1, isDeleted: 1 });
ProjectSchema.index({ projectType: 1 });
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ 'team.fullName': 1 });
ProjectSchema.index({ createdAt: -1 });

// ─── Pre-save: Generate slug from title ───────────────────────
ProjectSchema.pre('save', async function (next) {
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
      const existing = await mongoose.models.Project.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  // Generate legacy ID if not provided
  if (!this.id) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Project.countDocuments();
    this.id = `DRC_${String(count + 1).padStart(3, '0')}${year}`;
  }

  next();
});

// ─── Virtual: statusColor ─────────────────────────────────────
ProjectSchema.virtual('statusColor').get(function () {
  const colors: Record<string, string> = {
    draft: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
    submitted: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    under_review: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    approved: 'bg-green-500/15 text-green-400 border border-green-500/20',
    rejected: 'bg-red-500/15 text-red-400 border border-red-500/20',
    ongoing: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    completed: 'bg-green-500/15 text-green-400 border border-green-500/20',
    archived: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
    ACTIVE: 'bg-green-500/15 text-green-400 border border-green-500/20',
    TESTING: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    MAINTENANCE: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
    UNKNOWN: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
  };
  return colors[this.status] || colors.draft;
});

// ─── Virtual: leader ──────────────────────────────────────────
ProjectSchema.virtual('leader').get(function () {
  return this.team.find((m) => m.isLeader) || this.team[0] || null;
});

// ─── Soft-delete middleware ────────────────────────────────────
ProjectSchema.pre('find', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

ProjectSchema.pre('findOne', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
