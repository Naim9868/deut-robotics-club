import mongoose from 'mongoose';

const FocusAreaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, default: '#e63946' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.FocusArea || mongoose.model('FocusArea', FocusAreaSchema);