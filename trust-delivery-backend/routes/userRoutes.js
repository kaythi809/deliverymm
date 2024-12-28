// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Updated path to match your file structure

// Public routes (if any)

// Protected routes (require authentication)
router.use(auth.protect); // Apply authentication middleware to all routes below

// User routes (for all authenticated users)
router.get('/profile', userController.getProfile);
router.patch('/update-profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);

// Admin only routes
router.use(auth.restrictTo('admin', 'Administrator')); // Restrict routes to admin users

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Additional admin routes
router.patch('/:id/toggle-lock', userController.toggleUserLock);

module.exports = router;