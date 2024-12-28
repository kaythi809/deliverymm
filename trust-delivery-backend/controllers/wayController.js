// controllers/wayController.js
const wayController = {
    createWay: async (req, res) => {
      try {
        const way = await Way.create({
          ...req.body,
          trackingNumber: generateTrackingNumber()
        });
        res.status(201).json({ success: true, data: way });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    },
    // Add other way-related methods
  };
  
  // controllers/parcelController.js
  const parcelController = {
    // Implement parcel management methods
  };
  
  // controllers/customerController.js
  const customerController = {
    // Implement customer management methods
  };