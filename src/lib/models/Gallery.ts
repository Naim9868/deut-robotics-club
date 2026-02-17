import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    url: { type: String, required: true },
    alt: { type: String }
  },
  category: { type: String },
  tags: [{ type: String }],
  date: { type: Date },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);