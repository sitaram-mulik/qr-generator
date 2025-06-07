import CampaignModel from '../models/campaign.js';

export const createCampaign = async (req, res) => {
  const { name, validTillDate, validTillTime } = req.body;

  if (!name || !validTillDate || !validTillTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Combine date and time and convert to UTC Date object
  const validTill = new Date(`${validTillDate}T${validTillTime}Z`);

  // Save campaign to the databas
  const newCampaign = new CampaignModel({ name, validTill, userId: req.userId});
  await newCampaign.save();


  res.status(200).json({ message: "Campaign created successfully" });
}

export const getAllCampaigns = async (req, res) => {
    try {           
        const campaigns = await CampaignModel.find({userId: req.userId}).sort({ createdAt: -1 });
        res.status(200).json(campaigns);
    }
    catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}