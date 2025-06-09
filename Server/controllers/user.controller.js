import UserModel from '../models/user.js';
import bcrypt from "bcryptjs";
import { getDomainName, addGreenlockSite } from '../utils/domain.util.js';

export const getProfile = async (req, res) => {
    try {
      console.log('verified ', req.user);
      const profile = await UserModel.findById(req.userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching codes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { userName, displayName, password, credits, domain } = req.body;

    const existingUser = await UserModel.findOne({ userName });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const fullDomain = `${domain}.${getDomainName() || 'com'}`;

    const user = new UserModel({
      userName,
      displayName, 
      password: hashedPassword, 
      credits,
      availableCredits: credits,
      domain: fullDomain,
    });

    await user.save();

    try {
      addGreenlockSite(fullDomain,[fullDomain]);      
    } catch (error) {
      console.log('Error while adding domain SSL ', error);
    }

    res.json({
      message:
        "Registration successful.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userName, displayName, password, credits, domain } = req.body;

    const updateData = {
      userName,
      displayName,
      credits,
      domain: `${domain}.${getDomainName() || 'com'}`,
    };

    if(password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
 

    const user = await UserModel.updateOne({userName}, updateData);

    res.json({
      message:
        "User updated.",
    });
  } catch (error) {
    console.error("Error while updating user:", error);
    res.status(500).json({ message: error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userName = req.query.userName;
    await UserModel.deleteOne({userName});

    res.json({
      message:
        "User deleted.",
    });
  } catch (error) {
    console.error("Error while updating user:", error);
    res.status(500).json({ message: error });
  }
};
