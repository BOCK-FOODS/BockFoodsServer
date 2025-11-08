// src/routes/auth.routes.js

const express = require('express');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

// Define the registration route
// POST /api/auth/register
router.post('/register', register);
router.post('/login', login); // <-- Add this new line

module.exports = router;