import mongoose from 'mongoose';

/**
 * Member Mongoose Schema
 * Stores approved DRC members with their complete information.
 * Created automatically when a registration application is approved.
 */

const ImageFieldSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    type: { type: String, enum: ['cloudinary', 'link'], default: 'cloudinary' },
  },
  { _id: false }
);

const MemberSchema = new mongoose.Schema(
  {
    membershipId: {
      type: String,
      unique: true,
    },
    registrationApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RegistrationApplication',
      required: true,
    },
    // ─── Personal Information (copied from application) ────────
    personal: {
      fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
      profilePhoto: {
        type: ImageFieldSchema,
        default: () => ({ url: '', publicId: '', type: 'cloudinary' }),
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'],
        required: true,
      },
      dateOfBirth: {
        type: String,
        required: true,
      },
      bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        default: '',
      },
    },
    // ─── University Information ───────────────────
    university: {
      studentId: {
        type: String,
        required: true,
        trim: true,
      },
      registrationNumber: {
        type: String,
        trim: true,
        default: '',
      },
      department: {
        type: String,
        required: true,
        trim: true,
      },
      session: {
        type: String,
        required: true,
        trim: true,
      },
      semester: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // ─── Contact Information ──────────────────────
    contact: {
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      whatsappNumber: {
        type: String,
        trim: true,
        default: '',
      },
      emergencyContact: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // ─── Additional Information ───────────────────
    additional: {
      skills: [{ type: String, trim: true }],
      interests: [{ type: String, trim: true }],
      previousExperience: {
        type: String,
        trim: true,
        default: '',
      },
      motivation: {
        type: String,
        trim: true,
        default: '',
      },
    },
    // ─── Membership Status ────────────────────────
    membershipStatus: {
      type: String,
      enum: {
        values: ['pending', 'active', 'suspended', 'expired', 'alumni'],
        message: 'Invalid membership status',
      },
      default: 'active',
      index: true,
    },
    membershipType: {
      type: String,
      enum: {
        values: ['regular', 'executive', 'honorary'],
        message: 'Invalid membership type',
      },
      default: 'regular',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
    suspendedReason: {
      type: String,
      trim: true,
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

// ─── Indexes ────────────────────────────────────────────────────
MemberSchema.index({ membershipStatus: 1, isDeleted: 1 });
MemberSchema.index({ membershipType: 1, isDeleted: 1 });
MemberSchema.index({ createdAt: -1 });
MemberSchema.index({ 'contact.email': 1 });
MemberSchema.index({ 'university.studentId': 1 });
MemberSchema.index({ membershipId: 1 });

// ─── Pre-save: Generate Membership ID ───────────────────────────
MemberSchema.pre('save', async function (next) {
  if (!this.membershipId) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Member.countDocuments();
    this.membershipId = `DRC-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// ─── Soft-delete middleware ──────────────────────────────────────
MemberSchema.pre('find', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

MemberSchema.pre('findOne', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

export default mongoose.models.Member ||
  mongoose.model('Member', MemberSchema);
