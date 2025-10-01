import mongoose, { Document, Schema } from 'mongoose';

export interface IGrade extends Document {
  exam: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  marks: number;
  grade: string; // A, B, C, D, F or computed
  remarks?: string;
  gradedBy: mongoose.Types.ObjectId;
  gradedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const gradeSchema = new Schema<IGrade>(
  {
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam is required'],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be negative'],
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      trim: true,
      uppercase: true,
      maxlength: [2, 'Grade cannot exceed 2 characters'],
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [200, 'Remarks cannot exceed 200 characters'],
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Graded by is required'],
    },
    gradedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
gradeSchema.index({ exam: 1, student: 1 }, { unique: true });
gradeSchema.index({ exam: 1 });
gradeSchema.index({ student: 1 });
gradeSchema.index({ grade: 1 });
gradeSchema.index({ gradedBy: 1 });

// Pre-save middleware to calculate grade based on marks
gradeSchema.pre('save', function(next) {
  if (this.isModified('marks')) {
    // Get the exam to access maxMarks
    this.constructor.findById(this.exam).then((exam: any) => {
      if (exam) {
        const percentage = (this.marks / exam.maxMarks) * 100;
        
        if (percentage >= 90) this.grade = 'A+';
        else if (percentage >= 85) this.grade = 'A';
        else if (percentage >= 80) this.grade = 'A-';
        else if (percentage >= 75) this.grade = 'B+';
        else if (percentage >= 70) this.grade = 'B';
        else if (percentage >= 65) this.grade = 'B-';
        else if (percentage >= 60) this.grade = 'C+';
        else if (percentage >= 55) this.grade = 'C';
        else if (percentage >= 50) this.grade = 'C-';
        else if (percentage >= 45) this.grade = 'D';
        else this.grade = 'F';
      }
      next();
    }).catch(next);
  } else {
    next();
  }
});

// Ensure virtual fields are serialized
gradeSchema.set('toJSON', { virtuals: true });

export const Grade = mongoose.model<IGrade>('Grade', gradeSchema);