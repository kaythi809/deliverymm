// backend/models/Rider.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rider = sequelize.define('Rider', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,  // Added the missing comma here
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  township: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  nrc: {
    type: DataTypes.STRING,
    allowNull: true
  },
  joinedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    allowNull: false
  }
});

// Association method
Rider.associate = (models) => {
  Rider.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Rider;