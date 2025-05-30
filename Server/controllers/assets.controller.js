import { v4 as uuidv4 } from 'uuid';
// import multer from 'multer';
import path from 'path';
import CodeModel from '../models/code.js';
import { generateImage } from '../utils/assets.util.js';
import { getClientUrl } from '../utils/config.util.js';
import {s3, PutObjectCommand} from '../configs/s3.js';

const generate = async (req, res) => {
  try {
    const { count, campaignName = 'campaign1' } = req.body;
    console.log("Request campaignName:", campaignName);

    if (!count || count < 1 || count > 1000) {
      return res
        .status(400)
        .json({ error: "Count must be between 1 and 1000" });
    }

    const generatedAssets = [];
    const baseDir = path.join(process.cwd(), "storage", "codes");
    const appUrl = getClientUrl();

    for (let i = 0; i < count; i++) {
      const timestamp = Date.now();
      const uuid = uuidv4();
      const uniqueCode = `${timestamp}-${uuid}`;
      let imageBuffer;
      let s3Url;
      try {
        // Get image buffer
        imageBuffer = await generateImage(
          uniqueCode,
          baseDir,
          appUrl
        ); 
        
        // upload each image in s3
        await s3.send(new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${campaignName}/${uniqueCode}`,
          Body: imageBuffer,
          ContentType: 'image/png',
        }));

        s3Url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${campaignName}/${uniqueCode}`;
  
      } catch (error) {
        console.error("Error uploading to S3:", error);
        continue;
      }
      console.log("campaignName:", campaignName);
      const savedCode = await new CodeModel({
        code: uniqueCode,
        imagePath: s3Url,
        campaign: campaignName
      }).save();

      generatedAssets.push({
        code: savedCode.code,
        imageUrl: savedCode.imagePath
      });
    }

    res.json({ codes: generatedAssets });
  } catch (error) {
    console.error("Error generating codes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCodes = async (req, res) => {
  try {
    const { campaign } = req.query;
    const query = campaign ? { campaign } : {};
    
    const codes = await CodeModel.find(query).sort({ createdAt: -1 });
    res.json(codes.map((doc) => ({
        id: doc._id,
        code: doc.code,
        imageUrl: doc.imagePath,
      
      })));
  } catch (error) {
    console.error("Error fetching codes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getPatternOptions = async (req, res) => {
//   res.json({
//     patternTypes: ['shapes']
//   });
// };

const getCodeById = async (req, res) => {
  try {
    const { code } = req.params;
    const codeData = await CodeModel.findOne({ code });

    if (!codeData) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json({
      code: codeData.code,
      imageUrl: codeData.imagePath
    });
  } catch (error) {
    console.error("Error fetching code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  generate,
  getAllCodes,
  // getPatternOptions,
  getCodeById,
};
