const jwt = require("jsonwebtoken");
const User = require("../Models/User"); // Assuming you have a User model

const protect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode the token to get the user ID
      const decoded = jwt.verify(token, "hjwhefy892hjojkjlqw");

      // Fetch the user from the database and attach it to the request
      req.userDetails = { user: decoded?.userId, role: decoded?.role };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
