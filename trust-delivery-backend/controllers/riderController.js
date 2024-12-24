// controllers/riderController.js
const Rider = require('../models/Rider');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getAllRiders = async (req, res) => {
    try {
        const riders = await Rider.findAll({
            include: [{
                model: User,
                attributes: ['email', 'role', 'status']
            }]
        });

        res.json({
            status: 'success',
            data: { riders }
        });
    } catch (error) {
        console.error('Get riders error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching riders'
        });
    }
};

exports.createRider = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            name,
            phoneNumber,
            township,
            fullAddress,
            email,
            password,
            nrc,
            joinedDate,
            emergencyContact,
            vehicleType,
            photo,
            status = 'active'
        } = req.body;

        // Validate required fields
        if (!name || !phoneNumber || !township || !fullAddress || !email || !password) {
            await transaction.rollback();
            return res.status(400).json({
                status: 'error',
                message: 'Required fields are missing'
            });
        }

        // Check existing email
        const existingUser = await User.findOne({ 
            where: { email },
            transaction 
        });

        if (existingUser) {
            await transaction.rollback();
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        // Check existing phone number
        const existingRider = await Rider.findOne({
            where: { phoneNumber },
            transaction
        });

        if (existingRider) {
            await transaction.rollback();
            return res.status(400).json({
                status: 'error',
                message: 'Phone number already registered'
            });
        }

        // Create user account with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: name,
            email,
            password: hashedPassword,
            role: 'rider',
            status: true
        }, { 
            transaction,
            hooks: false // Disable hooks since we're manually hashing
        });

        // Create rider profile
        const rider = await Rider.create({
            userId: user.id,
            name,
            phoneNumber,
            township,
            fullAddress,
            nrc,
            joinedDate: joinedDate || new Date(),
            emergencyContact,
            vehicleType,
            photo,
            status: 'active' // Use enum value instead of boolean
        }, { transaction });

        await transaction.commit();

        // Return success response with user and rider data
        res.status(201).json({
            status: 'success',
            message: 'Rider created successfully',
            data: {
                rider: {
                    ...rider.toJSON(),
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        status: user.status
                    }
                }
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Create rider error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating rider',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.getRider = async (req, res) => {
    try {
        const rider = await Rider.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['email', 'role', 'status']
            }]
        });

        if (!rider) {
            return res.status(404).json({
                status: 'error',
                message: 'Rider not found'
            });
        }

        res.json({
            status: 'success',
            data: { rider }
        });
    } catch (error) {
        console.error('Get rider error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching rider'
        });
    }
};

exports.updateRider = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const rider = await Rider.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['id', 'email', 'role', 'status']
            }]
        });

        if (!rider) {
            await transaction.rollback();
            return res.status(404).json({
                status: 'error',
                message: 'Rider not found'
            });
        }

        // Update rider data
        await rider.update(req.body, { transaction });

        // If email is being updated, update the associated user as well
        if (req.body.email) {
            await User.update(
                { email: req.body.email },
                { 
                    where: { id: rider.userId },
                    transaction 
                }
            );
        }

        await transaction.commit();

        // Fetch updated rider with user data
        const updatedRider = await Rider.findByPk(rider.id, {
            include: [{
                model: User,
                attributes: ['email', 'role', 'status']
            }]
        });

        res.json({
            status: 'success',
            message: 'Rider updated successfully',
            data: { rider: updatedRider }
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Update rider error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating rider'
        });
    }
};

exports.toggleRiderStatus = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const rider = await Rider.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['id', 'status']
            }]
        });

        if (!rider) {
            await transaction.rollback();
            return res.status(404).json({
                status: 'error',
                message: 'Rider not found'
            });
        }

        // Toggle status between 'active' and 'inactive'
        const newStatus = rider.status === 'active' ? 'inactive' : 'active';

        await rider.update({
            status: newStatus
        }, { transaction });

        // Update associated user status (boolean)
        await User.update(
            { status: newStatus === 'active' },
            { 
                where: { id: rider.userId },
                transaction 
            }
        );

        await transaction.commit();

        // Fetch updated rider with user data
        const updatedRider = await Rider.findByPk(rider.id, {
            include: [{
                model: User,
                attributes: ['email', 'role', 'status']
            }]
        });

        res.json({
            status: 'success',
            message: 'Rider status updated successfully',
            data: { rider: updatedRider }
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Toggle rider status error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating rider status'
        });
    }
};