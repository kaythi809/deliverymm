// models/OnlineShops.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OnlineShops extends Model {  // Changed to plural form
    static associate(models) {
      // Define associations
      OnlineShops.hasMany(models.Deliveries, {
        foreignKey: 'onlineShopId',
        as: 'shopDeliveries'
      });
    }
  }

  OnlineShops.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    osName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    township: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    accountId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    contactPersons: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false
    },
    bankAccounts: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false
    },
    paymentMethods: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    bankInfo: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'OnlineShops',  // Changed to plural form
    timestamps: true
  });

  return OnlineShops;
};