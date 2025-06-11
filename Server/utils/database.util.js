import mongoose from 'mongoose';
import AssetModel from '../models/asset.js';

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    AssetModel.syncIndexes();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDatabase;
