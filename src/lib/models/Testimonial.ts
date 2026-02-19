import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
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
  text: { 
    type: String, 
    required: [true, 'Testimonial text is required'],
    trim: true 
  },
  avatar: {
    url: { 
      type: String,
      default: 'https://ui-avatars.com/api/?name=User&background=1e1e1e&color=e63946&size=200'
    },
    alt: { 
      type: String,
      default: function(this: any) {
        return this.name || 'Testimonial avatar';
      }
    },
    publicId: { 
      type: String 
    }
  },
  rating: { 
    type: Number, 
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 5 
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
TestimonialSchema.index({ featured: -1, order: 1 });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);