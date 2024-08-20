// routes/userRoutes.js

const express = require("express");
const {
  login,
  signup,
  uploadImage,
  getUserProfile,
  updateProfile
} = require("../Controllers/userController");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../Middlewares/AuthenticationMiddlewares");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/getuser/:id", protect, getUserProfile);
router.post("/auth/login", login);

router.post("/auth/register", signup);
router.post("/uploads/uploadImage", upload.single("image"), uploadImage);
router.put("/updateprofile/:id", protect, updateProfile);

module.exports = router;
