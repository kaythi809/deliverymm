// trust-delivery-backend/controllers/onlineShopController.js
const { OnlineShops } = require('../models');  // Changed to plural and using models index

exports.getAllShops = async (req, res) => {
  try {
    const shops = await OnlineShops.findAll();  // Changed to plural
    res.json({
      status: 'success',
      data: shops
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createShop = async (req, res) => {
  try {
    const shop = await OnlineShops.create(req.body);  // Changed to plural
    res.status(201).json({
      status: 'success',
      data: shop
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const shop = await OnlineShops.findByPk(req.params.id);  // Changed to plural
    if (!shop) {
      return res.status(404).json({
        status: 'error',
        message: 'Online shop not found'
      });
    }
    res.json({
      status: 'success',
      data: shop
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const shop = await OnlineShops.findByPk(req.params.id);  // Changed to plural
    if (!shop) {
      return res.status(404).json({
        status: 'error',
        message: 'Online shop not found'
      });
    }
    await shop.update(req.body);
    res.json({
      status: 'success',
      data: shop
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};