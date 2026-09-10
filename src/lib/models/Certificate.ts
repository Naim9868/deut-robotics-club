import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema(
  {
    certType: {
      type: String,
      required: [true, 'Certificate type is required'],
      trim: true,
      enum: ['membership', 'participation', 'achievement', 'appreciation', 'completion'],
    },
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
      maxlength: 200,
    },
    studentId: {
      type: String,
      trim: true,
      default: '',
    },
    session: {
      type: String,
      trim: true,
      default: '',
    },
    roleEvent: {
      type: String,
      trim: true,
      default: '',
    },
    citation: {
      type: String,
      trim: true,
      default: '',
    },
    certNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    dateIssued: {
      type: Date,
      default: Date.now,
    },
    presidentName: {
      type: String,
      trim: true,
      default: '',
    },
    directorName: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

CertificateSchema.index({ certNumber: 1 });
CertificateSchema.index({ certType: 1 });
CertificateSchema.index({ recipientName: 1 });

delete mongoose.models.Certificate;
export default mongoose.model('Certificate', CertificateSchema);
