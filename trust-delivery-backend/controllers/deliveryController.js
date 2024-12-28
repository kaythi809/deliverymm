// controllers/deliveryController.js
const { Deliveries, Users, Riders, OnlineShops } = require('../models');

// Create delivery
exports.createDelivery = async (req, res) => {
  try {
    const {
      pickupAddress,
      deliveryAddress,
      scheduledTime,
      notes,
      price,
      paymentMethod,
      riderId,
      onlineShopId
    } = req.body;

    const delivery = await Deliveries.create({
      userId: req.user.id,
      riderId,
      onlineShopId,
      pickupAddress,
      deliveryAddress,
      scheduledTime,
      notes,
      price,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      status: 'success',
      data: delivery
    });
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create delivery',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'rider') {
      query.riderId = req.user.id;
    } else if (req.user.role === 'customer') {
      query.userId = req.user.id;
    } else if (req.user.role === 'shop_owner') {
      query.onlineShopId = req.user.shopId; // Assuming shop owners have shopId in their user object
    }

    const deliveries = await Deliveries.findAll({
      where: query,
      include: [
        {
          model: Users,
          as: 'deliveryUser',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Riders,
          as: 'deliveryRider',
          attributes: ['id', 'name', 'phoneNumber']
        },
        {
          model: OnlineShops,
          as: 'deliveryShop',
          attributes: ['id', 'osName', 'phoneNumber']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      data: deliveries
    });
  } catch (error) {
    console.error('Get all deliveries error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch deliveries',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Deliveries.findByPk(req.params.id, {
      include: [
        {
          model: Users,
          as: 'deliveryUser',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Riders,
          as: 'deliveryRider',
          attributes: ['id', 'name', 'phoneNumber']
        },
        {
          model: OnlineShops,
          as: 'deliveryShop',
          attributes: ['id', 'osName', 'phoneNumber']
        }
      ]
    });

    if (!delivery) {
      return res.status(404).json({
        status: 'error',
        message: 'Delivery not found'
      });
    }

    // Check if user has permission to view this delivery
    if (!['Administrator', 'admin'].includes(req.user.role)) {
      if (
        delivery.userId !== req.user.id && 
        delivery.riderId !== req.user.id &&
        delivery.onlineShopId !== req.user.shopId
      ) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to view this delivery'
        });
      }
    }

    res.json({
      status: 'success',
      data: delivery
    });
  } catch (error) {
    console.error('Get delivery by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch delivery',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update delivery
exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Deliveries.findByPk(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        status: 'error',
        message: 'Delivery not found'
      });
    }

    const {
      status,
      riderId,
      completedTime,
      notes,
      paymentStatus
    } = req.body;

    const updatedDelivery = await delivery.update({
      status,
      riderId,
      completedTime,
      notes,
      paymentStatus
    });

    res.json({
      status: 'success',
      data: updatedDelivery
    });
  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update delivery',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete delivery
exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Deliveries.findByPk(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        status: 'error',
        message: 'Delivery not found'
      });
    }

    await delivery.destroy();

    res.json({
      status: 'success',
      message: 'Delivery deleted successfully'
    });
  } catch (error) {
    console.error('Delete delivery error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete delivery',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};