const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");

//future scope - Integrate stripe payments

//only users can access this route
exports.createOrder = async (req, res) => {
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

    //fetch details
    const { name, email, phone, shippingAddress } = req.body;

    //validate details
    if (!name || !email || !phone || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    //find the cart
    const { id } = req.params;

    const cart = await Cart.findById(id);

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "No Items in cart!",
      });
    }

    //cart belongs to specific user
    if (cart.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized cart access.",
      });
    }

    const totalPrice = cart.products.reduce((acc, item) => acc + item.price, 0);

    //create order
    const order = await Order.create({
      name,
      email,
      phone,
      shippingAddress,
      cart: cart._id,
      totalPrice: totalPrice,
      user: userId,
    });

    //return res
    return res.status(201).json({
      success: true,
      data: order,
      message: "Order placed successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//particular user can see his/her orders
exports.getAllOrders = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User found.",
      });
    }

    const orders = await Order.find({
      user: userId,
    })
      .populate("cart")
      .populate("user");

    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//particular user can see his/her single order
exports.viewOrder = async (req, res) => {
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
    const order = await Order.findOne({
      _id: id,
      user: userId,
    });

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//change status - only admins can access this route
exports.updateStatus = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found",
      });
    }

    //find the order
    const { id } = req.params;

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please fill the required details.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "No Order found.",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//this route is for admins- can see all the orders
exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({});

    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//particular user can cancel his/her orders
exports.cancelOrder = async (req, res) => {
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

    const order = await Order.findOneAndDelete({
      _id: id,
      user: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
