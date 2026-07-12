import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  adminName: {
    type: String,
    default: 'Admin',
    trim: true,
    maxlength: [100, 'Admin name cannot exceed 100 characters'],
  },
  adminEmail: {
    type: String,
    default: 'admin@drc.duet.ac.bd',
    trim: true,
    lowercase: true,
    maxlength: [254, 'Email cannot exceed 254 characters'],
  },
  replySubjectTemplate: {
    type: String,
    default: 'Re: {subject}',
    trim: true,
    maxlength: [200, 'Subject template cannot exceed 200 characters'],
  },
  replyBodyTemplate: {
    type: String,
    default: 'Hi {name},\n\n',
    trim: true,
    maxlength: [2000, 'Body template cannot exceed 2000 characters'],
  },
}, {
  timestamps: true,
});

SiteSettingsSchema.set('toJSON', {
  transform: function(doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  }
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
