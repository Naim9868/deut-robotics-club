import mongoose from 'mongoose';

/**
 * RegistrationApplication Mongoose Schema
 * Stores registration form submissions from prospective DRC members.
 * Lifecycle: draft → submitted → pending_payment → pending_verification → approved/rejected
 */

const ImageFieldSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    type: { type: String, enum: ['cloudinary', 'link'], default: 'cloudinary' },
  },
  { _id: false }
);

const AdminNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true, trim: true },
    addedBy: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RegistrationApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
    },
    // ─── Personal Information ─────────────────────
    personal: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
      profilePhoto: {
        type: ImageFieldSchema,
        default: () => ({ url: '', publicId: '', type: 'cloudinary' }),
      },
      gender: {
        type: String,
        enum: {
          values: ['male', 'female', 'other', 'prefer_not_to_say'],
          message: 'Invalid gender option',
        },
        required: [true, 'Gender is required'],
      },
      dateOfBirth: {
        type: String,
        required: [true, 'Date of birth is required'],
      },
      bloodGroup: {
        type: String,
        enum: {
          values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
          message: 'Invalid blood group',
        },
        default: '',
      },
    },
    // ─── University Information ───────────────────
    university: {
      studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        trim: true,
        maxlength: [50, 'Student ID cannot exceed 50 characters'],
      },
      registrationNumber: {
        type: String,
        trim: true,
        default: '',
        maxlength: [50, 'Registration number cannot exceed 50 characters'],
      },
      department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [100, 'Department cannot exceed 100 characters'],
      },
      session: {
        type: String,
        required: [true, 'Session is required'],
        trim: true,
        maxlength: [50, 'Session cannot exceed 50 characters'],
      },
      semester: {
        type: String,
        required: [true, 'Semester is required'],
        trim: true,
        maxlength: [20, 'Semester cannot exceed 20 characters'],
      },
    },
    // ─── Contact Information ──────────────────────
    contact: {
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        maxlength: [254, 'Email cannot exceed 254 characters'],
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters'],
      },
      whatsappNumber: {
        type: String,
        trim: true,
        default: '',
        maxlength: [20, 'WhatsApp number cannot exceed 20 characters'],
      },
      emergencyContact: {
        type: String,
        required: [true, 'Emergency contact is required'],
        trim: true,
        maxlength: [100, 'Emergency contact cannot exceed 100 characters'],
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [500, 'Address cannot exceed 500 characters'],
      },
    },
    // ─── Payment Information ──────────────────────
    payment: {
      method: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true,
      },
      transactionId: {
        type: String,
        required: [true, 'Transaction ID is required'],
        trim: true,
        maxlength: [100, 'Transaction ID cannot exceed 100 characters'],
      },
      senderNumber: {
        type: String,
        required: [true, 'Sender number is required'],
        trim: true,
        maxlength: [20, 'Sender number cannot exceed 20 characters'],
      },
      amount: {
        type: Number,
        required: [true, 'Payment amount is required'],
        min: [0, 'Amount must be a positive number'],
      },
      screenshot: {
        type: ImageFieldSchema,
        default: () => ({ url: '', publicId: '', type: 'cloudinary' }),
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
        maxlength: [2000, 'Previous experience cannot exceed 2000 characters'],
      },
      motivation: {
        type: String,
        required: [true, 'Motivation is required'],
        trim: true,
        maxlength: [2000, 'Motivation cannot exceed 2000 characters'],
      },
    },
    // ─── Status & Review ──────────────────────────
    status: {
      type: String,
      enum: {
        values: ['draft', 'submitted', 'pending_payment', 'pending_verification', 'approved', 'rejected'],
        message: 'Invalid registration status',
      },
      default: 'submitted',
      index: true,
    },
    membershipId: {
      type: String,
      default: null,
    },
    adminNotes: [AdminNoteSchema],
    reviewedBy: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    // ─── Metadata ─────────────────────────────────
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

// ─── Indexes ────────────────────────────────────────────────────
RegistrationApplicationSchema.index({ status: 1, isDeleted: 1 });
RegistrationApplicationSchema.index({ createdAt: -1 });
RegistrationApplicationSchema.index({ 'contact.email': 1 });
RegistrationApplicationSchema.index({ 'university.studentId': 1 });

// ─── Pre-save: Generate Application ID ──────────────────────────
RegistrationApplicationSchema.pre('save', async function (next) {
  if (!this.applicationId) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.RegistrationApplication.countDocuments();
    this.applicationId = `DRC-REG-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// ─── Soft-delete middleware ──────────────────────────────────────
RegistrationApplicationSchema.pre('find', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

RegistrationApplicationSchema.pre('findOne', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

export default mongoose.models.RegistrationApplication ||
  mongoose.model('RegistrationApplication', RegistrationApplicationSchema);
