// src/routes/restaurant.routes.js
const express = require('express');
const { getAllRestaurants, getRestaurantById } = require('../controllers/restaurant.controller');

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

module.exports = router;