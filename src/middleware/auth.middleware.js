// src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get the token from the request header
  // The header looks like: "Authorization: Bearer <TOKEN>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If there's no token, the user is not authorized
  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  // Verify the token is valid
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If the token is expired or invalid
      return res.sendStatus(403); // Forbidden
    }

    // If the token is valid, attach the user payload to the request object
    // so our controllers can use it
    req.user = user;
    
    // Move on to the next function (the actual route handler)
    next();
  });
};

module.exports = authenticateToken;