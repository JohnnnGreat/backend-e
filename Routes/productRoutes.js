const express = require("express");
const {
    getProducts,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
    getProductByProductId, getProductByText
} = require("../Controllers/productControllers");
const {protect, admin} = require("../Middlewares/AuthenticationMiddlewares"); // Assume admin middleware is for admin-only routes
const multer = require("multer");

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});
// GET all products
router.get("/", getProducts);

// // GET single product by ID
router.get("/uploaded-by/:userId", protect, getProductsById);

// POST create a new product (Admin only)
router.post("/", protect, createProduct);

// PUT update product (Admin only)
// router.put("/:id", protect, admin, updateProduct);

// // DELETE a product (Admin only)
// router.delete("/:id", protect, admin, deleteProduct);

//Get Product By Id
router.get("/:productId", getProductByProductId);

router.post("/uploadImages", upload.array("images", 4), protect, uploadImages);
router.get('/getproductbytext/:text', getProductByText)

module.exports = router;
