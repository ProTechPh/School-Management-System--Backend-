import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  body: string;
  audience: 'ALL' | 'CLASS' | 'ROLE' | 'USER';
  targets: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date;
  expiresAt?: Date;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      trim: true,
      maxlength: [2000, 'Body cannot exceed 2000 characters'],
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      enum: {
        values: ['ALL', 'CLASS', 'ROLE', 'USER'],
        message: 'Audience must be one of: ALL, CLASS, ROLE, USER',
      },
    },
    targets: [{
      type: Schema.Types.ObjectId,
      refPath: 'targetModel',
    }],
    targetModel: {
      type: String,
      enum: ['User', 'Class'],
      required: function() {
        return this.audience !== 'ALL';
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        message: 'Priority must be one of: LOW, MEDIUM, HIGH, URGENT',
      },
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        message: 'Status must be one of: DRAFT, PUBLISHED, ARCHIVED',
      },
      default: 'DRAFT',
    },
    publishedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    attachments: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes
announcementSchema.index({ audience: 1, targets: 1 });
announcementSchema.index({ createdBy: 1 });
announcementSchema.index({ status: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ publishedAt: 1 });
announcementSchema.index({ expiresAt: 1 });

// Pre-save middleware to set publishedAt when status changes to PUBLISHED
announcementSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'PUBLISHED' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Ensure virtual fields are serialized
announcementSchema.set('toJSON', { virtuals: true });

export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);