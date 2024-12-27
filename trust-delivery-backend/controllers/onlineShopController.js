// trust-delivery-backend/controllers/onlineShopController.js
const OnlineShop = require('../models/OnlineShop');

exports.getAllShops = async (req, res) => {
  try {
    const shops = await OnlineShop.findAll();
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
    const shop = await OnlineShop.create(req.body);
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
    const shop = await OnlineShop.findByPk(req.params.id);
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
    const shop = await OnlineShop.findByPk(req.params.id);
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