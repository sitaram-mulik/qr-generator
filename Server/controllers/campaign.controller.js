import CampaignModel from '../models/campaign.js';
import ApiError from '../utils/ApiError.js';
import { clearCampaignData } from '../utils/cleanup.utils.js';

export const createCampaign = async (req, res, next) => {
  try {
    const { name, validity, description, title } = req.body;

    if (!name || !validity) {
      throw new ApiError(400, 'Missing required fields');
    }

    // Date calculations based on validity
    const currentDate = new Date();
    let validTillDate = new Date(currentDate);
    validTillDate.setFullYear(currentDate.getFullYear() + parseInt(validity));
    validTillDate = validTillDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    // set current time
    const validTillTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}:00`; // Format to HH:MM:SS
    if (validity < 1 || validity > 3) {
      throw new ApiError(400, 'Validity must be between 1 and 3 years');
    }

    // Combine date and time and convert to UTC Date object
    const validTill = new Date(`${validTillDate}T${validTillTime}Z`);

    // Save campaign to the databas
    const newCampaign = new CampaignModel({
      name,
      validity,
      validTill,
      userId: req.userId,
      title,
      description
    });
    await newCampaign.save();

    res.status(200).json({ message: 'Campaign created successfully' });
  } catch (error) {
    console.log('Error creating campaign:', error);
    next(error);
  }
};

export const getAllCampaigns = async (req, res, next) => {
  const query = req.user.isSuperAdmin
    ? req.query.userId
      ? { userId: req.query.userId }
      : {}
    : { userId: req.userId };
  try {
    const campaigns = await CampaignModel.find(query).sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    console.log('Error fetching campaigns:', error);
    next(error);
  }
};

export const deleteCampaign = async (req, res, next) => {
  const { campaignName } = req.body;
  try {
    const deletedAssets = await clearCampaignData(campaignName);
    res.status(200).json({
      message: `Campaign ${campaignName} and ${deletedAssets.deletedCount} assets deleted successfully`
    });
  } catch (error) {
    console.log('Error deleting campaign:', error);
    next(error);
  }
};

export const getCampaignDetails = async (req, res, next) => {
  const { campaign } = req.params;

  try {
    const campaignDetails = await CampaignModel.findOne({ name: campaign });
    res.status(200).json(campaignDetails);
  } catch (error) {
    console.log('Error fetching campaigns:', error);
    next(error);
  }
};

export const updateCampaign = async (req, res, next) => {
  const { name, title, description } = req.body;
  try {
    const campaignDetails = await CampaignModel.updateOne({ name }, { title, description });
    res.status(200).json(campaignDetails);
  } catch (error) {
    console.log('Error fetching campaigns:', error);
    next(error);
  }
};
