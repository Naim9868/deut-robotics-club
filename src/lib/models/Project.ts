import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: [true, 'Project ID is required'], 
    unique: true,
    trim: true,
    uppercase: true
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true 
  },
  tag: { 
    type: String, 
    required: [true, 'Tag is required'],
    trim: true 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: {
      values: ['COMBAT', 'AI', 'AERO', 'AUTO'],
      message: '{VALUE} is not a valid category'
    },
    default: 'COMBAT'
  },
  status: { 
    type: String, 
    enum: {
      values: ['ACTIVE', 'TESTING', 'MAINTENANCE', 'UNKNOWN'],
      message: '{VALUE} is not a valid status'
    },
    default: 'ACTIVE'
  },
  latency: { 
    type: String, 
    default: '0.00ms',
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  image: {
    url: { 
      type: String,
      default: '/images/project-placeholder.jpg'
    },
    alt: { 
      type: String,
      default: function(this: any) {
        return this.title || 'Project image';
      }
    },
    publicId: { 
      type: String 
    }
  },
  technologies: [{ 
    type: String,
    trim: true 
  }],
  team: [{ 
    type: String,
    trim: true 
  }],
  github: { 
    type: String,
    trim: true 
  },
  demo: { 
    type: String,
    trim: true 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  order: { 
    type: Number, 
    default: 0,
    index: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better performance
ProjectSchema.index({ category: 1, order: 1 });
ProjectSchema.index({ featured: -1, order: 1 });

// Virtual for status color
ProjectSchema.virtual('statusColor').get(function() {
  switch(this.status) {
    case 'ACTIVE': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'TESTING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'MAINTENANCE': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'UNKNOWN': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);