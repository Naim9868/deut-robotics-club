import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  suffix: { type: String, default: '' },
  icon: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Stats || mongoose.model('Stats', StatsSchema);