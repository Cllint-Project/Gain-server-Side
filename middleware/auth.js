const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized', error: error.message });
//   }
// };

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);

      // Fetch the full user from database using _id from token
      req.user = await User.findById(decoded.id).select("-password");
      
      // If user not found, handle it
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error);

      // Handle specific JWT errors
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Default case for other errors
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    // No token in the request
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { protect, adminOnly };
