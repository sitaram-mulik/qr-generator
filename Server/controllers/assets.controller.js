import { v4 as uuidv4 } from 'uuid';
// import multer from 'multer';
import path from 'path';
import AssetModel from '../models/asset.js';
import UserModel from '../models/user.js';
import { buildAssetsDBQuery, generateImage } from '../utils/assets.util.js';
import { getClientUrl } from '../utils/config.util.js';
import {s3, PutObjectCommand, GetObjectCommand} from '../configs/s3.js';
import archiver from 'archiver';

const generate = async (req, res) => {
  try {
    const { count, campaignName = 'Test', domain } = req.body;
    console.log("Request campaignName:", req.userId);

    if (!count || count < 1 || count > 100) {
      return res
        .status(400)
        .json({ error: "Count must be between 1 and 100" });
    }

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
      await UserModel.updateOne({userId: req.userId}, {$set: {totalAssets: req.user?.totalAssets || 0 + generatedAssets.length }});
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
    const codes = await AssetModel.find(query).sort({ createdAt: -1 }).limit(100);
    ;
    res.json(codes);
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
  const query = buildAssetsDBQuery(req);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=images.zip');

  const assets = await AssetModel.find(query).sort({ createdAt: -1 });
  console.log('Keys to download:', assets.map(a => a.code));

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
      if(key === '1749288407152-a9c746dd-99a9-4a8e-966c-9e493e68e571') throw 'Hey';
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

  try {
    await UserModel.updateOne({userId: req.userId}, {$set: {downloads: req.user?.downloads || 0 + summary.success }});
  } catch (err) {
    console.log('Failed to update stats ', err);
  }


  archive.append(JSON.stringify(summary), { name: 'summary.json' });
  await archive.finalize();
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
