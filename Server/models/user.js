import mongoose from 'mongoose';

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
  isActive: {
    type: Boolean,
    default: true
  },
  displayName: {
    type: String,
    required: true
  },
  subscriptionStarts: {
    type: Date,
    default: new Date()
  },
  subscriptionEnds: {
    type: Date,
    default: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Default to one year from now
  },
  credits: {
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
  gracePeriod: {
    type: Number,
    default: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('user', userSchema);
