import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  validTill: {
    type: Date,
    required: true
  },
  validity: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
    default: 1
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('campaign', campaignSchema);
