import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  name: string;
  section: string;
  year: number;
  classTeacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  subjects: mongoose.Types.ObjectId[];
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
      maxlength: [50, 'Class name cannot exceed 50 characters'],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      maxlength: [10, 'Section cannot exceed 10 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Academic year is required'],
      min: [2020, 'Year must be 2020 or later'],
      max: [2030, 'Year must be 2030 or earlier'],
    },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Class teacher is required'],
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    subjects: [{
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    capacity: {
      type: Number,
      required: [true, 'Class capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [100, 'Capacity cannot exceed 100'],
      default: 30,
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
classSchema.index({ name: 1, section: 1, year: 1 }, { unique: true });
classSchema.index({ classTeacher: 1 });
classSchema.index({ status: 1 });

// Virtual for class display name
classSchema.virtual('displayName').get(function() {
  return `${this.name} - ${this.section}`;
});

// Ensure virtual fields are serialized
classSchema.set('toJSON', { virtuals: true });

export const Class = mongoose.model<IClass>('Class', classSchema);

