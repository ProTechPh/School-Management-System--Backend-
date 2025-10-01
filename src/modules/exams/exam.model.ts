import mongoose, { Document, Schema } from 'mongoose';

export interface IExam extends Document {
  name: string;
  class: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  date: Date;
  maxMarks: number;
  duration: number; // in minutes
  examType: 'QUIZ' | 'MIDTERM' | 'FINAL' | 'ASSIGNMENT' | 'PROJECT';
  instructions?: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const examSchema = new Schema<IExam>(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
      maxlength: [100, 'Exam name cannot exceed 100 characters'],
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    date: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Maximum marks is required'],
      min: [1, 'Maximum marks must be at least 1'],
      max: [1000, 'Maximum marks cannot exceed 1000'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [480, 'Duration cannot exceed 8 hours'],
    },
    examType: {
      type: String,
      required: [true, 'Exam type is required'],
      enum: {
        values: ['QUIZ', 'MIDTERM', 'FINAL', 'ASSIGNMENT', 'PROJECT'],
        message: 'Exam type must be one of: QUIZ, MIDTERM, FINAL, ASSIGNMENT, PROJECT',
      },
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [1000, 'Instructions cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
        message: 'Status must be one of: SCHEDULED, ONGOING, COMPLETED, CANCELLED',
      },
      default: 'SCHEDULED',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
examSchema.index({ class: 1, subject: 1, date: 1 });
examSchema.index({ class: 1 });
examSchema.index({ subject: 1 });
examSchema.index({ date: 1 });
examSchema.index({ status: 1 });
examSchema.index({ examType: 1 });
examSchema.index({ createdBy: 1 });

// Ensure virtual fields are serialized
examSchema.set('toJSON', { virtuals: true });

export const Exam = mongoose.model<IExam>('Exam', examSchema);