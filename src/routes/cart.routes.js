// src/routes/cart.routes.js
const express = require('express');
const { addItemToCart, getCart, removeItemFromCart } = require('../controllers/cart.controller'); 
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

// All cart routes are protected
router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', addItemToCart);
router.post('/remove', removeItemFromCart); // <-- Add this new route

module.exports = router;