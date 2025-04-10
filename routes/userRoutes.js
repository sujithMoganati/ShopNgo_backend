const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/userController");

// POST /api/users
router.post("/create-user", createUser);

// GET /api/users
router.get("/get-users", getUsers);

module.exports = router;
