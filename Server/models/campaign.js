import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  validTill: {
    type: Date,
    required: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("campaign", campaignSchema);
