import mongoose from 'mongoose';

const TimelineSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: { type: String },
    alt: { type: String }
  },
  achievements: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Timeline || mongoose.model('Timeline', TimelineSchema);