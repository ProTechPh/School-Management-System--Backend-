import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  subjects: mongoose.Types.ObjectId[];
  enrolledAt: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'COMPLETED';
  academicYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    subjects: [{
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'COMPLETED'],
        message: 'Status must be one of: ACTIVE, INACTIVE, SUSPENDED, COMPLETED',
      },
      default: 'ACTIVE',
    },
    academicYear: {
      type: Number,
      required: [true, 'Academic year is required'],
      min: [2020, 'Academic year must be 2020 or later'],
      max: [2030, 'Academic year must be 2030 or earlier'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
enrollmentSchema.index({ student: 1, class: 1, academicYear: 1 }, { unique: true });
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ class: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ academicYear: 1 });

// Ensure virtual fields are serialized
enrollmentSchema.set('toJSON', { virtuals: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);