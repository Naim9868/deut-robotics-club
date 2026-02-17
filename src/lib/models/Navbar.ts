import mongoose from 'mongoose';

const NavbarSchema = new mongoose.Schema({
  logo: {
    text: { type: String, default: 'DUET ROBOTICS' },
    icon: { type: String, default: 'D' },
    iconBgColor: { type: String, default: '#e63946' }
  },
  navLinks: [{
    name: { type: String, required: true },
    href: { type: String, required: true },
    id: { type: String, required: true },
    order: { type: Number }
  }],
  ctaButton: {
    text: { type: String, default: 'Join Now' },
    link: { type: String, default: '#contact' },
    isActive: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Navbar || mongoose.model('Navbar', NavbarSchema);