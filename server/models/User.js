import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"],
      default: 'EMPLOYEE',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const User = mongoose.model('User', userSchema);

