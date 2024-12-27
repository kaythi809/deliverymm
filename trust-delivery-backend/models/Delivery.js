// models/Delivery.js
const Delivery = sequelize.define('Delivery', {
    wayId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    riderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('assigned', 'on_way', 'delivered', 'cancelled'),
      defaultValue: 'assigned'
    },
    amountCollected: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    amountTransferred: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  });