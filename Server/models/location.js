import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  country: {
    type: String
  },
  region: {
    type: String
  },
  timezone: {
    type: String
  },
  city: {
    type: String
  },
  range: {
    type: String
  },
  ll: {
    type: String
  },
  area: {
    type: Number
  },
  campaign: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("location", locationSchema);