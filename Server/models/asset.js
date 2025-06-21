import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  campaign: {
    type: String,
    required: true,
    index: true
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: String
  },
  downloads: {
    type: Number,
    default: 0
  },
  downloadedAt: {
    type: Date
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

export default mongoose.model('asset', assetSchema);
