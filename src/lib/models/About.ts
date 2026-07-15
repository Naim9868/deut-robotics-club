import mongoose from 'mongoose';

// ─── Shared Sub-Schemas ───────────────────────────────────────

const ImageFieldSchema = new mongoose.Schema(
  { url: { type: String, default: '' }, alt: { type: String, default: '' }, publicId: { type: String, default: '' } },
  { _id: false }
);

const SocialLinksSchema = new mongoose.Schema(
  { facebook: { type: String, default: '' }, linkedin: { type: String, default: '' }, github: { type: String, default: '' }, website: { type: String, default: '' } },
  { _id: false }
);

// ─── Item Sub-Schemas ─────────────────────────────────────────

const CoreValueItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const ObjectiveItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const TimelineItemSchema = new mongoose.Schema({
  year: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const AchievementItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  year: { type: String, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const StatItemSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  icon: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const WhyJoinItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const FacultyAdvisorItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  designation: { type: String, default: '' },
  department: { type: String, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  message: { type: String, default: '' },
  socialLinks: { type: SocialLinksSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const FacilityItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const LaboratoryItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  equipment: [{ type: String }],
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const SponsorItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  website: { type: String, default: '' },
  tier: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const GalleryItemSchema = new mongoose.Schema({
  url: { type: String, default: '' },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  type: { type: String, default: 'image' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const FAQItemSchema = new mongoose.Schema({
  question: { type: String, default: '' },
  answer: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

// ─── Section Sub-Schemas (non-item sections) ──────────────────

const SectionFieldsSchema = {
  isEnabled: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
};

// ─── Main About Schema ────────────────────────────────────────

const AboutSchema = new mongoose.Schema(
  {
    _singleton: { type: String, default: 'main', unique: true, immutable: true },

    // ── Non-item sections ──
    hero: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        bannerImage: { type: ImageFieldSchema, default: () => ({}) },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        ctaButton: { type: new mongoose.Schema({
          text: { type: String, default: '' },
          link: { type: String, default: '' },
        }, { _id: false }), default: () => ({}) },
      }, { _id: false }),
      default: () => ({}),
    },
    introduction: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        shortIntro: { type: String, default: '' },
        longDescription: { type: String, default: '' },
      }, { _id: false }),
      default: () => ({}),
    },
    story: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        content: { type: String, default: '' },
        image: { type: ImageFieldSchema, default: () => ({}) },
      }, { _id: false }),
      default: () => ({}),
    },
    mission: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        content: { type: String, default: '' },
        image: { type: ImageFieldSchema, default: () => ({}) },
      }, { _id: false }),
      default: () => ({}),
    },
    vision: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        content: { type: String, default: '' },
        image: { type: ImageFieldSchema, default: () => ({}) },
      }, { _id: false }),
      default: () => ({}),
    },
    promotionalVideo: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        videoUrl: { type: String, default: '' },
        thumbnailUrl: { type: String, default: '' },
      }, { _id: false }),
      default: () => ({}),
    },
    callToAction: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        buttonText: { type: String, default: '' },
        buttonLink: { type: String, default: '' },
        image: { type: ImageFieldSchema, default: () => ({}) },
      }, { _id: false }),
      default: () => ({}),
    },

    // ── Item sections (items defined directly, NOT via helper) ──
    coreValues: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [CoreValueItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    objectives: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [ObjectiveItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    journeyTimeline: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [TimelineItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    achievements: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [AchievementItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    statistics: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [StatItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    whyJoin: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [WhyJoinItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    facultyAdvisors: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [FacultyAdvisorItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    facilities: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [FacilityItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    laboratories: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [LaboratoryItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    sponsorsPartners: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [SponsorItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    gallery: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [GalleryItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
    faqs: {
      type: new mongoose.Schema({
        ...SectionFieldsSchema,
        items: [FAQItemSchema],
      }, { _id: false }),
      default: () => ({}),
    },
  },
  { timestamps: true }
);

if (mongoose.models.About) {
  mongoose.deleteModel('About');
}

export default mongoose.model('About', AboutSchema);
