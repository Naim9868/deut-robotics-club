import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    order: { type: Number }
  }],
  primaryButton: {
    text: { type: String, default: 'Join the Mission' },
    link: { type: String, default: '#contact' }
  },
  secondaryButton: {
    text: { type: String, default: 'Explore Projects' },
    link: { type: String, default: '#projects' }
  },
  autoSlideInterval: { type: Number, default: 6000 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);