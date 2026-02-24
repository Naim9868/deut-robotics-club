import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String,
    default: 'Admin'
  },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'editor'],
    default: 'admin'
  },
  avatar: {
    url: String,
    publicId: String
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Don't return password in queries
AdminSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);