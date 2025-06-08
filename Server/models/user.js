import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    default: 500
  },
  availableCredits: {
    type: Number,
    default: 500
  },
  totalAssets: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  domain: {
    type: String,
    required: true
  },
  isSuperAdmin: {
    type: Boolean,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("user", userSchema);
