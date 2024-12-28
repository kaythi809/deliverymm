// models/Rider.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Riders extends Model {  // Changed to plural to match schema
    static associate(models) {
      Riders.belongsTo(models.Users, {  // Changed to plural
        foreignKey: 'userId',
        as: 'userData'
      });
      
      Riders.hasMany(models.Deliveries, {
        foreignKey: 'riderId',
        as: 'riderDeliveries'
      });
    }
  }

  Riders.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    township: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fullAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nrc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    joinedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emergencyContact: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    vehicleType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Riders',  // Changed to plural
    timestamps: true
  });

  return Riders;
};