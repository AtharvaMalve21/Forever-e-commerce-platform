const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

//only users can access this route
exports.addComment = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    //check role - optional
    if (user.role === "Admin") {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to add a comment.",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User found.",
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

    const { comment, rating } = req.body;

    if (!comment || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    //create comment
    const newComment = await Comment.create({
      user: userId,
      product: productId,
      comment: comment,
      rating: rating,
    });

    return res.status(201).json({
      success: true,
      data: newComment,
      message: "Comment added.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.getAllComments = async (req, res) => {
  try {
    //anyone can see the comments

    const comments = await Comment.find({}).populate("product user");

    return res.status(200).json({
      success: true,
      data: comments,
      message: "Comment data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.deleteComments = async (req, res) => {
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

    //find the comment
    const { id: commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "No Comment found.",
      });
    }

    //check if only user who created comment can delete it

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    await comment.deleteOne({ _id: commentId });

    //return response

    return res.status(200).json({
      success: true,
      message: "Comment deleted.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
