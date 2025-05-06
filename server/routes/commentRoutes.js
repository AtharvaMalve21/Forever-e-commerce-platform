const express = require("express");
const router = express.Router();

const {
  addComment,
  getAllComments,
  deleteComments,
} = require("../controllers/commentController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post("/:id", isAuthenticated, isAuthorized("User"), addComment);
router.get("/", getAllComments);
router.delete("/:id", isAuthenticated, isAuthorized("User"), deleteComments);

module.exports = router;
