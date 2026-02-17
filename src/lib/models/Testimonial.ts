import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  avatar: {
    url: { type: String },
    alt: { type: String }
  },
  rating: { type: Number, min: 1, max: 5 },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);