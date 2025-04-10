const User = require("../models/User");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, number } = req.body;

    const user = new User({ name, number });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err.message);
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
