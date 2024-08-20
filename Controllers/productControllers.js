const sdk = require('node-appwrite');
const Product = require('../Models/Product');

const client = new sdk.Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_PROJECT_KEY);
const storage = new sdk.Storage(client);

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, brand, category, countInStock, images } = req.body;

    const product = new Product({ ...req.body, uploadedBy: req.userDetails.user });

    const createdProduct = await product.save();
    console.log(createdProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// @desc    Upload Images to Appwrite
// @route   /api/products/uploadImages
//@access   Private/Admin

const uploadImages = async (req, res) => {
  const filesLink = [];
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  try {
    const uploadPromises = req.files.map(async file => {
      const fileId = `image_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const response = await storage.createFile(
        '66baff6f00172bec04e1',
        fileId,
        sdk.InputFile.fromPath(file?.path, file.originalname)
      );
      const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/66baff6f00172bec04e1/files/${fileId}/view?project=66bafea2003629c14ad9&mode=admin`;
      return filesLink.push(fileUrl);
    });
    const fileUrls = await Promise.all(uploadPromises);

    res.json({
      message: 'Files uploaded successfully',
      fileUrls: filesLink
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const fileUrls = [];
  try {
    const { name, description, price, imageUrl, brand, category, countInStock, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.imageUrl = imageUrl || product.imageUrl;
      product.images = images || product.images;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// @desc    Get Product By Id
// @route   GET /products/uploaded-by/:userId
// @access  Private/Admin
const getProductsById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const products = await Product.find({ uploadedBy: userId }).populate(
      'uploadedBy',
      'name email'
    );

    res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
};

const getProductByProductId = async (req, res) => {
  const productId = req.params.productId;
  console.log(productId);
  try {
    const product = await Product.findById(productId).populate('uploadedBy', 'email name');

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getProductByProductId
};
