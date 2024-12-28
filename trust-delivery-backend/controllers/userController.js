// controllers/userController.js
const { Users, Riders } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await Users.findByPk(req.user.id, {
        attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
      });
      
      res.json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching profile'
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { username, email } = req.body;
      await Users.update(
        { username, email },
        { where: { id: req.user.id } }
      );

      const updatedUser = await Users.findByPk(req.user.id, {
        attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
      });

      res.json({
        status: 'success',
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error updating profile'
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await Users.findByPk(req.user.id);

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: 'error',
          message: 'Current password is incorrect'
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await Users.update(
        { 
          password: hashedPassword,
          failedLoginAttempts: 0,
          accountLocked: false,
          lockUntil: null
        },
        { where: { id: req.user.id } }
      );

      res.json({
        status: 'success',
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error changing password'
      });
    }
  },

  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const users = await Users.findAll({
        attributes: [
          'id', 'username', 'email', 'role', 'status',
          'createdAt', 'lastLogin', 'accountLocked',
          'failedLoginAttempts', 'lockUntil'
        ],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        status: 'success',
        data: { users }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching users'
      });
    }
  },

  // Add new user (admin only)
  addUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      
      // Check if user already exists
      const existingUser = await Users.findOne({ 
        where: { 
          email 
        } 
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already registered'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await Users.create({
        username,
        email,
        password: hashedPassword,
        role,
        status: true,
        failedLoginAttempts: 0,
        accountLocked: false
      });

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
          }
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Error creating user'
      });
    }
  },

  // Get single user (admin only)
  getUser: async (req, res) => {
    try {
      const user = await Users.findByPk(req.params.id, {
        attributes: { 
          exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] 
        }
      });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      res.json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching user'
      });
    }
  },

  // Update user (admin only)
  updateUser: async (req, res) => {
    try {
      const { username, email, role, status } = req.body;
      const user = await Users.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Check email uniqueness if email is being updated
      if (email !== user.email) {
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({
            status: 'error',
            message: 'Email already in use'
          });
        }
      }

      await user.update({
        username,
        email,
        role,
        status
      });

      res.json({
        status: 'success',
        message: 'User updated successfully',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
          }
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Error updating user'
      });
    }
  },

  // Delete user (admin only)
  deleteUser: async (req, res) => {
    try {
      const user = await Users.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Prevent deleting the last admin user
      if (user.role === 'admin') {
        const adminCount = await Users.count({ where: { role: 'admin' } });
        if (adminCount === 1) {
          return res.status(400).json({
            status: 'error',
            message: 'Cannot delete the last admin user'
          });
        }
      }

      await user.destroy();

      res.json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting user'
      });
    }
  },

  // Toggle user lock status (admin only)
  toggleUserLock: async (req, res) => {
    try {
      const user = await Users.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      await user.update({ 
        accountLocked: !user.accountLocked,
        failedLoginAttempts: 0,
        lockUntil: null
      });

      res.json({
        status: 'success',
        message: `User ${user.accountLocked ? 'locked' : 'unlocked'} successfully`,
        data: { accountLocked: user.accountLocked }
      });
    } catch (error) {
      console.error('Error toggling user lock:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error toggling user lock status'
      });
    }
  }
};

module.exports = userController;