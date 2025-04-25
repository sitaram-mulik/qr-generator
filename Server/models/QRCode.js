const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  qrPath: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  patternType: {
    type: String,
    enum: [
      "waves",
      "circles",
      "mosaic",
      "gradient",
      "lines",
      "boxes",
      "bigwaves",
      "eegwaves",
      "flowwaves",
      "biomorphic",
      "topographic",
      "ripples",
      "concentricWaves",
    ],
    default: "waves",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QRCode", qrCodeSchema);
