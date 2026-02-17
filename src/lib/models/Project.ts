import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tag: { type: String, required: true },
  category: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'TESTING', 'MAINTENANCE', 'UNKNOWN'],
    default: 'ACTIVE'
  },
  latency: { type: String, default: '0.00ms' },
  description: { type: String },
  image: {
    url: { type: String, required: true },
    alt: { type: String }
  },
  technologies: [{ type: String }],
  team: [{ type: String }],
  github: { type: String },
  demo: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);