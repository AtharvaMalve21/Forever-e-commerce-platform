const User = require("../models/userModel");
const Product = require("../models/productModel");

//only admins can access this route
exports.addProduct = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }

    //optional check
    if (user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this route.",
      });
    }

    //fetch product details
    const {
      product_name,
      product_description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const photos = req.files.map((file) => file.path);

    //validate product details
    if (
      !product_name ||
      !product_description ||
      !price ||
      !photos ||
      !category ||
      !subCategory ||
      !sizes
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    //create new product

    const newProduct = await Product.create({
      product_name,
      product_description,
      price,
      category,
      subCategory,
      sizes,
      photos,
      bestSeller: bestSeller === "true",
    });

    //return res

    return res.status(201).json({
      success: true,
      data: newProduct,
      message: "New Product added.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Product found. ",
      });
    }
    return res.status(200).json({
      success: true,
      data: products,
      message: "Product data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.filterProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    const products = await Product.find({
      category: category,
    });

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Product found",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
      message: "Products data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.filterProductsBySubCategory = async (req, res) => {
  try {
    const { subCategory } = req.query;

    const products = await Product.find({
      subCategory: subCategory,
    });

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Product found",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
      message: "Product data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.filterProductsByCategoryAndSubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    const products = await Product.find({
      category: category,
      subCategory: subCategory,
    });

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Product found",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
      message: "Products data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.filterByPrice = async (req, res) => {
  try {
    const { price } = req.query;
    const products = await Product.find({
      price: price,
    });
    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Product found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: products,
      message: "Products data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.viewProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No Product found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
      message: "Product data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only admins can access this route
exports.deleteProduct = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again",
      });
    }

    //optional check

    if (user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this route.",
      });
    }

    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
