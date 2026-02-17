import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: {
    url: { type: String, required: true },
    alt: { type: String }
  },
  readTime: { type: Number },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);