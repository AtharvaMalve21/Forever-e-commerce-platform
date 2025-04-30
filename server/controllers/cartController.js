const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

//only users can access this route
exports.addToCart = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    //find product
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No Product found.",
      });
    }

    const { quantity, size } = req.body;
    if (!quantity || !size) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    //check if already cart exists for a given user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        products: [
          {
            productId: product._id,
            quantity,
            size,
            price: product.price * quantity,
          },
        ],
        user: userId,
      });
    } else {
      cart.products.push({
        productId: product._id,
        quantity,
        size,
        price: product.price * quantity,
      });
      cart.user = userId;
      await cart.save();
    }

    user.cartItems.push(product._id);
    await user.save();

    return res.status(201).json({
      success: true,
      data: cart,
      message: "Item added to cart!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.getCartItems = async (req, res) => {
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

    const cartItems = await Cart.find({ user: userId })
      .populate("products.productId")
      .populate("user");

    return res.status(200).json({
      success: true,
      data: cartItems,
      message: "Cart Item data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.viewCart = async (req, res) => {
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

    const { id } = req.params;

    const cartItem = await Cart.findOne({
      user: userId,
      _id: id,
    })
      .populate("products.productId")
      .populate("user");

    return res.status(200).json({
      success: true,
      data: cartItem,
      message: "Cart Item data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.removeCartItem = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. ",
      });
    }

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No Product found.",
      });
    }

    const cart = await Cart.findOneAndDelete({
      products: [
        {
          productId: product._id,
        },
      ],
      user: userId,
    });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "No Product found in cart.",
      });
    }

    await user.deleteOne({
      cartItems: [
        {
          _id: product._id,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: "Item removed from cart.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
