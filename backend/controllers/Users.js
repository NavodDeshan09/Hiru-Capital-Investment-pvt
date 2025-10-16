const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users'); // Path to the Users model

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, nic, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !nic || !role) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if the user already exists by email
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new Users({
      username,
      email,
      password: hashedPassword, // Save the hashed password
      nic,
      role,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', user: savedUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required!' });
    }

    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Compare password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (optional, for admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required!' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required!' });
    }

    const { username, email, nic, role } = req.body;

    // Validate required fields
    if (!username || !email || !nic || !role) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Find and update the user
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { username, email, nic, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required!' });
    }

    // Find and delete the user
    const deletedUser = await Users.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required!' });
    }

    // Find the user by ID and select only specific fields
    const user = await Users.findById(userId).select('username email role');
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
};
