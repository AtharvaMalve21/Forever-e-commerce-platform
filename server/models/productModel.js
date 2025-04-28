const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },

    product_description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    photos: [
      {
        type: String,
        required: true,
      },
    ],

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    sizes: [
      {
        type: String,
        required: true,
      },
    ],

    bestSeller: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
