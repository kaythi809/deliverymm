// models/User.js
'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {  // Changed to plural to match schema
    static associate(models) {
      Users.hasMany(models.Deliveries, {
        foreignKey: 'userId',
        as: 'userDeliveries'
      });
      
      Users.hasOne(models.Riders, {
        foreignKey: 'userId',
        as: 'riderDetails'
      });
    }

    // Instance methods
    async comparePassword(candidatePassword) {
      try {
        if (!candidatePassword || !this.password) {
          console.log('Missing password for comparison');
          return false;
        }
        return await bcrypt.compare(candidatePassword, this.password);
      } catch (error) {
        console.error('Password comparison error:', error);
        return false;
      }
    }

    isActive() {
      return this.status === true;
    }

    hasRole(role) {
      return this.role === role;
    }

    toSafeObject() {
      const { id, username, email, role, status, createdAt, updatedAt } = this;
      return { id, username, email, role, status, createdAt, updatedAt };
    }

    async incrementFailedLoginAttempts() {
      this.failedLoginAttempts += 1;
      if (this.failedLoginAttempts >= 5) {
        this.accountLocked = true;
        this.lockUntil = new Date(Date.now() + 30 * 60000);
      }
      await this.save();
    }

    async resetFailedLoginAttempts() {
      this.failedLoginAttempts = 0;
      this.accountLocked = false;
      this.lockUntil = null;
      await this.save();
    }

    async updateLastLogin() {
      this.lastLogin = new Date();
      await this.save();
    }
  }

  Users.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'This username is already taken'
      },
      validate: {
        notEmpty: {
          msg: 'Username cannot be empty'
        },
        len: {
          args: [3, 50],
          msg: 'Username must be between 3 and 50 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'This email is already registered'
      },
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        len: {
          args: [6, 100],
          msg: 'Password must be between 6 and 100 characters'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('Administrator', 'Rider', 'admin', 'shop_owner', 'rider', 'customer', 'user', 'manager'),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    accountLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Users',  // Changed to plural
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Static methods
  Users.createPasswordResetToken = async function(email) {
    const user = await this.findOne({ where: { email } });
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    return resetToken;
  };

  return Users;
};