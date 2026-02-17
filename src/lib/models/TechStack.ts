import mongoose from 'mongoose';

const TechItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  use: { type: String, required: true },
  icon: { type: String, required: true },
  proficiency: { type: Number, min: 0, max: 100 },
  order: { type: Number }
});

const TechStackSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [TechItemSchema],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.TechStack || mongoose.model('TechStack', TechStackSchema);