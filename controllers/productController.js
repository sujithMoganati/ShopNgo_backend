const Product = require("../models/Product");
const { GROCERY_CATEGORIES } = require("../utils/constants");
const { uploadImage } = require("../utils/uploadImage");
const mongoose = require("mongoose");

// CREATE Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, weight } = req.body;
    let imageUrl = "";

    if (
      !name ||
      !price ||
      !category ||
      stock === undefined ||
      weight === undefined
    ) {
      return res.status(400).json({
        message: "Required fields: name, price, category, stock, weight",
      });
    }

    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    if (isNaN(stock) || stock < 0) {
      return res
        .status(400)
        .json({ message: "Stock must be a non-negative number" });
    }

    if (weight === "") {
      return res
        .status(400)
        .json({ message: "Weight must be a non-empty string" });
    }

    if (!GROCERY_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${GROCERY_CATEGORIES.join(
          ", "
        )}`,
      });
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "Product with this name already exists" });
    }

    if (req.file) {
      const localPath = req.file.path;
      imageUrl = await uploadImage(localPath);
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      weight,
      image: imageUrl,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.category && !GROCERY_CATEGORIES.includes(updates.category)) {
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${GROCERY_CATEGORIES.join(
          ", "
        )}`,
      });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    res.json(GROCERY_CATEGORIES);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
exports.getProductByName = async (req, res) => {
  try {
    // Extracting the product name from request parameters
    const { name } = req.params;

    // Find products that match the name using a regular expression
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });

    // If no products are found, return a 404 error
    if (products.length === 0)
      return res.status(404).json({ message: "Product not found" });

    // Return the matching products
    res.json(products);
  } catch (err) {
    // If there's an error, return a 500 error with the message
    res.status(500).json({ error: err.message });
  }
};
