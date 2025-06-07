import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";
import { sendVerificationEmail } from "../utils/email.util.js";
import { getClientUrl } from "../utils/config.util.js";

const register = async (req, res) => {
  // try {
  //   const { name, email, password } = req.body;

  //   const existingUser = await User.findOne({ email });
  //   if (existingUser) {
  //     return res.status(400).json({ error: "Email already registered" });
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const verificationToken = uuidv4();

  //   const user = new User({
  //     name,
  //     email,
  //     password: hashedPassword,
  //     verificationToken,
  //   });

  //   await user.save();

  //   const appUrl = getClientUrl();
  //   await sendVerificationEmail(email, verificationToken, appUrl);

  //   res.json({
  //     message:
  //       "Registration successful. Please check your email to verify your account.",
  //   });
  // } catch (error) {
  //   console.error("Registration error:", error);
  //   res.status(500).json({ error: "Registration failed", details: error });
  // }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    console.log("user:", user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // if (!user.isVerified) {
    //   return res.status(401).json({ error: "Please verify your email first" });
    // }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.displayName, usageLimit: user.limit, domain: user.domain },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    console.log("Login successful for user:", user);

    res.json({
      id: user.userName,
      name: user.displayName,
      credits: user.credits,
      domain: user.domain,
      downloads: user.downloads,
      totalAssets: user.totalAssets
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Verification token:", token);
    const user = await User.findOne({ verificationToken: token });
    console.log("user:", user);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Verification link is either invalid or expired" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
      message: "Email verified successfully, please login to use our services.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res
      .status(500)
      .json({ error: "Verification failed due to some issue", details: error });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

export {
  register,
  login,
  verifyEmail,
  logout,
};
