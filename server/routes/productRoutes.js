const express = require("express");
const router = express.Router();
const { upload } = require("../utils/fileUploader");

const {
  addProduct,
  getAllProducts,
  filterProductsByCategory,
  filterProductsBySubCategory,
  filterProductsByCategoryAndSubCategory,
  viewProduct,
  deleteProduct,
} = require("../controllers/productController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

//only admins can access this route
router.post(
  "/add",
  upload.array("photos", 100),
  isAuthenticated,
  isAuthorized("Admin"),
  addProduct
);

router.get("/", getAllProducts);

router.get("/filter/category", filterProductsByCategory);

router.get("/filter/subCategory", filterProductsBySubCategory);

router.get("/filter", filterProductsByCategoryAndSubCategory);

router.get("/:id", viewProduct);

router.delete("/:id", isAuthenticated, isAuthorized("Admin"), deleteProduct);

module.exports = router;
