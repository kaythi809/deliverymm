const { Delivery, User, Rider } = require('../models');
const { Op } = require('sequelize');

const deliveryController = {
  // Create a new delivery
  async createDelivery(req, res) {
    try {
      const delivery = await Delivery.create({
        userId: req.user.id,
        pickupAddress: req.body.pickupAddress,
        deliveryAddress: req.body.deliveryAddress,
        price: req.body.price,
        notes: req.body.notes,
        scheduledTime: req.body.scheduledTime
      });

      return res.status(201).json({
        success: true,
        data: delivery
      });
    } catch (error) {
      console.error('Create delivery error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create delivery',
        error: error.message
      });
    }
  },

  // Get all deliveries with filtering
  async getDeliveries(req, res) {
    try {
      const {
        status,
        paymentStatus,
        startDate,
        endDate,
        page = 1,
        limit = 10
      } = req.query;

      const where = {};
      
      // Apply filters
      if (status) where.status = status;
      if (paymentStatus) where.paymentStatus = paymentStatus;
      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      // Role-based filtering
      if (req.user.role === 'user') {
        where.userId = req.user.id;
      } else if (req.user.role === 'rider') {
        where.riderId = req.user.id;
      }

      const deliveries = await Delivery.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          },
          {
            model: Rider,
            as: 'rider',
            attributes: ['id', 'name', 'phoneNumber']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (page - 1) * limit
      });

      return res.json({
        success: true,
        data: deliveries.rows,
        pagination: {
          total: deliveries.count,
          page: parseInt(page),
          totalPages: Math.ceil(deliveries.count / limit)
        }
      });
    } catch (error) {
      console.error('Get deliveries error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch deliveries',
        error: error.message
      });
    }
  },

  // Get delivery by ID
  async getDeliveryById(req, res) {
    try {
      const delivery = await Delivery.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          },
          {
            model: Rider,
            as: 'rider',
            attributes: ['id', 'name', 'phoneNumber']
          }
        ]
      });

      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }

      // Check permission
      if (req.user.role === 'user' && delivery.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      return res.json({
        success: true,
        data: delivery
      });
    } catch (error) {
      console.error('Get delivery by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch delivery',
        error: error.message
      });
    }
  },

  // Update delivery status
  async updateDeliveryStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const delivery = await Delivery.findByPk(id);

      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }

      // Define valid status transitions
      const validTransitions = {
        pending: ['assigned', 'cancelled'],
        assigned: ['picked_up', 'cancelled'],
        picked_up: ['delivered', 'cancelled'],
        delivered: [],
        cancelled: []
      };

      if (!validTransitions[delivery.status].includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${delivery.status} to ${status}`
        });
      }

      await delivery.update({
        status,
        completedTime: status === 'delivered' ? new Date() : delivery.completedTime
      });

      return res.json({
        success: true,
        data: delivery
      });
    } catch (error) {
      console.error('Update delivery status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update delivery status',
        error: error.message
      });
    }
  },

  // Update payment status
  async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { paymentStatus, paymentMethod } = req.body;

      const delivery = await Delivery.findByPk(id);

      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }

      await delivery.update({
        paymentStatus,
        paymentMethod
      });

      return res.json({
        success: true,
        data: delivery
      });
    } catch (error) {
      console.error('Update payment status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update payment status',
        error: error.message
      });
    }
  }
};

module.exports = deliveryController;