const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
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
