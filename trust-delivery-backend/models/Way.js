// models/Way.js
const Way = sequelize.define('Way', {
    trackingNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    onlineShopId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'OnlineShops',
        key: 'id'
      }
    },
    pickupType: {
      type: DataTypes.ENUM('direct_pickup', 'highway_gate'),
      allowNull: false
    },
    parcelQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pickupDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'way_created',
        'delivery_assigned',
        'on_the_way',
        'sent',
        'money_sent_to_shop',
        'wrong_phone_address',
        'returned_to_shop'
      ),
      defaultValue: 'way_created'
    },
    comments: DataTypes.TEXT
  });
  
  // models/Parcel.js
  const Parcel = sequelize.define('Parcel', {
    wayId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Ways',
        key: 'id'
      }
    },
    weight: DataTypes.DECIMAL(10, 2),
    dimensions: DataTypes.JSONB,
    isFragile: DataTypes.BOOLEAN,
    deliveryCharges: DataTypes.DECIMAL(10, 2),
    codAmount: DataTypes.DECIMAL(10, 2),
    itemValue: DataTypes.DECIMAL(10, 2),
    customerFee: DataTypes.DECIMAL(10, 2),
    shopPrepayment: DataTypes.DECIMAL(10, 2),
    transportCost: DataTypes.DECIMAL(10, 2),
    photoUrl: DataTypes.STRING
  });
  
  // models/Customer.js
  const Customer = sequelize.define('Customer', {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receiptName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    additionalPhones: DataTypes.JSONB,
    township: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    comments: DataTypes.TEXT
  });