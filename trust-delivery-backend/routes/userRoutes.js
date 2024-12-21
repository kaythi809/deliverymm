// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');
const User = require('../models/User'); // Add this import

// Auth routes (public)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes - require authentication
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);

// Admin only routes
router.use(restrictTo('admin'));

// Get all users and create new user
router.route('/users')
    .get(userController.getAllUsers)
    .post(userController.addUser);

// Individual user operations
router.route('/users/:id')
    .get(userController.getUser)
    .patch(userController.updateUser) // Move this to userController
    .delete(userController.deleteUser); // Move this to userController

// Toggle user status
router.patch('/users/:id/toggle-status', userController.toggleUserStatus);

module.exports = router;