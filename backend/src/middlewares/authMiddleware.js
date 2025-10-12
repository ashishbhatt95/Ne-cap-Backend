const jwt = require('jsonwebtoken');
const Passenger = require('../models/passengerSchema'); 
const Rider = require('../models/Rider');               
const Superadmin = require('../models/admin');          

const roleAuthorization = (...allowedRoles) => {
  // Flatten in case someone passes nested arrays
  allowedRoles = allowedRoles.flat();

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1].trim();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      const tokenRole = decoded.role.toLowerCase();
      switch (tokenRole) {
        case "user":
          user = await Passenger.findById(decoded.id);
          break;
        case "rider":
          user = await Rider.findById(decoded.id);
          break;
        case "admin":
          user = await Superadmin.findById(decoded.id);
          break;
        default:
          return res.status(403).json({ message: "Forbidden: Invalid role" });
      }

      if (!user) return res.status(404).json({ message: "User not found" });

      // Normalize and check allowed roles
      const allowedRolesNormalized = allowedRoles.map(r => r.toLowerCase());
      if (!allowedRolesNormalized.includes(tokenRole)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      req.user = { id: user._id, role: tokenRole };
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  };
};


module.exports = { roleAuthorization };
