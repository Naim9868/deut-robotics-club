import mongoose from 'mongoose';

const ResearchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  technology: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  category: { type: String },
  researchers: [{ type: String }],
  publications: [{ type: String }],
  status: { 
    type: String,
    enum: ['ONGOING', 'COMPLETED', 'PROPOSED'],
    default: 'ONGOING'
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Research || mongoose.model('Research', ResearchSchema);