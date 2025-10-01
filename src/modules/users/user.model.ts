import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  meta?: {
    parentOf?: mongoose.Types.ObjectId[];
    studentOf?: mongoose.Types.ObjectId[];
    subjects?: mongoose.Types.ObjectId[];
    class?: mongoose.Types.ObjectId;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
        message: 'Role must be one of: ADMIN, TEACHER, STUDENT, PARENT',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
        message: 'Status must be one of: ACTIVE, INACTIVE, SUSPENDED',
      },
      default: 'ACTIVE',
    },
    meta: {
      parentOf: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      studentOf: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject',
      }],
      class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.passwordHash;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

export const User = mongoose.model<IUser>('User', userSchema);

