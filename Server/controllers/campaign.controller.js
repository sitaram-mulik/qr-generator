import CampaignModel from '../models/campaign.js';

export const createCampaign = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Campaign name is required" });
  }

  // Save campaign to the databas
  const newCampaign = new CampaignModel({ name });
  await newCampaign.save();


  res.status(200).json({ message: "Campaign created successfully" });
}

export const getAllCampaigns = async (req, res) => {
    try {           
        const campaigns = await CampaignModel.find().sort({ createdAt: -1 });
        res.status(200).json(campaigns);
    }
    catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}