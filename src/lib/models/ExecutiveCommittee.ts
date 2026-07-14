import mongoose from 'mongoose';

// ─── Embedded Member Sub-Schema ────────────────────────────────
const CommitteeMemberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    profilePhoto: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    coverPhoto: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    designation: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    session: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    studentId: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    shortBio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    fullBiography: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 200,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: '',
    },
    socialLinks: {
      facebook: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
      portfolio: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
    },
    responsibilities: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    messageFromMember: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

// ─── Main Executive Committee Schema ───────────────────────────
const ExecutiveCommitteeSchema = new mongoose.Schema(
  {
    committeeYear: {
      type: Number,
      required: [true, 'Committee year is required'],
      min: 2000,
      max: 2100,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    members: [CommitteeMemberSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───────────────────────────────────────────────────
ExecutiveCommitteeSchema.index({ committeeYear: -1 });
ExecutiveCommitteeSchema.index({ isCurrent: -1 });
ExecutiveCommitteeSchema.index({ isPublished: 1, committeeYear: -1 });

// ─── Pre-save: auto-generate slug from title ───────────────────
ExecutiveCommitteeSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();

  let baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Append year to make slug unique per committee
  baseSlug = `${baseSlug}-${this.committeeYear}`;

  let slug = baseSlug;
  let counter = 1;
  const Model = mongoose.models.ExecutiveCommittee || mongoose.model('ExecutiveCommittee', ExecutiveCommitteeSchema);

  while (true) {
    const existing = await Model.findOne({
      slug,
      _id: { $ne: this._id },
    }).lean();
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

// ─── Pre-save: auto-generate member slugs ──────────────────────
ExecutiveCommitteeSchema.pre('save', function (next) {
  const committee = this as any;
  committee.members.forEach((member: any, index: number) => {
    if (!member.slug || member.isModified('fullName')) {
      member.slug = member.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  });
  next();
});

// ─── Pre-save: ensure only one current committee per year ──────
ExecutiveCommitteeSchema.pre('save', async function (next) {
  if (!this.isModified('isCurrent') || !this.isCurrent) return next();

  // Unset other current committees for the same year
  await mongoose.models.ExecutiveCommittee.updateMany(
    { _id: { $ne: this._id }, committeeYear: this.committeeYear, isCurrent: true },
    { $set: { isCurrent: false } }
  );
  next();
});

// ─── Soft-delete middleware ─────────────────────────────────────
ExecutiveCommitteeSchema.pre('find', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

ExecutiveCommitteeSchema.pre('findOne', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

// ─── Virtual: member count ─────────────────────────────────────
ExecutiveCommitteeSchema.virtual('memberCount').get(function () {
  return this.members?.filter((m: any) => m.isVisible)?.length || 0;
});

export default mongoose.models.ExecutiveCommittee ||
  mongoose.model('ExecutiveCommittee', ExecutiveCommitteeSchema);
