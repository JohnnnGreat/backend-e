const express = require("express");
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} = require("../Controllers/cartControllers");

const { protect } = require("../Middlewares/AuthenticationMiddlewares");

const router = express.Router();

// Get user's cart
router.get("/", protect, getCart);

// Add item to cart
router.post("/add", protect, addItemToCart);

// Remove item from cart
router.delete("/remove/:productId", protect, removeItemFromCart);

// Clear cart
router.delete("/clear", protect, clearCart);

module.exports = router;
