// src/routes/user.routes.js

const express = require('express');
const { getMyProfile } = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/users/me
// We place the middleware *before* the controller function.
router.get('/me', authenticateToken, getMyProfile);

module.exports = router;