import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
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
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("code", codeSchema);
