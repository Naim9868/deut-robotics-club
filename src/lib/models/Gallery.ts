import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    url: { type: String, default: '' },
    alt: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  videoUrl: { type: String, default: '' },
  category: { type: String },
  date: { type: Date },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

delete mongoose.models.Gallery;
export default mongoose.model('Gallery', GallerySchema);