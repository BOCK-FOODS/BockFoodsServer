// src/controllers/auth.controller.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- Import jwt

const prisma = new PrismaClient();

const register = async (req, res) => {
  const { email, password, name } = req.body;

  // 1. Validate the input (basic)
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 4. Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // 5. Send back the created user (without the password)
    // We destructure the user object to omit the password for security
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 2. Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Use a generic error message for security
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Compare the provided password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. If credentials are correct, generate a JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Payload: Data to store in the token
      process.env.JWT_SECRET,                 // The secret key
      { expiresIn: '1d' }                     // Options: Token expires in 1 day
    );

    // 5. Send the token back to the client
    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};



module.exports = {
  register,
  login,
};