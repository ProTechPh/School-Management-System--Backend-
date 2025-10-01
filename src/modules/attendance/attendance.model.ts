import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  date: Date;
  class: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  markedBy: mongoose.Types.ObjectId;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
        message: 'Status must be one of: PRESENT, ABSENT, LATE, EXCUSED',
      },
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked by is required'],
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [200, 'Remarks cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
attendanceSchema.index({ date: 1, class: 1, student: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ class: 1 });
attendanceSchema.index({ student: 1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ markedBy: 1 });

// Ensure virtual fields are serialized
attendanceSchema.set('toJSON', { virtuals: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);