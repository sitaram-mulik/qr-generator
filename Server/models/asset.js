import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  campaign: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: String
  },
  downloads: {
    type: Number,
    default: 0,
  },
  downloadedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("asset", assetSchema);
