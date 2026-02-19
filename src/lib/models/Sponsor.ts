import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Sponsor name is required'],
    trim: true 
  },
  logo: {
    url: { 
      type: String, 
      default: '/images/sponsor-placeholder.png'
    },
    alt: { 
      type: String,
      default: function(this: any) {
        return this.name || 'Sponsor logo';
      }
    },
    publicId: { 
      type: String 
    }
  },
  website: { 
    type: String,
    trim: true 
  },
  category: { 
    type: String,
    enum: {
      values: ['PLATINUM', 'GOLD', 'SILVER', 'PARTNER'],
      message: '{VALUE} is not a valid category'
    },
    default: 'PARTNER'
  },
  description: { 
    type: String,
    trim: true 
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
SponsorSchema.index({ category: 1, order: 1 });

// Virtual for category badge color
SponsorSchema.virtual('badgeColor').get(function() {
  switch(this.category) {
    case 'PLATINUM': return 'text-gray-300 border-gray-300';
    case 'GOLD': return 'text-yellow-500 border-yellow-500';
    case 'SILVER': return 'text-gray-400 border-gray-400';
    case 'PARTNER': return 'text-primary border-primary';
    default: return 'text-gray-500 border-gray-500';
  }
});

export default mongoose.models.Sponsor || mongoose.model('Sponsor', SponsorSchema);