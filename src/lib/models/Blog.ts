import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  
  slug: { 
    type: String, 
    required: true, 
    unique: true,  // This creates the index - DON'T add another one
    lowercase: true,
    trim: true
  },
  
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: ['Robotics', 'Artificial Intelligence', 'Achievements', 'Tutorials', 'Events', 'Research'],
    default: 'Robotics'
  },
  
  excerpt: { 
    type: String, 
    required: [true, 'Excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  
  content: { 
    type: String, 
    required: [true, 'Content is required']  // This is failing
  },
  
  author: { 
    type: String, 
    required: [true, 'Author name is required']
  },
  
  authorImage: { 
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=1e1e1e&color=e63946&size=100'
  },
  
  authorTitle: {
    type: String,
    default: 'Member'
  },
  
  date: { 
    type: Date, 
    default: Date.now 
  },
  
  publishedAt: { 
    type: Date,
    default: Date.now
  },
  
  image: {
    url: { 
      type: String,
      default: ''
    },
    alt: { 
      type: String,
      default: function(this: any) {
        return this.title || 'Blog post image';
      }
    },
    publicId: { 
      type: String 
    }
  },
  
  coverImage: { 
    type: String,
    default: ''
  },
  
  readTime: { 
    type: Number,
    min: 1,
    default: 5 
  },
  
  tags: [{ 
    type: String,
    lowercase: true,
    trim: true
  }],
  
  featured: { 
    type: Boolean, 
    default: false 
  },
  
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  isPublished: { 
    type: Boolean, 
    default: true 
  },
  
  views: { 
    type: Number, 
    default: 0 
  },
  
  likes: { 
    type: Number, 
    default: 0 
  },
  
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title should be under 60 characters'], // Fixed: 60 characters
    default: function(this: any) {
      return this.title ? this.title.substring(0, 57) + '...' : '';
    }
  },
  
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description should be under 160 characters'], // Fixed: 160 characters
    default: function(this: any) {
      return this.excerpt ? this.excerpt.substring(0, 157) + '...' : '';
    }
  },
  
  order: {
    type: Number,
    default: 0
  }

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving if not provided
BlogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Set publishedAt to date if not set
  if (!this.publishedAt) {
    this.publishedAt = this.date || new Date();
  }
  
  // Set coverImage from image.url for backward compatibility
  if (this.image?.url && !this.coverImage) {
    this.coverImage = this.image.url;
  }
  
  // Truncate metaTitle if too long
  if (this.metaTitle && this.metaTitle.length > 60) {
    this.metaTitle = this.metaTitle.substring(0, 57) + '...';
  }
  
  // Truncate metaDescription if too long
  if (this.metaDescription && this.metaDescription.length > 160) {
    this.metaDescription = this.metaDescription.substring(0, 157) + '...';
  }
  
  next();
});

// Virtual for formatted date
BlogSchema.virtual('formattedDate').get(function() {
  return this.date?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for reading time in minutes
BlogSchema.virtual('readingTime').get(function() {
  if (this.readTime) return this.readTime;
  
  const wordsPerMinute = 200;
  const wordCount = this.content?.split(/\s+/).length || 0;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Keep ONLY these indexes - REMOVE the slug index
BlogSchema.index({ category: 1, date: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ featured: 1, order: 1 });
BlogSchema.index({ isActive: 1, date: -1 });
// DO NOT add BlogSchema.index({ slug: 1 }) - it's already indexed by unique: true

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);