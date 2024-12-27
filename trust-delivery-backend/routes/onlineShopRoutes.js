// trust-delivery-backend/routes/onlineShopRoutes.js
const express = require('express');
const router = express.Router();
const onlineShopController = require('../controllers/onlineShopController');
const { protect, restrictTo } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/online-shops')
  .get(onlineShopController.getAllShops)
  .post(restrictTo('admin'), onlineShopController.createShop);

router.route('/online-shops/:id')
  .get(onlineShopController.getShopById)
  .patch(restrictTo('admin'), onlineShopController.updateShop);

module.exports = router;