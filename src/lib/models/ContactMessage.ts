import mongoose from 'mongoose';

/**
 * ContactMessage Mongoose Schema
 * Stores messages submitted via the public contact form.
 * Includes metadata for tracking, replying, and archival.
 */
const ContactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email cannot exceed 254 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['unread', 'read', 'replied', 'archived'],
        message: 'Status must be unread, read, replied, or archived',
      },
      default: 'unread',
    },
    reply: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Reply cannot exceed 5000 characters'],
    },
    repliedBy: {
      type: String,
      trim: true,
      default: null,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
ContactMessageSchema.index({ status: 1, isDeleted: 1 });
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ email: 1 });
ContactMessageSchema.index({ isDeleted: 1, createdAt: -1 });

// Strip soft-deleted records from default queries
ContactMessageSchema.pre('find', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

ContactMessageSchema.pre('findOne', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

export default mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', ContactMessageSchema);
