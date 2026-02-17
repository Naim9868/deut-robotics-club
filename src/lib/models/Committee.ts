import mongoose from 'mongoose';

const CommitteeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String },
  session: { type: String },
  email: { type: String },
  image: {
    url: { type: String, required: true },
    alt: { type: String }
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    facebook: { type: String }
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isExecutive: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Committee || mongoose.model('Committee', CommitteeSchema);