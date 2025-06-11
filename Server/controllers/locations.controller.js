import LocationModel from '../models/location.js';

export const getLocations = async (req, res, next) => {
  try {
    const locations = await LocationModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    console.log('Error fetching locations:', error);
    next(error);
  }
};
