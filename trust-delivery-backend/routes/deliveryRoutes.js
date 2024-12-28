// routes/deliveryroutes.js
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { ROLES } = roleCheck;

// Create delivery
router.post('/', 
  protect,
  roleCheck(ROLES.ADMIN, ROLES.SHOP_OWNER, ROLES.CUSTOMER),
  deliveryController.createDelivery
);

// Get all deliveries
router.get('/',
  protect,
  roleCheck(ROLES.ADMINISTRATOR, ROLES.ADMIN, ROLES.SHOP_OWNER, ROLES.RIDER, ROLES.CUSTOMER),
  deliveryController.getAllDeliveries
);

// Get delivery by ID
router.get('/:id',
  protect,
  roleCheck(ROLES.ADMINISTRATOR, ROLES.ADMIN, ROLES.SHOP_OWNER, ROLES.RIDER, ROLES.CUSTOMER),
  deliveryController.getDeliveryById
);

// Update delivery
router.put('/:id',
  protect,
  roleCheck(ROLES.ADMINISTRATOR, ROLES.ADMIN, ROLES.RIDER),
  deliveryController.updateDelivery
);

// Delete delivery
router.delete('/:id',
  protect,
  roleCheck(ROLES.ADMINISTRATOR, ROLES.ADMIN),
  deliveryController.deleteDelivery
);

module.exports = router;