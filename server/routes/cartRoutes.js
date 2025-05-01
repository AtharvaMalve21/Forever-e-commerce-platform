const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCartItems,
  viewCartItem,
  removeItemFromCart,
  removeCart,
} = require("../controllers/cartController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post("/:id/add", isAuthenticated, isAuthorized("User"), addToCart);

router.get("/", isAuthenticated, isAuthorized("User"), getCartItems);

router.get("/:id", isAuthenticated, isAuthorized("User"), viewCartItem);

router.delete(
  "/product/:id",
  isAuthenticated,
  isAuthorized("User"),
  removeItemFromCart
);

router.delete("/:id", isAuthenticated, isAuthorized("User"), removeCart);

module.exports = router;
