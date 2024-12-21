// backend/create-test-user.js
const User = require('./models/User');
const sequelize = require('./config/database');

const createTestUser = async () => {
    try {
        await sequelize.sync();
        
        const testUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'admin'
        };

        const user = await User.create(testUser);
        console.log('Test user created:', {
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await sequelize.close();
    }
};

createTestUser();