// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();

// Define your review routes here
router.get("/", (req, res) => {
  res.send("Get all reviews");
});

router.post("/", (req, res) => {
  res.send("Create a new review");
});

// Add other review routes (e.g., GET by ID, PUT, DELETE) here

module.exports = router;
