const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// CRUD Routes
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/categories", productController.getAllCategories);
router.get("/:id", productController.getProductById); // ✅ NEW
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
