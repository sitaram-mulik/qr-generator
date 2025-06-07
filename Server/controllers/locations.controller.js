import LocationModel from '../models/location.js';

export const getLocations = async (req, res) => {
    const locations = await LocationModel.find({ userId: req.userId}).sort({ createdAt: -1 });
    res.json(locations);
}