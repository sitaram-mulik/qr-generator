import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import AssetModel from '../models/asset.js';
import UserModel from '../models/user.js';
import { buildAssetsDBQuery, generateImage } from '../utils/assets.util.js';
import { getClientUrl } from '../utils/config.util.js';
import {s3, PutObjectCommand, GetObjectCommand} from '../configs/s3.js';
import archiver from 'archiver';
import { getAvailableCredits, setCreditsData } from '../utils/user.util.js'

const generate = async (req, res) => {
  try {
    const { count, campaignName = 'Test', domain } = req.body;

    const generatedAssets = [];
    const baseDir = path.join(process.cwd(), "storage", "codes");
    const appUrl = domain || getClientUrl();

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
          Key: `${campaignName}/${uniqueCode}.png`,
          Body: imageBuffer,
          ContentType: 'image/png',
        }));

        s3Url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${campaignName}/${uniqueCode}.png`;
  
      } catch (error) {
        console.error("Error uploading to S3:", error);
        continue;
      }
      console.log("campaignName:", campaignName);
      const savedCode = await new AssetModel({
        code: uniqueCode,
        imagePath: s3Url,
        campaign: campaignName,
        userId: req.userId
      }).save();

      generatedAssets.push({
        code: savedCode.code,
        imageUrl: savedCode.imagePath
      });
    }

    try {
      await setCreditsData(req.userId, { newAssetsCount: generatedAssets.length });
    } catch (err) {
      console.log('Failed to update stats ', err);
    }
  

    res.json({ codes: generatedAssets });
  } catch (error) {
    console.error("Error generating codes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAssets = async (req, res) => {
  try {
    const query = buildAssetsDBQuery(req);
    const assets = await AssetModel.find(query).sort({ createdAt: -1 }).limit(100);
    const count = await AssetModel.countDocuments(query);
    res.json({assets, count });
  } catch (error) {
    console.error("Error fetching codes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAssetsCount = async (req, res) => {
  try {
    const query = buildAssetsDBQuery(req);
    const totalCount = await AssetModel.countDocuments(query);
    console.log('totalCount ', totalCount)
    res.json({
      count: totalCount
    });
  } catch (error) {
    console.error("Error fetching codes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAssetByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const codeData = await AssetModel.findOne({ code });

    if (!codeData) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json(codeData);
  } catch (error) {
    console.error("Error fetching code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyProduct = async (req, res) => {
  try {
    const { code } = req.params;
    const updateCode = await AssetModel.updateOne({code}, {verifiedAt: new Date(), verifiedBy: 'Me'})

    if (!updateCode) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json(updateCode);
  } catch (error) {
    console.error("Error updating asset details", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const downloadAssets = async (req, res) => {
  let query = buildAssetsDBQuery(req);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=images.zip');

  const assets = await AssetModel.find(query).sort({ createdAt: -1 }).limit(req.query.count ? req.query.count : 0);

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);

  const summary = {
    total: assets.length,
    success: 0,
    failure: 0,
  }


  for (const asset of assets) {
    try {
      const key = asset.code;
      const command = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: `${asset.campaign}/${key}.png` });
      const data = await s3.send(command);
      archive.append(data.Body, { name: `${key}.png` });
      await AssetModel.updateOne({code: key}, { downloads: (asset.downloads || 0) + 1,  downloadedAt: Date.now()});
      summary.success++;
    } catch (err) {
      console.log('Error while downloading asset ', err);
      summary.failure++;
      console.warn(`Skipping missing key: ${asset.code}`);
    }
  }

  
  archive.append(JSON.stringify(summary), { name: 'summary.json' });
  await archive.finalize().then(async () => {
    await setCreditsData(req.userId, { newDownloadsCount: summary.success });
  });
};

const getStatistics = async (req, res) => {
  try {
    const campaign = req.query.campaign;
    const query = { userId: req.userId};
    if(campaign) query.campaign = campaign;
    const totalCount = await AssetModel.countDocuments(query);
    const downloadedCount = await AssetModel.countDocuments({...query, downloads: { $gt: 0 } });
    const verifiedCount = await AssetModel.countDocuments({...query, verifiedAt: { $exists: true }});
    res.json({
      totalCount,
      downloadedCount,
      verifiedCount
    });
  } catch (error) {
    console.error("Error fetching codes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export {
  generate,
  getAssets,
  downloadAssets,
  getAssetByCode,
  verifyProduct,
  getAssetsCount,
  getStatistics
};
