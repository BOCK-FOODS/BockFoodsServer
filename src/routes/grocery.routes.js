// src/routes/grocery.routes.js
const express = require('express');
const { getAllGroceryStores, getGroceryStoreById, getAllGroceryItems } = require('../controllers/grocery.controller'); // <-- Import new function

const router = express.Router();

router.get('/', getAllGroceryStores);
router.get('/items', getAllGroceryItems); // <-- ADD THIS NEW ROUTE
router.get('/:id', getGroceryStoreById);

module.exports = router;