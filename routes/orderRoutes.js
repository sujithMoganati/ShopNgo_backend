const express = require("express");
const {
  createOrder,
  verifyRazorpayPayment,
  getAllOrdersByClerkId,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/create", createOrder);
router.post("/verify", verifyRazorpayPayment);
router.get("/user/:number", getAllOrdersByClerkId);

module.exports = router;
