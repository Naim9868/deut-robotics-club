import mongoose from 'mongoose';

const CommitteeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  role: { 
    type: String, 
    required: [true, 'Role is required'],
    trim: true 
  },
  department: { 
    type: String,
    trim: true 
  },
  session: { 
    type: String,
    trim: true 
  },
  email: { 
    type: String,
    trim: true,
    lowercase: true 
  },
  image: {
    url: { 
      type: String, 
      default: 'https://ui-avatars.com/api/?name=User&background=1e1e1e&color=e63946&size=200' 
    },
    alt: { 
      type: String,
      default: function(this: any) {
        return this.name || 'Committee member';
      }
    },
    publicId: { 
      type: String 
    }
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  order: { 
    type: Number, 
    default: 0,
    index: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isExecutive: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better performance
CommitteeSchema.index({ order: 1, isExecutive: -1 });

export default mongoose.models.Committee || mongoose.model('Committee', CommitteeSchema);