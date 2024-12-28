'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import models
const UserModel = require('./User');
const RiderModel = require('./Rider');
const DeliveriesModel = require('./Deliveries');
const OnlineShopsModel = require('./OnlineShops');

// Initialize models
const Users = UserModel(sequelize, Sequelize.DataTypes);
const Riders = RiderModel(sequelize, Sequelize.DataTypes);
const Deliveries = DeliveriesModel(sequelize, Sequelize.DataTypes);
const OnlineShops = OnlineShopsModel(sequelize, Sequelize.DataTypes);

// Add models to db object
db.Users = Users;
db.Riders = Riders;
db.Deliveries = Deliveries;
db.OnlineShops = OnlineShops;

// Define associations with unique aliases
db.Users.hasMany(db.Deliveries, {
  foreignKey: 'userId',
  as: 'userDeliveries',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});

db.Deliveries.belongsTo(db.Users, {
  foreignKey: 'userId',
  as: 'deliveryUser'
});

db.Riders.hasMany(db.Deliveries, {
  foreignKey: 'riderId',
  as: 'riderDeliveries',
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
});

db.Deliveries.belongsTo(db.Riders, {
  foreignKey: 'riderId',
  as: 'deliveryRider'
});

// Users and Riders association (one-to-one)
db.Users.hasOne(db.Riders, {
  foreignKey: 'userId',
  as: 'riderDetails',
  onUpdate: 'CASCADE'
});

db.Riders.belongsTo(db.Users, {
  foreignKey: 'userId',
  as: 'userData'
});

// OnlineShops and Deliveries association
if (!db.Deliveries.rawAttributes.onlineShopId) {
  sequelize.queryInterface.addColumn('Deliveries', 'onlineShopId', {
    type: Sequelize.INTEGER,
    references: {
      model: 'OnlineShops',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });
}

db.OnlineShops.hasMany(db.Deliveries, {
  foreignKey: 'onlineShopId',
  as: 'shopDeliveries'
});

db.Deliveries.belongsTo(db.OnlineShops, {
  foreignKey: 'onlineShopId',
  as: 'deliveryShop'
});

// Add sequelize instance to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sync models with database (in development only)
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized');
  }).catch(err => {
    console.error('Error synchronizing database:', err);
  });
}

module.exports = db;