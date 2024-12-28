// middleware/auth.js
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const rateLimit = require('express-rate-limit');

// Constants
const TOKEN_EXPIRY = '24h';
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_TRIES = process.env.NODE_ENV === 'development' ? 100 : 5;

// Verify JWT token function
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Token refresh function
const refreshToken = (user) => {
    return jwt.sign(
        { 
            id: user.id,
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
};

// Main authentication middleware
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Extract token from various sources
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        } else if (req.body?.token) {
            token = req.body.token;
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required. Please log in.'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Check if user exists
        const currentUser = await Users.findOne({
            where: { id: decoded.id },
            attributes: [
                'id', 
                'username', 
                'email', 
                'role', 
                'status', 
                'createdAt',
                'failedLoginAttempts',
                'accountLocked',
                'lockUntil'
            ]
        });

        if (!currentUser) {
            return res.status(401).json({
                status: 'error',
                message: 'User no longer exists.'
            });
        }

        // Check if account is locked
        if (currentUser.accountLocked && currentUser.lockUntil && currentUser.lockUntil > new Date()) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is locked. Please try again later.',
                lockUntil: currentUser.lockUntil
            });
        }

        // Check user status
        if (!currentUser.status) {
            return res.status(403).json({
                status: 'error',
                message: 'Account is inactive. Please contact support.'
            });
        }

        // Check token expiration and refresh if needed
        const tokenExp = decoded.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = tokenExp - now;

        // If token is close to expiring (less than 1 hour), refresh it
        if (timeUntilExpiry < 3600000) {
            const newToken = refreshToken(currentUser);
            res.setHeader('X-Auth-Token', newToken);
        }

        // Add user info to request
        req.user = {
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role,
            username: currentUser.username,
            status: currentUser.status,
            createdAt: currentUser.createdAt
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });

        return res.status(401).json({
            status: 'error',
            message: error.message === 'Invalid token' ? 
                'Your session has expired. Please log in again.' : 
                'Authentication failed. Please try again.',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Role-based access control
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Access denied. ${req.user.role} role cannot perform this action.`
            });
        }
        next();
    };
};

// Rate limiting configuration
exports.loginLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW,
    max: RATE_LIMIT_MAX_TRIES,
    message: {
        status: 'error',
        message: 'Too many login attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many login attempts. Please try again later.',
            nextValidRequestTime: new Date(Date.now() + RATE_LIMIT_WINDOW)
        });
    }
});

// Admin-only middleware
exports.adminOnly = (req, res, next) => {
    const adminRoles = ['Administrator', 'admin'];
    if (!adminRoles.includes(req.user.role)) {
        return res.status(403).json({
            status: 'error',
            message: 'This action requires administrator privileges'
        });
    }
    next();
};

// Resource ownership middleware
exports.checkOwnership = (req, res, next) => {
    const resourceId = parseInt(req.params.id);
    const adminRoles = ['Administrator', 'admin'];
    
    if (adminRoles.includes(req.user.role)) {
        return next();
    }

    if (req.user.id !== resourceId) {
        return res.status(403).json({
            status: 'error',
            message: 'You can only access your own records'
        });
    }
    next();
};

// API key authentication
exports.apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid API key'
        });
    }
    next();
};

module.exports = exports;