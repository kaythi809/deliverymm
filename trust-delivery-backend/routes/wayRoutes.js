// routes/wayRoutes.js
const express = require('express');
const router = express.Router();
const wayController = require('../controllers/wayController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Create new way/parcel
router.post('/', 
  auth,
  checkRole(['admin']),
  wayController.createWay
);

// Get all ways with filtering
router.get('/',
  auth,
  wayController.getWays
);

// Get way by ID or tracking number
router.get('/:identifier',
  auth,
  wayController.getWayById
);

// Update way status
router.patch('/:id/status',
  auth,
  checkRole(['admin', 'rider']),
  wayController.updateWayStatus
);

// Update parcel details
router.patch('/:id/parcel',
  auth,
  checkRole(['admin']),
  wayController.updateParcelDetails
);

// Update customer information
router.patch('/:id/customer',
  auth,
  checkRole(['admin']),
  wayController.updateCustomerInfo
);

// Process COD payment
router.patch('/:id/cod',
  auth,
  checkRole(['admin', 'rider']),
  wayController.processCODPayment
);

// Return parcel to shop
router.post('/:id/return',
  auth,
  checkRole(['admin', 'rider']),
  wayController.returnParcelToShop
);

// Get way statement
router.get('/:id/statement',
  auth,
  checkRole(['admin']),
  wayController.getWayStatement
);

module.exports = router;