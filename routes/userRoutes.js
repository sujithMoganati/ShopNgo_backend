const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/userController");

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// CRUD Routes
router.post("/create", upload.single("image"), userController.createUser);
router.get("/", userController.getUsers);
router.get("/:clerkId", userController.getUserbyClerkId);
router.put(
  "/:clerkId",
  upload.single("image"),
  userController.updateUserDetails
);

module.exports = router;
