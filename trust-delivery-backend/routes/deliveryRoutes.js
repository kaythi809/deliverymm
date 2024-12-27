const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Create delivery
router.post('/', 
  auth, 
  checkRole(['user', 'admin']), 
  deliveryController.createDelivery
);

// Get all deliveries
router.get('/', 
  auth, 
  deliveryController.getDeliveries
);

// Get delivery by ID
router.get('/:id', 
  auth, 
  deliveryController.getDeliveryById
);

// Update delivery status
router.patch('/:id/status', 
  auth, 
  checkRole(['admin', 'rider']), 
  deliveryController.updateDeliveryStatus
);

// Update payment status
router.patch('/:id/payment', 
  auth, 
  checkRole(['admin']), 
  deliveryController.updatePaymentStatus
);

module.exports = router;