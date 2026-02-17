import mongoose from 'mongoose';

const FooterSchema = new mongoose.Schema({
  description: { type: String },
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    country: { type: String }
  },
  email: { type: String },
  phone: { type: String },
  socialLinks: [{
    platform: { type: String },
    url: { type: String },
    icon: { type: String }
  }],
  quickLinks: [{
    name: { type: String },
    url: { type: String }
  }],
  copyright: { type: String },
  designer: {
    name: { type: String },
    url: { type: String }
  },
  collaborators: [{
    name: { type: String },
    role: { type: String }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Footer || mongoose.model('Footer', FooterSchema);