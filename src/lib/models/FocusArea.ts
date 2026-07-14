import mongoose from 'mongoose';

/**
 * FocusArea Mongoose Schema — Production-ready Focus Area Management System
 * Supports rich media, structured technologies, components, learning resources,
 * related content, faculty mentors, SEO, analytics, and more.
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
    componentName: { type: String, required: true, trim: true, maxlength: 200 },
    specification: { type: String, trim: true, default: '', maxlength: 500 },
    quantity: { type: Number, default: 1, min: 0 },
    inventoryReference: { type: String, trim: true, default: '', maxlength: 100 },
  },
  { _id: false }
);

const LearningResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    url: { type: String, trim: true, default: '' },
    type: {
      type: String,
      enum: ['book', 'documentation', 'github', 'youtube', 'research_paper', 'tutorial', 'course'],
      required: true,
    },
    description: { type: String, trim: true, default: '', maxlength: 500 },
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
    followers: { type: Number, default: 0 },
  },
  { _id: false }
);

const StatisticsSchema = new mongoose.Schema(
  {
    totalProjects: { type: Number, default: 0 },
    totalResearch: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
    totalAwards: { type: Number, default: 0 },
  },
  { _id: false }
);

const FacultySchema = new mongoose.Schema(
  {
    facultyAdvisor: { type: String, trim: true, default: '', maxlength: 200 },
    mentors: [{ type: String, trim: true, maxlength: 200 }],
    industryMentors: [{ type: String, trim: true, maxlength: 200 }],
  },
  { _id: false }
);

const RelatedContentSchema = new mongoose.Schema(
  {
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    research: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Research' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Events' }],
    workshops: [{ type: String, trim: true }],
    competitions: [{ type: String, trim: true }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────

const FocusAreaSchema = new mongoose.Schema(
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

    // ─── Media ─────────────────────────────────────
    icon: { type: String, trim: true, default: '🤖', maxlength: 200 },
    iconType: { type: String, enum: ['lucide', 'image'], default: 'lucide' },
    coverImage: { type: ImageFieldSchema, default: () => ({ url: '', alt: '', type: 'cloudinary' }) },
    galleryImages: [ImageFieldSchema],
    bannerImage: { type: ImageFieldSchema, default: () => ({ url: '', alt: '', type: 'cloudinary' }) },
    thumbnail: { type: ImageFieldSchema, default: () => ({ url: '', alt: '', type: 'cloudinary' }) },
    color: { type: String, default: '#e63946', maxlength: 20 },

    // ─── Classification ────────────────────────────
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Robotics',
          'Artificial Intelligence',
          'Machine Learning',
          'Computer Vision',
          'Embedded Systems',
          'IoT',
          'Drone',
          'Automation',
          'Biomedical Robotics',
          'Control Systems',
          'Power Electronics',
          'Mechanical Design',
          'Other',
        ],
        message: 'Invalid category',
      },
      index: true,
    },
    subCategory: { type: String, trim: true, default: '', maxlength: 100 },
    researchLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'research'],
      default: 'beginner',
    },

    // ─── Overview ──────────────────────────────────
    vision: { type: String, trim: true, default: '' },
    mission: { type: String, trim: true, default: '' },
    objectives: [{ type: String, trim: true, maxlength: 500 }],

    // ─── Technologies ──────────────────────────────
    technologies: [TechnologySchema],

    // ─── Hardware & Components ─────────────────────
    components: [ComponentSchema],

    // ─── Applications ──────────────────────────────
    applications: [{ type: String, trim: true, maxlength: 100 }],

    // ─── Skills Required ───────────────────────────
    skillsRequired: [{ type: String, trim: true, maxlength: 100 }],

    // ─── Learning Resources ────────────────────────
    learningResources: [LearningResourceSchema],

    // ─── Related Content ───────────────────────────
    relatedContent: { type: RelatedContentSchema, default: () => ({}) },

    // ─── Faculty & Mentors ─────────────────────────
    faculty: { type: FacultySchema, default: () => ({}) },

    // ─── Statistics ────────────────────────────────
    statistics: { type: StatisticsSchema, default: () => ({}) },

    // ─── Homepage ──────────────────────────────────
    homepage: { type: HomepageSchema, default: () => ({}) },

    // ─── Visibility ────────────────────────────────
    visibility: {
      type: String,
      enum: ['public', 'members', 'private'],
      default: 'public',
    },

    // ─── SEO ───────────────────────────────────────
    seo: { type: SEOSchema, default: () => ({}) },

    // ─── Analytics ─────────────────────────────────
    analytics: { type: AnalyticsSchema, default: () => ({}) },

    // ─── Legacy Fields (backward compat) ───────────
    description: { type: String, trim: true, default: '' },
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
FocusAreaSchema.index({ slug: 1 }, { unique: true });
FocusAreaSchema.index({ category: 1, order: 1 });
FocusAreaSchema.index({ 'homepage.featured': -1, order: 1 });
FocusAreaSchema.index({ isActive: 1, isDeleted: 1 });
FocusAreaSchema.index({ createdAt: -1 });

// ─── Pre-save: Generate slug from title ───────────────────────
FocusAreaSchema.pre('save', async function (next) {
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
      const existing = await mongoose.models.FocusArea.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  // Sync legacy description field
  if (this.shortDescription && !this.description) {
    this.description = this.shortDescription;
  }

  next();
});

// ─── Soft-delete middleware ────────────────────────────────────
FocusAreaSchema.pre('find', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

FocusAreaSchema.pre('findOne', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

export default mongoose.models.FocusArea || mongoose.model('FocusArea', FocusAreaSchema);
