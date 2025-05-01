const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateStatus,
  viewOrder,
  getAllOrdersForAdmin,
  cancelOrder,
} = require("../controllers/orderController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post("/:id/add", isAuthenticated, isAuthorized("User"), createOrder);

router.get("/", isAuthenticated, isAuthorized("User"), getAllOrders);

router.put("/status/:id", isAuthenticated, isAuthorized("Admin"), updateStatus);

router.get(
  "/admin",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllOrdersForAdmin
);

router.get("/:id", isAuthenticated, isAuthorized("User"), viewOrder);

router.delete("/:id", isAuthenticated, isAuthorized("User"), cancelOrder);

module.exports = router;
