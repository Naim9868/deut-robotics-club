import mongoose from 'mongoose';

const EventsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true 
  },
  date: {
    day: { 
      type: String, 
      required: [true, 'Day is required'],
      trim: true 
    },
    month: { 
      type: String, 
      required: [true, 'Month is required'],
      trim: true 
    },
    year: { 
      type: String,
      trim: true 
    },
    fullDate: { 
      type: Date 
    }
  },
  location: { 
    type: String,
    trim: true 
  },
  image: {
    url: { 
      type: String,
      default: '/images/event-placeholder.jpg'
    },
    alt: { 
      type: String,
      default: function(this: any) {
        return this.title || 'Event image';
      }
    },
    publicId: { 
      type: String 
    }
  },
  registrationLink: { 
    type: String,
    trim: true 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  order: { 
    type: Number, 
    default: 0,
    index: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
EventsSchema.index({ featured: -1, order: 1 });
EventsSchema.index({ 'date.fullDate': -1 });

// Generate slug from title before saving if not provided
EventsSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Create fullDate if day, month, year are provided
  if (this.date?.day && this.date?.month && !this.date.fullDate) {
    const year = this.date.year || new Date().getFullYear();
    this.date.fullDate = new Date(`${this.date.month} ${this.date.day}, ${year}`);
  }
  
  next();
});

export default mongoose.models.Events || mongoose.model('Events', EventsSchema);