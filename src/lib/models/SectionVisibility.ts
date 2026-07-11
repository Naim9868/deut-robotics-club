import mongoose from 'mongoose';

const SectionVisibilitySchema = new mongoose.Schema({
  sections: {
    type: Map,
    of: Boolean,
    default: {
      hero: true,
      about: true,
      events: true,
      stats: true,
      focusAreas: true,
      research: true,
      blog: true,
      projects: true,
      gallery: true,
      timeline: true,
      committee: true,
      testimonials: true,
      faq: true,
      sponsors: true,
      footer: true,
    },
  },
}, { timestamps: true });

export default mongoose.models.SectionVisibility || mongoose.model('SectionVisibility', SectionVisibilitySchema);
