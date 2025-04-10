const mongoose = require("mongoose");
const { GROCERY_CATEGORIES } = require("../utils/constants");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      enum: GROCERY_CATEGORIES,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: String,
      required: true,
      min: 0,
    },
    image: {
      type: String, // URL or path
      default: "",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
