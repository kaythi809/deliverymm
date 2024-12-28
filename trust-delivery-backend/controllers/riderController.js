// controllers/riderController.js
const { Riders, Users, Deliveries } = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all riders
exports.getAllRiders = catchAsync(async (req, res) => {
  const riders = await Riders.findAll({
    include: [{
      model: Users,
      as: 'userData',
      attributes: ['username', 'email', 'role', 'status']
    }],
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: riders.length,
    data: {
      riders
    }
  });
});

// Get single rider
exports.getRider = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid rider ID'
    });
  }

  const rider = await Riders.findByPk(id, {
    include: [{
      model: Users,
      as: 'userData',
      attributes: ['username', 'email', 'role', 'status']
    }]
  });

  if (!rider) {
    return res.status(404).json({
      status: 'fail',
      message: 'Rider not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      rider
    }
  });
});

// Create rider
exports.createRider = catchAsync(async (req, res) => {
  const {
    userId,
    name,
    phoneNumber,
    township,
    fullAddress,
    nrc,
    joinedDate,
    emergencyContact,
    vehicleType,
    photo
  } = req.body;

  // Check if user exists
  const user = await Users.findByPk(userId);
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found'
    });
  }

  // Check if phone number is unique
  const existingRider = await Riders.findOne({
    where: { phoneNumber }
  });

  if (existingRider) {
    return res.status(400).json({
      status: 'fail',
      message: 'Phone number already exists'
    });
  }

  const rider = await Riders.create({
    userId,
    name,
    phoneNumber,
    township,
    fullAddress,
    nrc,
    joinedDate,
    emergencyContact,
    vehicleType,
    photo,
    status: 'active'
  });

  // Update user role to Rider
  await user.update({ role: 'Rider' });

  res.status(201).json({
    status: 'success',
    data: {
      rider
    }
  });
});

// Update rider
exports.updateRider = catchAsync(async (req, res) => {
  const rider = await Riders.findByPk(req.params.id);

  if (!rider) {
    return res.status(404).json({
      status: 'fail',
      message: 'Rider not found'
    });
  }

  // Check phone number uniqueness if it's being updated
  if (req.body.phoneNumber && req.body.phoneNumber !== rider.phoneNumber) {
    const existingRider = await Riders.findOne({
      where: { phoneNumber: req.body.phoneNumber }
    });

    if (existingRider) {
      return res.status(400).json({
        status: 'fail',
        message: 'Phone number already exists'
      });
    }
  }

  const updatedRider = await rider.update(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      rider: updatedRider
    }
  });
});

// Toggle rider status
exports.toggleRiderStatus = catchAsync(async (req, res) => {
  const rider = await Riders.findByPk(req.params.id);

  if (!rider) {
    return res.status(404).json({
      status: 'fail',
      message: 'Rider not found'
    });
  }

  const newStatus = rider.status === 'active' ? 'inactive' : 'active';
  await rider.update({ status: newStatus });

  // Update associated user status
  await Users.update(
    { status: newStatus === 'active' },
    { where: { id: rider.userId } }
  );

  res.status(200).json({
    status: 'success',
    data: {
      rider
    }
  });
});

// Get rider deliveries
exports.getRiderDeliveries = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid rider ID'
    });
  }

  const rider = await Riders.findByPk(id);

  if (!rider) {
    return res.status(404).json({
      status: 'fail',
      message: 'Rider not found'
    });
  }

  const deliveries = await Deliveries.findAll({
    where: { riderId: id },
    include: [{
      model: Users,
      as: 'deliveryUser',
      attributes: ['username', 'email']
    }],
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: deliveries.length,
    data: {
      deliveries
    }
  });
});
module.exports = exports;