// routes/riderRoutes.js
const express = require('express');
const router = express.Router();
const riderController = require('../controllers/riderController');
const { protect, restrictTo } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes accessible by admin only
router.use(restrictTo('Administrator', 'admin'));

// List route should come before :id routes
router.get('/list', riderController.getAllRiders);

// Routes with ID parameter
router.route('/:id')
  .get(riderController.getRider)
  .patch(riderController.updateRider);

router.post('/', riderController.createRider);
router.patch('/:id/toggle-status', riderController.toggleRiderStatus);
router.get('/:id/deliveries', riderController.getRiderDeliveries);

module.exports = router;