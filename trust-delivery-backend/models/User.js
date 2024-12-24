// backend/models/User.js
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

class User extends Model {
  // Instance methods
  async comparePassword(candidatePassword) {
    try {
      if (!candidatePassword || !this.password) {
        console.log('Missing password for comparison');
        return false;
      }
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
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

  // Method to safely return user data without sensitive information
  toSafeObject() {
    const { id, username, email, role, status, createdAt, updatedAt } = this;
    return { id, username, email, role, status, createdAt, updatedAt };
  }
}

User.init({
  username: {
    type: DataTypes.STRING,
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
    type: DataTypes.STRING,
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
    type: DataTypes.STRING,
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

  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },

  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },

  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
},

  role: {
    type: DataTypes.ENUM('admin', 'user', 'rider', 'manager'),
    defaultValue: 'user',
    validate: {
      isIn: {
        args: [['admin', 'user', 'rider', 'manager']],
        msg: 'Invalid role specified'
      }
    }
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
    type: DataTypes.STRING,
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
  modelName: 'User',
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Static methods
User.associate = (models) => {
  User.hasOne(models.Rider, {
    foreignKey: 'userId',
    as: 'rider',
    onDelete: 'CASCADE'
  });
};

// Additional static methods
User.createPasswordResetToken = async function(email) {
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

User.prototype.incrementFailedLoginAttempts = async function() {
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.accountLocked = true;
    this.lockUntil = new Date(Date.now() + 30 * 60000); // Lock for 30 minutes
  }
  
  await this.save();
};

User.prototype.resetFailedLoginAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.accountLocked = false;
  this.lockUntil = null;
  await this.save();
};

User.prototype.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

module.exports = User;