// models/Transaction.js
const Transaction = sequelize.define('Transaction', {
    wayId: {
      type: DataTypes.INTEGER,
      references: { model: 'Ways', key: 'id' }
    },
    riderId: {
      type: DataTypes.INTEGER,
      references: { model: 'Riders', key: 'id' }
    },
    onlineShopId: {
      type: DataTypes.INTEGER,
      references: { model: 'OnlineShops', key: 'id' }
    },
    type: DataTypes.ENUM('cod_collection', 'rider_payment', 'shop_payment'),
    amount: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('pending', 'completed', 'failed')
  });