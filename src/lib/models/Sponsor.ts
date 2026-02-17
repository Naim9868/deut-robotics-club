import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: {
    url: { type: String, required: true },
    alt: { type: String }
  },
  website: { type: String },
  category: { 
    type: String,
    enum: ['PLATINUM', 'GOLD', 'SILVER', 'PARTNER'],
    default: 'PARTNER'
  },
  description: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Sponsor || mongoose.model('Sponsor', SponsorSchema);