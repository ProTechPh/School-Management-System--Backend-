import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  class: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  description?: string;
  credits: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [100, 'Subject name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
      maxlength: [10, 'Subject code cannot exceed 10 characters'],
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: [1, 'Credits must be at least 1'],
      max: [10, 'Credits cannot exceed 10'],
      default: 1,
    },
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'INACTIVE'],
        message: 'Status must be either ACTIVE or INACTIVE',
      },
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subjectSchema.index({ code: 1, class: 1 }, { unique: true });
subjectSchema.index({ teacher: 1 });
subjectSchema.index({ class: 1 });
subjectSchema.index({ status: 1 });

// Ensure virtual fields are serialized
subjectSchema.set('toJSON', { virtuals: true });

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema);

