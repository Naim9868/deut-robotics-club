import mongoose from 'mongoose';

/**
 * Payment Mongoose Schema
 * Stores payment records linked to registration applications.
 * Used for payment verification workflow.
 */

const ImageFieldSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    type: { type: String, enum: ['cloudinary', 'link'], default: 'cloudinary' },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    registrationApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RegistrationApplication',
      required: true,
      index: true,
    },
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
    verificationStatus: {
      type: String,
      enum: {
        values: ['pending', 'verified', 'rejected'],
        message: 'Invalid verification status',
      },
      default: 'pending',
      index: true,
    },
    verifiedBy: {
      type: String,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
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
PaymentSchema.index({ verificationStatus: 1, isDeleted: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ transactionId: 1 });

// ─── Soft-delete middleware ──────────────────────────────────────
PaymentSchema.pre('find', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

PaymentSchema.pre('findOne', function () {
  const conditions = this.getFilter();
  if (!('isDeleted' in conditions)) {
    this.where({ isDeleted: { $ne: true } });
  }
});

export default mongoose.models.Payment ||
  mongoose.model('Payment', PaymentSchema);
