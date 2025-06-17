import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import ApiError from '../utils/ApiError.js';

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName }).select('+password');

    console.log('user:', user);
    if (!user || !user.password) {
      throw new ApiError(400, 'Invalid credentials');
    }

    if (!user.isActive) {
      throw new ApiError(400, 'User acount is deactivated, contact admin.');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new ApiError(400, 'Invalid credentials');
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.displayName,
        credits: user.credits,
        domain: user.domain,
        isSuperAdmin: user.isSuperAdmin,
        subscriptionEnds: user.subscriptionEnds,
        downloads: user.downloads,
        totalAssets: user.totalAssets
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    console.log('Login successful for user:', user);

    res.json(user);
  } catch (error) {
    console.log('Login error:', error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.log('Logout error:', error);
    next(error);
  }
};

// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     console.log("Verification token:", token);
//     const user = await User.findOne({ verificationToken: token });
//     console.log("user:", user);
//     if (!user) {
//       return res
//         .status(400)
//         .json({ error: "Verification link is either invalid or expired" });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     res.json({
//       message: "Email verified successfully, please login to use our services.",
//     });
//   } catch (error) {
//     console.log("Verification error:", error);
//     res
//       .status(500)
//       .json({ error: "Verification failed due to some issue", details: error });
//   }
// };

export { login, logout };
