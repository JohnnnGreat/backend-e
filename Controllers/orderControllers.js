const Order = require("../Models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;
  console.log(req.body);
  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  } else {
    const order = new Order({
      user: req.userDetails.user,
      ...req.body
    });

    console.log(order);

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  console.log(req.userDetails.user);
  const orders = await Order.find({ user: req.userDetails.user }).populate("orderItems.product");
  console.log(orders);
  res.json(orders);
};

const getOrderBySearch = async (req, res) => {
  const { orderId } = req.params;
  console.log(req.userDetails.user);
  try {
    // Get All Orders
    const orders = await Order.findById(orderId);
    if (!orders) {
      const orders = await Order.find({ user: req.userDetails.user }).populate(
        "orderItems.product"
      );
      return res
        .status(200)
        .json({ orders, message: "No order with this ID was found", idFound: false });
    }

    return res.status(200).json({ orders, idFound: true, message: "Order found" });
  } catch (error) {
    res.status(500).json({ message: "Oops!!, It seems this ID is invalid" });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrderBySearch
};
