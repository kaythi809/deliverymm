// trust-delivery-backend/models/OnlineShop.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OnlineShop = sequelize.define('OnlineShop', {
  osName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  township: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  accountId: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  paymentMethods: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  bankInfo: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
});

module.exports = OnlineShop;