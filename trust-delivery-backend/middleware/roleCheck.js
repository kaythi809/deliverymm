// middleware/roleCheck.js
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }

      // Get user role from req.user (set by auth middleware)
      const userRole = req.user.role;

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          status: 'error',
          message: `Access denied. ${userRole} role cannot perform this action.`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Role check failed',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

// Export the roles based on your PostgreSQL enum
roleCheck.ROLES = {
  ADMINISTRATOR: 'Administrator',
  RIDER: 'Rider',
  ADMIN: 'admin',
  SHOP_OWNER: 'shop_owner',
  RIDER_ROLE: 'rider',
  CUSTOMER: 'customer',
  USER: 'user',
  MANAGER: 'manager'
};

module.exports = roleCheck;