const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCartItems,
  viewCart,
  removeCartItem,
} = require("../controllers/cartController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post("/:id/add", isAuthenticated, isAuthorized("User"), addToCart);
router.get("/", isAuthenticated, isAuthorized("User"), getCartItems);
router.get("/:id", isAuthenticated, isAuthorized("User"), viewCart);
router.delete("/:id", isAuthenticated, isAuthorized("User"), removeCartItem);

module.exports = router;
