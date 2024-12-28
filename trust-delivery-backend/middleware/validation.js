// middleware/validation.js
const validateWay = (req, res, next) => {
    const { onlineShopId, pickupType, parcelQuantity, pickupDate } = req.body;
    if (!onlineShopId || !pickupType || !parcelQuantity || !pickupDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    next();
  };