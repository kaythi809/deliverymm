// models/Deliveries.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Deliveries extends Model {
    static associate(models) {
      Deliveries.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'deliveryUseruser',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });

      Deliveries.belongsTo(models.Riders, {
        foreignKey: 'riderId',
        as: 'deliveryRider',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });

      Deliveries.belongsTo(models.OnlineShops, {
        foreignKey: 'onlineShopId',
        as: 'deliveryShop'  // Changed from 'onlineShop' for consistency
      });
    }
  }
  
  Deliveries.init({
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
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    riderId: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Added explicit allowNull
      references: {
        model: 'Riders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    onlineShopId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'OnlineShops',
        key: 'id'
      }
    },
    pickupAddress: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    deliveryAddress: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    scheduledTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Deliveries',
    timestamps: true,
    indexes: [
      {
        name: 'deliveries_user_id',
        fields: ['userId']
      },
      {
        name: 'deliveries_rider_id',
        fields: ['riderId']
      },
      {
        name: 'deliveries_status',
        fields: ['status']
      }
    ]
  });

  return Deliveries;
};