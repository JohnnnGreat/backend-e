// index.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv").config();

const app = express();

// Import routes
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const Product = require("./Models/Product");
const orderRoutes = require("./Routes/orderRoutes");
// const reviewRoutes = require("./Routes/reviewRoutes");
const cartRoutes = require("./Routes/cartRoutes");

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Frontend URL
    methods: ["GET", "POST", "DELETE", "PUT"]
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/reviews", reviewRoutes);
app.use("/api/carts", cartRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the E-Commerce API");
});

// Start server
const PORT = process.env.PORT || 5000;
const DATABASE = process.env.MONGO_DATABASE_URL;
app.listen(PORT, () => {
  // Database connection
  mongoose
    .connect(DATABASE ? DATABASE : "/")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));
  console.log(`Server is running on port ${PORT}`);
});
