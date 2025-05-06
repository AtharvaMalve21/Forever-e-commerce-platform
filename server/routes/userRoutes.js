const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getUserProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const { isAuthenticated } = require("../middleware/auth");

//Register User
router.post("/register", register);

//Login User
router.post("/login", login);

//Logout User
router.get("/logout", isAuthenticated, logout);

//GET- User Profile
router.get("/profile", isAuthenticated, getUserProfile);

//POST - Forgot Password
router.post("/forgot-password", forgotPassword);

//POST - Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
