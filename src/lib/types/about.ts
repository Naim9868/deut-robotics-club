// ─── About CMS Types ──────────────────────────────────────────

export interface ImageField {
  url: string;
  alt: string;
  publicId: string;
}

export interface SocialLinks {
  facebook: string;
  linkedin: string;
  github: string;
  website: string;
}

// ─── Item Types ───────────────────────────────────────────────

export interface CoreValueItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  image: ImageField;
  isPublished: boolean;
  displayOrder: number;
}

export interface ObjectiveItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  isPublished: boolean;
  displayOrder: number;
}

export interface TimelineItem {
  _id?: string;
  year: string;
  title: string;
  description: string;
  image: ImageField;
  isPublished: boolean;
  displayOrder: number;
}

export interface AchievementItem {
  _id?: string;
  title: string;
  description: string;
  year: string;
  image: ImageField;
  isPublished: boolean;
  displayOrder: number;
}

export interface StatItem {
  _id?: string;
  label: string;
  value: string;
  icon: string;
  isPublished: boolean;
  displayOrder: number;
}

export interface WhyJoinItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  isPublished: boolean;
  displayOrder: number;
}

export interface FacultyAdvisorItem {
  _id?: string;
  name: string;
  designation: string;
  department: string;
  image: ImageField;
  message: string;
  socialLinks: SocialLinks;
  isPublished: boolean;
  displayOrder: number;
}

export interface FacilityItem {
  _id?: string;
  name: string;
  description: string;
  image: ImageField;
  isPublished: boolean;
  displayOrder: number;
}

export interface LaboratoryItem {
  _id?: string;
  name: string;
  description: string;
  image: ImageField;
  equipment: string[];
  isPublished: boolean;
  displayOrder: number;
}

export interface SponsorItem {
  _id?: string;
  name: string;
  image: ImageField;
  website: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner' | '';
  isPublished: boolean;
  displayOrder: number;
}

export interface GalleryItem {
  _id?: string;
  url: string;
  alt: string;
  caption: string;
  type: 'image' | 'video' | '';
  isPublished: boolean;
  displayOrder: number;
}

export interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
  isPublished: boolean;
  displayOrder: number;
}

// ─── Section Types ────────────────────────────────────────────

export interface HeroSection {
  isEnabled: boolean;
  displayOrder: number;
  bannerImage: ImageField;
  title: string;
  subtitle: string;
  ctaButton: { text: string; link: string };
}

export interface IntroductionSection {
  isEnabled: boolean;
  displayOrder: number;
  shortIntro: string;
  longDescription: string;
}

export interface ContentSection {
  isEnabled: boolean;
  displayOrder: number;
  content: string;
  image: ImageField;
}

export interface ItemsSection {
  isEnabled: boolean;
  displayOrder: number;
}

export interface CoreValuesSection extends ItemsSection {
  items: CoreValueItem[];
}

export interface ObjectivesSection extends ItemsSection {
  items: ObjectiveItem[];
}

export interface JourneyTimelineSection extends ItemsSection {
  items: TimelineItem[];
}

export interface AchievementsSection extends ItemsSection {
  items: AchievementItem[];
}

export interface StatisticsSection extends ItemsSection {
  items: StatItem[];
}

export interface WhyJoinSection extends ItemsSection {
  items: WhyJoinItem[];
}

export interface FacultyAdvisorsSection extends ItemsSection {
  items: FacultyAdvisorItem[];
}

export interface FacilitiesSection extends ItemsSection {
  items: FacilityItem[];
}

export interface LaboratoriesSection extends ItemsSection {
  items: LaboratoryItem[];
}

export interface SponsorsPartnersSection extends ItemsSection {
  items: SponsorItem[];
}

export interface GallerySection extends ItemsSection {
  items: GalleryItem[];
}

export interface PromotionalVideoSection {
  isEnabled: boolean;
  displayOrder: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface FAQsSection extends ItemsSection {
  items: FAQItem[];
}

export interface CallToActionSection {
  isEnabled: boolean;
  displayOrder: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: ImageField;
}

// ─── Main About Document ──────────────────────────────────────

export interface IAbout {
  _id: string;
  hero: HeroSection;
  introduction: IntroductionSection;
  story: ContentSection;
  mission: ContentSection;
  vision: ContentSection;
  coreValues: CoreValuesSection;
  objectives: ObjectivesSection;
  journeyTimeline: JourneyTimelineSection;
  achievements: AchievementsSection;
  statistics: StatisticsSection;
  whyJoin: WhyJoinSection;
  facultyAdvisors: FacultyAdvisorsSection;
  facilities: FacilitiesSection;
  laboratories: LaboratoriesSection;
  sponsorsPartners: SponsorsPartnersSection;
  gallery: GallerySection;
  promotionalVideo: PromotionalVideoSection;
  faqs: FAQsSection;
  callToAction: CallToActionSection;
  enabledSections: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Section key name union type */
export type SectionKey = keyof Omit<IAbout, '_id' | 'enabledSections' | 'createdAt' | 'updatedAt'>;
