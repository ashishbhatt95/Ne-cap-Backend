const jwt = require("jsonwebtoken");
const Passenger = require("../models/passengerSchema");
const Rider = require("../models/Rider");
const Superadmin = require("../models/admin");

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === "user") user = await Passenger.findById(decoded.id);
    if (decoded.role === "rider") user = await Rider.findById(decoded.id);
    if (decoded.role === "superadmin") user = await Superadmin.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = { id: user._id, role: decoded.role };
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based access control
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
