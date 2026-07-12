import mongoose from 'mongoose';

/**
 * MembershipSettings Mongoose Schema
 * Singleton document storing configuration for the membership system.
 * Controls registration open/close, fee, payment methods, and limits.
 */

const PaymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    enabled: { type: Boolean, default: true },
    details: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const MembershipSettingsSchema = new mongoose.Schema(
  {
    registrationOpen: {
      type: Boolean,
      default: false,
    },
    registrationFee: {
      type: Number,
      default: 0,
      min: [0, 'Fee must be a positive number'],
    },
    paymentMethods: [PaymentMethodSchema],
    registrationInstructions: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Instructions cannot exceed 5000 characters'],
    },
    maxMembers: {
      type: Number,
      default: 100,
      min: [1, 'Max members must be at least 1'],
    },
    membershipDurationMonths: {
      type: Number,
      default: 12,
      min: [1, 'Duration must be at least 1 month'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MembershipSettings ||
  mongoose.model('MembershipSettings', MembershipSettingsSchema);
