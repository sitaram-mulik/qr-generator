import UserModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import { getDomainName, addGreenlockSite } from '../utils/domain.util.js';
import ApiError from '../utils/ApiError.js';
import { clearUsersData } from '../utils/cleanup.utils.js';

export const getProfile = async (req, res, next) => {
  try {
    console.log('verified ', req.user);
    const profile = await UserModel.findById(req.userId);
    res.json(profile);
  } catch (error) {
    console.log('Error fetching codes:', error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.json(user);
  } catch (error) {
    console.log('Error fetching codes:', error);
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.log('Error fetching users:', error);
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const {
      userName,
      displayName,
      password,
      credits,
      domain,
      subscriptionStarts,
      subscriptionEnds
    } = req.body;

    const existingUser = await UserModel.findOne({ userName });

    if (existingUser) {
      throw new ApiError(400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const fullDomain = `${domain}.${getDomainName() || 'com'}`;

    const user = new UserModel({
      userName,
      displayName,
      password: hashedPassword,
      credits,
      domain: fullDomain,
      subscriptionStarts,
      subscriptionEnds
    });

    await user.save();

    try {
      addGreenlockSite(fullDomain, [fullDomain]);
    } catch (error) {
      console.log('Error while adding domain SSL ', error);
    }

    res.json({
      message: 'Registration successful.'
    });
  } catch (error) {
    console.log('Registration error:', error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const {
      userName,
      displayName,
      password,
      credits,
      domain,
      subscriptionEnds,
      subscriptionStarts
    } = req.body;

    const updateData = {
      displayName,
      credits,
      subscriptionEnds,
      subscriptionStarts,
      subscriptionEnds
    };

    if (domain) {
      updateData.domain = `${domain}.${getDomainName() || 'com'}`;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await UserModel.updateOne({ userName }, updateData);

    res.json({
      message: 'User updated succesfully.'
    });
  } catch (error) {
    console.log('Error while updating user:', error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    await clearUsersData(userId);

    res.json({
      message: 'User data cleared!'
    });
  } catch (error) {
    console.log('Error while updating user:', error);
    next(error);
  }
};

export const changeUserStatus = async (req, res, next) => {
  const { isActive, id } = req.body;
  try {
    await UserModel.updateOne({ _id: id }, { isActive });

    res.json({
      message: `User is now ${isActive ? 'active' : 'inactive'}.`
    });
  } catch (error) {
    console.log('Error while updating user:', error);
    next(error);
  }
};
