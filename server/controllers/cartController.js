const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

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

    //find the product
    const { id: productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No Product found.",
      });
    }

    const { quantity, size } = req.body;

    if (!quantity || !size) {
      return res.status(400).json({
        success: false,
        message: "Quantity or size of the product is required.",
      });
    }

    let totalPrice = product.price * quantity;

    let existingCart = await Cart.findOne({ user: userId });

    //check if the product exists in cart
    if (existingCart) {
      const cartItem = existingCart.products.find(
        (p) => p.productId.toString() === productId
      );

      if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.price += totalPrice;
      } else {
        existingCart.products.push({
          productId: productId,
          quantity: quantity,
          size: size,
          price: totalPrice,
        });
      }

      await existingCart.save();

      if (!user.cartItems.includes(existingCart._id)) {
        user.cartItems.push(existingCart._id);
        await user.save();
      }
    } else {
      //create new cart
      existingCart = await Cart.create({
        products: [
          {
            productId: productId,
            quantity: quantity,
            size: size,
            price: totalPrice,
          },
        ],
        user: userId,
      });

      user.cartItems.push(existingCart._id);
      await user.save();
    }

    // Refetch updated cart with product details
    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "products.productId"
    );

    //return response
    return res.status(201).json({
      success: true,
      data: populatedCart,
      message: "Item added to cart",
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
        message: "No User found. Login Again.",
      });
    }

    const cartItems = await Cart.find({ user: userId })
      .populate("products.productId")
      .populate("user");

    return res.status(200).json({
      success: true,
      data: cartItems,
      message: "Cart Items data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.viewCartItem = async (req, res) => {
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

    const { id } = req.params;

    const cartItem = await Cart.findOne({
      _id: id,
      user: userId,
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
exports.removeItemFromCart = async (req, res) => {
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

    //find the product
    const { id: productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No Product found.",
      });
    }

    //find the cart
    const cart = await Cart.findOne({ user: userId });

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await cart.save();

    // Optionally update user.cartItems only if cart becomes empty
    if (cart.products.length === 0) {
      user.cartItems = user.cartItems.filter(
        (cartItemId) => cartItemId.toString() !== cart._id.toString()
      );
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.removeCart = async (req, res) => {
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

    const { id: cartId } = req.params;

    const cart = await Cart.findOne({
      user: userId,
      _id: cartId,
    });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Item not found in the cart.",
      });
    }

    if (cart.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized.",
      });
    }

    await cart.deleteOne({ _id: cartId });

    user.cartItems = user.cartItems.filter(
      (cartItemId) => cartItemId.toString() !== cartId
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
