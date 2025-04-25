const { v4: uuidv4 } = require("uuid");
const path = require("path");
const QRCodeModel = require("../models/QRCode");
const { saveCombinedImage, patternTypes } = require("../utils/image.util");

const generateCodes = async (req, res) => {
  try {
    const { count, patternType } = req.body;

    if (!count || count < 1 || count > 1000) {
      return res
        .status(400)
        .json({ error: "Count must be between 1 and 1000" });
    }

    // Validate pattern type if provided
    if (patternType && !patternTypes.includes(patternType)) {
      return res.status(400).json({
        error: `Invalid pattern type. Available types: ${patternTypes.join(
          ", "
        )}`,
      });
    }

    const generatedCodes = [];
    const baseDir = path.join(__dirname, "..", "storage", "codes");
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    for (let i = 0; i < count; i++) {
      const timestamp = Date.now();
      const uuid = uuidv4();
      const uniqueCode = `${timestamp}-${uuid}`;

      const { imagePath } = await saveCombinedImage(
        uniqueCode,
        baseDir,
        appUrl,
        { patternType }
      );

      const savedCode = await new QRCodeModel({
        code: uniqueCode,
        qrPath: imagePath,
        imagePath,
        patternType,
      }).save();

      generatedCodes.push({
        code: savedCode.code,
        imageUrl: savedCode.imagePath,
        patternType: savedCode.patternType,
      });
    }

    res.json({ codes: generatedCodes });
  } catch (error) {
    console.error("Error generating codes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCodes = async (req, res) => {
  try {
    const codes = await QRCodeModel.find({}).sort({ createdAt: -1 });
    res.json({
      codes: codes.map((doc) => ({
        id: doc._id,
        code: doc.code,
        imageUrl: doc.imagePath,
        patternType: doc.patternType,
        timestamp: doc.code.split("-")[0],
        uuid: doc.code.split("-").slice(1).join("-"),
        createdAt: doc.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching codes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPatternOptions = async (req, res) => {
  res.json({
    patternTypes,
  });
};

const getCodeById = async (req, res) => {
  try {
    const { code } = req.params;
    const codeData = await QRCodeModel.findOne({ code });

    if (!codeData) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json({
      code: codeData.code,
      imageUrl: codeData.imagePath,
      patternType: codeData.patternType,
      timestamp: codeData.code.split("-")[0],
      createdAt: codeData.createdAt,
    });
  } catch (error) {
    console.error("Error fetching code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  generateCodes,
  getAllCodes,
  getPatternOptions,
  getCodeById,
};
