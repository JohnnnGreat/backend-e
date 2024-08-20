const express = require("express");

const { addOrderItems, getOrderById, getMyOrders } = require("../Controllers/orderControllers");
const { protect } = require("../Middlewares/AuthenticationMiddlewares");

const router = express.Router();

// Route to create a new order
router.post("/", protect, addOrderItems);

// Route to get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

// Route to get an order by ID
router.get("/:id", protect, getOrderById);

module.exports = router;
