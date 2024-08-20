const Cart = require("../Models/Cart");
const Product = require("../Models/Product");

// Get cart by user ID
exports.getCart = async (req, res) => {
  console.log(req.userDetails);
  try {
    const cart = await Cart.findOne({ user: req.userDetails.user }).populate("items.product");
    console.log(cart);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found", cart: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add Product To Cart
// @route   POST /api/carts/add
// @access  Private/Admin
exports.addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.userDetails.user });

    // Check if the cart exists
    if (!cart) {
      cart = new Cart({ user: req.userDetails.user, items: [] });
    }

    // Check if product already exists in cart
    const productExists = cart.items.find((item) => item.product.toString() === productId);

    if (productExists) {
      productExists.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
  
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.userDetails.user }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product._id.toString() !== productId);

    cart.updatedAt = Date.now();

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userDetails.user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
