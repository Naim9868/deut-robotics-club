import mongoose from 'mongoose';

const EventsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  date: {
    day: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String },
    fullDate: { type: Date }
  },
  location: { type: String },
  image: {
    url: { type: String, required: true },
    alt: { type: String }
  },
  registrationLink: { type: String },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Events || mongoose.model('Events', EventsSchema);