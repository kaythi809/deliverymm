// routes/riderRoutes.js
const express = require('express');
const router = express.Router();
const riderController = require('../controllers/riderController');
const { protect, restrictTo } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Only admin can access these routes
router.use(restrictTo('admin'));

// Rider routes
router.route('/riders')
    .get(riderController.getAllRiders)
    .post(riderController.createRider);

router.route('/riders/:id')
    .get(riderController.getRider)
    .patch(riderController.updateRider);

router.patch('/riders/:id/toggle-status', riderController.toggleRiderStatus);

module.exports = router;