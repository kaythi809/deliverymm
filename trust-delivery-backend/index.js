// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database');
const riderRoutes = require('./routes/riderRoutes');
const onlineShopRoutes = require('./routes/onlineShopRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const { protect } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined });
    }
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Changed to more specific path
app.use('/api/riders', protect, riderRoutes); // Added protect middleware
app.use('/api/shops', protect, onlineShopRoutes); // Added protect middleware and more specific path
app.use('/api/deliveries', protect, deliveryRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.path}`
    });
});

// Global error handling middleware (combined and improved)
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    // Handle Sequelize errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            errors: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            status: 'error',
            message: 'Duplicate entry',
            errors: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token. Please log in again.'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Your token has expired. Please log in again.'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        debug: process.env.NODE_ENV === 'development' ? {
            stack: err.stack,
            detail: err.detail
        } : undefined
    });
});

// Database connection and server startup
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Sync models with database
        await sequelize.sync({ force: false });
        console.log('✅ Database models synchronized');

        // Start server
        app.listen(PORT, () => {
            console.log(`
🚀 Server is running!
📡 PORT: ${PORT}
🌍 ENV: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${PORT}
            `);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
    process.exit(1);
});

// Start the server
startServer();

module.exports = app; // Export for testing purposes