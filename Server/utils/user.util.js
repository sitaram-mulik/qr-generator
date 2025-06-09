import UserModel from '../models/user.js';

export const getAvailableCredits = async (userId, res) => {
    const userData = await UserModel.findOne({userId: userId});
    const availableCredits = userData.credits - (userData.totalAssets + userData.downloads);
    if(availableCredits > count) {
      return res.status(403).json({ message: availableCredits <= 0 ? `You dont have any credits left` : `Insufficient credits, availableCredits are ${availableCredits}, try requesting less items.`});
    }
}

export const setCreditsData = async (userId, {newAssetsCount, newDownloadsCount}) => {
    try {
        if(newAssetsCount) {
            await UserModel.updateOne({_id: userId}, {$inc: { totalAssets: newAssetsCount }});
        }
        if(newDownloadsCount) {
            await UserModel.updateOne({_id: userId}, {$inc: { downloads: newDownloadsCount }});
        }
    } catch (error) {
        console.log('Failed to update stats ', err);
    }
}