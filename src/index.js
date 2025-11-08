// src/index.js

const express = require('express');
require('dotenv').config();
const authRouter = require('./routes/auth.routes'); // Import the auth router

const app = express();
const PORT = process.env.PORT || 3000;

// This is a crucial middleware that allows our server to read JSON from the body of requests
app.use(express.json());

// Main test route
app.get('/', (req, res) => {
  res.send('Hello, Swiggy Backend!');
});

// Use the authentication routes
// All routes in authRouter will be prefixed with /api/auth
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});