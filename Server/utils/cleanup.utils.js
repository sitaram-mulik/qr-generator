import { s3, DeleteObjectsCommand } from '../configs/s3.js';
import CampaignModel from '../models/campaign.js';
import AssetModel from '../models/asset.js';
import LocationModel from '../models/location.js';
import UserModel from '../models/user.js';

export const clearCampaignData = async campaignName => {
  // Delete s3 objects
  const assets = await AssetModel.find({ campaign: campaignName });
  await deleteS3Objects(assets);

  // delete from Assets data from database
  const deletedAssets = await AssetModel.deleteMany({ campaign: campaignName });

  // delete from Location data from database
  await LocationModel.deleteMany({ campaign: campaignName });

  // delete actual campaign from database
  await CampaignModel.deleteOne({ name: campaignName });
  return deletedAssets;
};

export const clearUsersData = async userId => {
  // Delete s3 objects
  const assets = await AssetModel.find({ userId });
  await deleteS3Objects(assets);

  // delete from Assets data from database
  const deletedAssets = await AssetModel.deleteMany({ userId });

  // delete from Campaign data from database
  await CampaignModel.deleteMany({ userId });

  // delete from Location data from database
  await LocationModel.deleteMany({ userId });

  // Disable actual user from database
  await UserModel.updateOne({ _id: userId }, { $set: { isActive: false } });
  return deletedAssets;
};

export const deleteS3Objects = async assets => {
  let batch = [];
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    // create batch of 1000 assets to delete

    batch.push({ Key: `${asset.campaign}/${asset.code}.png` });
    console.log(`batch ${i} `, batch);
    if (batch.length === 1000 || i === assets.length - 1) {
      await deleteBatchFromS3(batch);
      batch = []; // Clear the batch
    }
  }
};

const deleteBatchFromS3 = async batch => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Delete: {
      Objects: batch,
      Quiet: true
    }
  };

  try {
    const command = new DeleteObjectsCommand(params);
    const res = await s3.send(command);
    console.log('Batch delete successful:', res);
    return res;
  } catch (error) {
    console.error('Error deleting objects from S3:', error);
    throw error;
  }
};
