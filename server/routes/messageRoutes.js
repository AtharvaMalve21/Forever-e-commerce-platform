const express = require("express");
const router = express.Router();

const {
  addMessage,
  getAllMessages,
} = require("../controllers/messageController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post("/add", addMessage);

//only admin can access this route
router.get("/", isAuthenticated, isAuthorized("Admin"), getAllMessages);

module.exports = router;
