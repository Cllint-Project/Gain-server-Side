const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
  try {
    let token;

    // টোকেন যাচাই করা
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ 
        message: "Not authorized. Token missing." 
      });
    }

    // টোকেন ডিকোড করা এবং ব্যবহারকারীর তথ্য বের করা
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    console.log('middleware', req.user)
    if (!req.user) {
      return res.status(401).json({ 
        message: "Not authorized. User not found." 
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      message: "Not authorized. Invalid token.", 
      error: error.message 
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { protect,adminOnly };