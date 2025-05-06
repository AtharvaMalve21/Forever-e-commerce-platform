const User = require("../models/userModel");
const Password = require("../models/passwordModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const passwordResetEmailTemplate = require("../utils/passwordResetEmailTemplate");
const transporter = require("../config/mailer");
dotenv.config();

exports.register = async (req, res) => {
  try {
    //fetch user details
    const { name, email, password, gender, phone, role } = req.body;

    //validate user details
    if (!name || !email || !password || !gender || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the details.",
      });
    }

    //validate phone
    if (phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be of 10 digits.",
      });
    }

    //check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      phone,
      role,
    });

    //generate token
    const token = jwt.sign(
      { _id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    //return response
    return res.status(201).json({
      success: true,
      data: newUser,
      message: "User is successfully registered.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    //fetch user details
    const { email, password } = req.body;

    //validate user details
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    //check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not registered with this email.",
      });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password. Try again.",
      });
    }

    //generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    //return response
    return res.status(200).json({
      success: true,
      data: user,
      message: `Welcome back ${user.name}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "User is successfully logged out.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
      message: "User profile fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    //fetch the email
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exists.",
      });
    }

    //generate otp - 6 digit code
    const otp = crypto.randomInt(100000, 999999).toString();

    //save the otp to the password model

    let password = await Password.findOne({ user: user._id });

    if (!password) {
      password = new Password({ user: user._id });
    }

    password.resetOTP = otp;

    password.resetOTPExpiry = Date.now() + 10 * 60 * 1000; //10 minutes

    await password.save();

    //send mail for reset password
    await transporter.sendMail({
      from: process.env.MAIL_HOST,
      to: email,
      subject: "Password Reset OTP",
      html: passwordResetEmailTemplate(user.name, email, otp),
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "Reset Password OTP is sent to your email.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    //fetch the details
    const { otp, email, newPassword } = req.body;

    //validate the details
    if (!otp || !email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    //check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const password = await Password.findOne({ user: user._id });

    //validate the otp
    if (!password.resetOTP || password.resetOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    //check otp expiry
    if (password.resetOTPExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }

    //check if the previous and new password are not same
    const isMatch = await bcrypt.compare(newPassword, user.password);

    if (isMatch) {
      return res.status(400).json({
        success: false,
        message: "The previous and new password should not be same",
      });
    }

    //update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    password.resetOTP = null;
    password.resetOTPExpiry = null;

    await user.save();

    await password.save();

    return res.status(200).json({
      success: true,
      message: "Password is changed successfully. Login to your account.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
