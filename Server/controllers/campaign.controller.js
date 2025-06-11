import CampaignModel from '../models/campaign.js';
import ApiError from '../utils/ApiError.js';

export const createCampaign = async (req, res, next) => {
  try {
    const { name, validTillDate, validTillTime } = req.body;

    if (!name || !validTillDate || !validTillTime) {
      throw new ApiError(400, 'Missing required fields');
    }

    // Combine date and time and convert to UTC Date object
    const validTill = new Date(`${validTillDate}T${validTillTime}Z`);

    // Save campaign to the databas
    const newCampaign = new CampaignModel({ name, validTill, userId: req.userId });
    await newCampaign.save();

    res.status(200).json({ message: 'Campaign created successfully' });
  } catch (error) {
    console.log('Error creating campaign:', error);
    next(error);
  }
};

export const getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await CampaignModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    console.log('Error fetching campaigns:', error);
    next(error);
  }
};
