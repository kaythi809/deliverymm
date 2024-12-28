// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users, sequelize } = require('../models'); // Import Users model and sequelize from models index
const { Op } = require('sequelize');

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

        const user = await Users.findOne({ 
            where: { email: req.body.email },
            attributes: ['id', 'username', 'email', 'password', 'role', 'status', 'failedLoginAttempts', 'accountLocked', 'lockUntil']
        });

        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Check if account is locked
        if (user.accountLocked && user.lockUntil && user.lockUntil > new Date()) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is locked. Please try again later',
                lockUntil: user.lockUntil
            });
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            // Increment failed login attempts
            const failedAttempts = (user.failedLoginAttempts || 0) + 1;
            const updates = { failedLoginAttempts: failedAttempts };
            
            // Lock account after 5 failed attempts
            if (failedAttempts >= 5) {
                const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                Object.assign(updates, {
                    accountLocked: true,
                    lockUntil
                });
            }
            
            await user.update(updates);

            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
                attemptsRemaining: Math.max(0, 5 - failedAttempts)
            });
        }

        // Check if user is active
        if (!user.status) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is inactive'
            });
        }

        // Reset failed login attempts and lock status on successful login
        await user.update({
            failedLoginAttempts: 0,
            accountLocked: false,
            lockUntil: null,
            lastLogin: new Date()
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
        const existingUser = await Users.findOne({ 
            where: { 
                [Op.or]: [
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await Users.create({
            username,
            email,
            password: hashedPassword,
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

// User status check route
router.get('/user-status', async (req, res) => {
    try {
        const email = req.query.email || req.body.email;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is required'
            });
        }

        const user = await Users.findOne({ 
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

module.exports = router;