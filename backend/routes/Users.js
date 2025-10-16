const express = require('express');
const router = express.Router();
const { adminAuth, userAuth } = require('../middleware/auth'); // Import authentication middleware
const UserController = require('../controllers/Users'); // Path to the User controller

// Route to register a new user
router.post('/register', UserController.registerUser);

// Route to login a user
router.post('/login', UserController.loginUser);

// Route to get all users (optional, for admin)
router.get('/users', adminAuth, UserController.getAllUsers); // Protect this route with adminAuth middleware

// Route to get a single user by ID
router.get('/user/:id', userAuth, UserController.getUserById); // Protect this route with userAuth middleware

// Route to update a user's information
router.put('/user/:id', userAuth, UserController.updateUser); // Protect this route with userAuth middleware

// Route to delete a user
router.delete('/user/:id', adminAuth, UserController.deleteUser); // Protect this route with adminAuth middleware

router.get('/user/profile/:id', userAuth, UserController.getUserProfile); // Protect this route with userAuth middleware

module.exports = router;
