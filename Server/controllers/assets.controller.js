import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import AssetModel from '../models/asset.js';
import CampaignModel from '../models/campaign.js';
import { buildAssetsDBQuery, generateImage, streamToBuffer } from '../utils/assets.util.js';
import { getClientUrl } from '../utils/config.util.js';
import { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '../configs/s3.js';
import archiver from 'archiver';
import { setCreditsData } from '../utils/user.util.js';
import sharp from 'sharp';
import { updateLocation } from '../utils/location.util.js';

import ApiError from '../utils/ApiError.js';

const generate = async (req, res, next) => {
  try {
    const {
      count,
      campaignName = 'Test',
      patternType = 'geopattern',
      size = 200,
      includePattern = true
    } = req.body;
    const { domain, credits } = req.user;

    if (count > 100 || count < 1) throw new ApiError('400', 'Count must be between 1 and 100');

    if (size > 500 || size < 100) throw new ApiError('400', 'Size must be between 1 and 100');

    const generatedAssets = [];
    const baseDir = path.join(process.cwd(), 'storage', 'codes');
    const appUrl = domain ? `https://${domain}` : getClientUrl();

    for (let i = 0; i < count; i++) {
      const timestamp = Date.now();
      const uuid = uuidv4();
      const uniqueCode = `${timestamp}-${uuid}`;
      let imageBuffer;
      try {
        // Get image buffer
        imageBuffer = await generateImage(
          uniqueCode,
          baseDir,
          appUrl,
          patternType,
          parseInt(size),
          includePattern
        );

        // upload each image in s3
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${campaignName}/${uniqueCode}.png`,
            Body: imageBuffer,
            ContentType: 'image/png'
          })
        );
      } catch (error) {
        console.log('Error uploading to S3:', error);
        continue;
      }
      const savedCode = await new AssetModel({
        code: uniqueCode,
        campaign: campaignName,
        userId: req.userId
      }).save();

      generatedAssets.push({
        code: savedCode.code
      });
    }

    try {
      await setCreditsData(req.userId, { newAssetsCount: generatedAssets.length, credits });
    } catch (err) {
      console.log('Failed to update stats ', err);
    }

    res.json({ codes: generatedAssets });
  } catch (error) {
    console.log('Error generating codes:', error);
    next(error);
  }
};

const getAssets = async (req, res, next) => {
  try {
    const query = buildAssetsDBQuery(req);
    const assets = await AssetModel.find(query).sort({ createdAt: -1 }).limit(100);
    const count = await AssetModel.countDocuments(query);
    res.json({ assets, count });
  } catch (error) {
    console.log('Error fetching codes:', error);
    next(error);
  }
};

const getAssetsCount = async (req, res, next) => {
  try {
    const query = buildAssetsDBQuery(req);
    const totalCount = await AssetModel.countDocuments(query);
    res.json({
      count: totalCount
    });
  } catch (error) {
    console.log('Error fetching codes:', error);
    next(error);
  }
};

const getAssetByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const codeData = await AssetModel.findOne({ code });

    if (!codeData) {
      throw new ApiError(404, 'Code not found');
    }

    res.json(codeData);
  } catch (error) {
    console.log('Error fetching code:', error);
    next(error);
  }
};

const getAssetPattern = async (req, res, next) => {
  try {
    const { code } = req.params;

    const asset = await AssetModel.findOne({ code });
    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }
    const Key = `${asset.campaign}/${code}.png`;
    const Bucket = process.env.AWS_S3_BUCKET;
    const command = new GetObjectCommand({
      Bucket,
      Key
    });
    const data = await s3.send(command);

    data.Body.pipe(res);
  } catch (error) {
    console.log('Error getting asset pattern image', error);
    next(error);
  }
};

const getVerifiedAssetPattern = async (req, res, next) => {
  try {
    const { code } = req.params;

    const asset = await AssetModel.findOne({ code });
    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }
    console.log('asset ', asset);
    const Key = `${asset.campaign}/${code}.png`;
    const Bucket = process.env.AWS_S3_BUCKET;
    const command = new GetObjectCommand({
      Bucket,
      Key
    });
    const data = await s3.send(command);
    if (!data.Body) {
      throw ApiError('400', 'Image not found');
    }
    // Convert stream to buffer
    const imageBuffer = await streamToBuffer(data.Body);

    // Get image width
    const metadata = await sharp(imageBuffer).metadata();
    const halfWidth = Math.floor(metadata.width / 2);

    // Cut image in half
    const patternImage = sharp(imageBuffer).extract({
      left: halfWidth, // start from middle
      top: 0,
      width: metadata.width - halfWidth, // cover remaining part
      height: metadata.height
    });

    res.setHeader('Content-Type', 'image/png');
    patternImage.pipe(res);

    await s3.send(
      new DeleteObjectCommand({
        Bucket,
        Key
      })
    );
  } catch (error) {
    console.log('Error getting asset pattern image', error);
    next(error);
  }
};

const verifyProduct = async (req, res, next) => {
  try {
    const { code } = req.params;
    const asset = await AssetModel.findOne({ code });
    if (!asset) {
      throw new ApiError(404, 'Product not found');
    }

    const campaignDetails = await CampaignModel.findOne({ name: asset.campaign });

    if (!campaignDetails) {
      throw new ApiError(404, 'Product not found');
    }

    const campaignValidity = campaignDetails.validTill;
    // check whether campaign is expired
    const isCampaignExpired = campaignValidity
      ? new Date(campaignValidity).getTime() < new Date().getTime()
      : true;

    if (isCampaignExpired) {
      throw new ApiError(404, 'This campaign is expired!');
    }

    if (asset.verifiedAt) {
      return res.status(200).json({ campaign: campaignDetails });
      // throw new ApiError();
    }
    await AssetModel.updateOne({ code }, { verifiedAt: new Date() });
    await updateLocation(req, asset.campaign, code, asset.userId);

    res.json({ asset, campaign: campaignDetails });
  } catch (error) {
    console.log('Error updating asset details', error);
    next(error);
  }
};

const downloadAssets = async (req, res, next) => {
  try {
    let query = buildAssetsDBQuery(req);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=images.zip');

    const assets = await AssetModel.find(query)
      .sort({ createdAt: -1 })
      .limit(req.query.count ? req.query.count : 0);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    const summary = {
      total: assets.length,
      success: 0,
      failure: 0
    };

    let extraDownloads = 0;

    for (const asset of assets) {
      try {
        const key = asset.code;
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${asset.campaign}/${key}.png`
        });
        const data = await s3.send(command);
        archive.append(data.Body, { name: `${key}.png` });
        await AssetModel.updateOne(
          { code: key },
          { downloads: (asset.downloads || 0) + 1, downloadedAt: Date.now() }
        );
        if (asset.downloads > 2) {
          extraDownloads++;
        }
        summary.success++;
      } catch (err) {
        console.log('Error while downloading asset ', err);
        summary.failure++;
        console.warn(`Skipping missing key: ${asset.code}`);
      }
    }

    archive.append(JSON.stringify(summary), { name: 'summary.json' });
    await archive.finalize().then(async () => {
      await setCreditsData(req.userId, { newDownloadsCount: summary.success, extraDownloads });
    });
  } catch (error) {
    console.log('Error downloading assets:', error);
    next(error);
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const campaign = req.query.campaign;
    const query = req.user.isSuperAdmin ? {} : { userId: req.userId };
    if (campaign && campaign !== 'all') query.campaign = campaign;
    const totalCount = await AssetModel.countDocuments(query);
    const downloadedCount = await AssetModel.countDocuments({ ...query, downloads: { $gt: 0 } });
    const verifiedCount = await AssetModel.countDocuments({
      ...query,
      verifiedAt: { $exists: true }
    });
    res.json({
      totalCount,
      downloadedCount,
      verifiedCount
    });
  } catch (error) {
    console.log('Error fetching codes:', error);
    next(error);
  }
};

export {
  generate,
  getAssets,
  downloadAssets,
  getAssetByCode,
  verifyProduct,
  getAssetsCount,
  getStatistics,
  getAssetPattern,
  getVerifiedAssetPattern
};
