
import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  title: { type: String, default: 'About Us' },
  description: { type: String },
  paragraphs: [{ type: String }],
  buttonText: { type: String, default: 'Learn More' },
  buttonLink: { type: String, default: '#' },
  image: {
    url: { type: String, required: true },
    alt: { type: String, default: 'About Us' }
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });


const About = mongoose.models.About || mongoose.model('About', AboutSchema);

export default About;