const User = require("../models/User");
const { uploadImage } = require("../utils/uploadImage");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, number, clerkId, addresses } = req.body;

    const userExists = await User.findOne({ clerkId });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let imageUrl = "";

    // Image upload logic (supports both base64 & multer file)
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
    } else if (req.body.image?.startsWith("data:image")) {
      imageUrl = await uploadImage(req.body.image);
    }

    const user = new User({
      name,
      number,
      clerkId,
      addresses,
      image: imageUrl,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update user details
exports.updateUserDetails = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { name, number, addresses } = req.body;

    let updateData = { name, number, addresses };

    if (req.file) {
      const imageUrl = await uploadImage(req.file.path);
      updateData.image = imageUrl;
    } else if (req.body.image?.startsWith("data:image")) {
      const imageUrl = await uploadImage(req.body.image);
      updateData.image = imageUrl;
    }

    const user = await User.findByIdAndUpdate(clerkId, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single user by Clerk ID
exports.getUserbyClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findById(clerkId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
