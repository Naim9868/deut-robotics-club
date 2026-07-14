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

// ─── Item Sub-Schemas (embedded in sections) ──────────────────

const CoreValueItemSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  icon: { type: String, trim: true, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const ObjectiveItemSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  icon: { type: String, trim: true, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const TimelineItemSchema = new mongoose.Schema({
  year: { type: String, trim: true, default: '' },
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const AchievementItemSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  year: { type: String, trim: true, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const StatItemSchema = new mongoose.Schema({
  label: { type: String, trim: true, default: '' },
  value: { type: String, trim: true, default: '' },
  icon: { type: String, trim: true, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const WhyJoinItemSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  icon: { type: String, trim: true, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const FacultyAdvisorItemSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  designation: { type: String, trim: true, default: '' },
  department: { type: String, trim: true, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  message: { type: String, trim: true, default: '' },
  socialLinks: { type: SocialLinksSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const FacilityItemSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const LaboratoryItemSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  equipment: [{ type: String, trim: true }],
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const SponsorItemSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
  website: { type: String, trim: true, default: '' },
  tier: { type: String, enum: ['platinum', 'gold', 'silver', 'bronze', 'partner', ''], default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const GalleryItemSchema = new mongoose.Schema({
  url: { type: String, trim: true, default: '' },
  alt: { type: String, trim: true, default: '' },
  caption: { type: String, trim: true, default: '' },
  type: { type: String, enum: ['image', 'video', ''], default: 'image' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

const FAQItemSchema = new mongoose.Schema({
  question: { type: String, trim: true, default: '' },
  answer: { type: String, trim: true, default: '' },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { _id: true });

// ─── Section Sub-Schemas ──────────────────────────────────────

const HeroSectionSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  bannerImage: { type: ImageFieldSchema, default: () => ({}) },
  title: { type: String, trim: true, default: '' },
  subtitle: { type: String, trim: true, default: '' },
  ctaButton: {
    text: { type: String, trim: true, default: '' },
    link: { type: String, trim: true, default: '' },
  },
}, { _id: false });

const IntroductionSectionSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  shortIntro: { type: String, trim: true, default: '' },
  longDescription: { type: String, trim: true, default: '' },
}, { _id: false });

const ContentSectionSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  content: { type: String, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
}, { _id: false });

const ItemsSectionSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
}, { _id: false });

const GallerySectionSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  items: [GalleryItemSchema],
}, { _id: false });

const VideoSectionSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  videoUrl: { type: String, trim: true, default: '' },
  thumbnailUrl: { type: String, trim: true, default: '' },
}, { _id: false });

const CTASectionSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  title: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  buttonText: { type: String, trim: true, default: '' },
  buttonLink: { type: String, trim: true, default: '' },
  image: { type: ImageFieldSchema, default: () => ({}) },
}, { _id: false });

// ─── Main About Schema (Singleton) ───────────────────────────

const AboutSchema = new mongoose.Schema(
  {
    // Singleton guard — only one document should exist
    _singleton: { type: String, default: 'main', unique: true, immutable: true },

    // 19 optional sections — each independently toggleable
    hero: { type: HeroSectionSchema, default: () => ({}) },
    introduction: { type: IntroductionSectionSchema, default: () => ({}) },
    story: { type: ContentSectionSchema, default: () => ({}) },
    mission: { type: ContentSectionSchema, default: () => ({}) },
    vision: { type: ContentSectionSchema, default: () => ({}) },
    coreValues: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [CoreValueItemSchema],
    },
    objectives: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [ObjectiveItemSchema],
    },
    journeyTimeline: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [TimelineItemSchema],
    },
    achievements: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [AchievementItemSchema],
    },
    statistics: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [StatItemSchema],
    },
    whyJoin: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [WhyJoinItemSchema],
    },
    facultyAdvisors: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [FacultyAdvisorItemSchema],
    },
    facilities: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [FacilityItemSchema],
    },
    laboratories: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [LaboratoryItemSchema],
    },
    sponsorsPartners: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [SponsorItemSchema],
    },
    gallery: { type: GallerySectionSchema, default: () => ({}) },
    promotionalVideo: { type: VideoSectionSchema, default: () => ({}) },
    faqs: {
      type: ItemsSectionSchema, default: () => ({}),
      items: [FAQItemSchema],
    },
    callToAction: { type: CTASectionSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: ordered enabled sections ────────────────────────
AboutSchema.virtual('enabledSections').get(function () {
  const sectionKeys = [
    'hero', 'introduction', 'story', 'mission', 'vision',
    'coreValues', 'objectives', 'journeyTimeline', 'achievements',
    'statistics', 'whyJoin', 'facultyAdvisors', 'facilities',
    'laboratories', 'sponsorsPartners', 'gallery', 'promotionalVideo',
    'faqs', 'callToAction',
  ];

  return sectionKeys
    .filter((key) => {
      const section = this.get(key) as any;
      return section?.isEnabled;
    })
    .sort((a, b) => {
      const sectionA = this.get(a) as any;
      const sectionB = this.get(b) as any;
      return (sectionA?.displayOrder || 0) - (sectionB?.displayOrder || 0);
    });
});

export default mongoose.models.About || mongoose.model('About', AboutSchema);
