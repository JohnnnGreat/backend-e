const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const sdk = require("node-appwrite");

// Constants
const JWT_SECRET = "hjwhefy892hjojkjlqw"; // Replace with an environment variable in production

// Appwrite setup
const client = new sdk.Client();

console.log(process.env.APPWRITE_ENDPOINT);
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_PROJECT_KEY);
const storage = new sdk.Storage(client);

// Signup controller
exports.signup = async (req, res) => {
  const { name, email, password, role, address } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      address
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, JWT_SECRET, {
      expiresIn: "1h"
    });
    res.status(201).json({ message: "User created successfully", user: savedUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "700h"
    });

    res.json({ message: "Login successful", token, user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  const file = req.file;
  const { userId } = req.body;
  const fileId = `image_${Date.now()}`;
  try {
    // Upload Image to Appwrite
    await storage.createFile(
      "66baff6f00172bec04e1",
      fileId,
      sdk.InputFile.fromPath(file?.path, file.originalname)
    );

    // Get Image Url
    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/66baff6f00172bec04e1/files/${fileId}/view?project=66bafea2003629c14ad9&mode=admin`;

    await User.findByIdAndUpdate(userId, { profileImage: fileUrl });
    const newUserInfo = await User.findById(userId);

    res.status(202).json({ message: "Image Updated Successfully", user: newUserInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user information from the database by userId
    const user = await User.findById(id).select("-password"); // Exclude password from the result

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, street, city, country } = req.body;

  try {
    // Find the user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
        address: {
          street: street,
          city: city,
          country: country
        }
      },
      { new: true, runValidators: true }
    );

    // If the user doesn't exist
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
   
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
 
    res.status(500).json({ message: error.message });
  }
};
