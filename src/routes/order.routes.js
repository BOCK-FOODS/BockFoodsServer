// src/routes/order.routes.js
const express = require('express');
const { placeOrder } = require('../controllers/order.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

// All order routes are protected
router.use(authenticateToken);

router.post('/place', placeOrder);

module.exports = router;