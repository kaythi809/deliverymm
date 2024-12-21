// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Add input validation middleware
const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Email and password are required'
        });
    }
    next();
};

// Login route with validation
router.post('/login', validateLoginInput, async (req, res) => {
    try {
        console.log('Login request received:', { email: req.body.email });

        const user = await User.findOne({ 
            where: { email: req.body.email },
            attributes: ['id', 'username', 'email', 'password', 'role', 'status']
        });

        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await user.comparePassword(req.body.password);
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.status) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is inactive'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            status: 'success',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                username: user.username,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during login',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Registration route with validation
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            where: { 
                [sequelize.Op.or]: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: existingUser.email === email ? 
                    'Email already registered' : 
                    'Username already taken'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'customer',
            status: true
        });

        const token = jwt.sign(
            { 
                id: user.id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                username: user.username,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during registration',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// User status check route (supports both GET and POST)
router.get('/user-status', async (req, res) => {
    try {
        const email = req.query.email || req.body.email;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ 
            where: { email },
            attributes: ['id', 'email', 'username', 'status', 'role']
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.json({
            status: 'success',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                status: user.status,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error checking user status',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Account activation route
router.post('/activate-account', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        user.status = true;
        await user.save();

        res.json({
            status: 'success',
            message: 'Account activated successfully',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                status: user.status,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Activation error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error activating account',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;