import LocationModel from '../models/location.js';

export const getLocations = async (req, res, next) => {
  const campaign = req.query.campaign;
  const query = req.user.isSuperAdmin ? {} : { userId: req.userId };
  if (campaign && campaign !== 'all') query.campaign = campaign;

  try {
    const locations = await LocationModel.find(query).sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    console.log('Error fetching locations:', error);
    next(error);
  }
};
