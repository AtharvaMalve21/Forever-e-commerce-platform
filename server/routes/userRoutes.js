const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getUserProfile,
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

module.exports = router;
