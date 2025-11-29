// src/controllers/user.controller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMyProfile = async (req, res) => {
  // Our authenticateToken middleware attaches the user payload to req.user
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Select specific fields to avoid sending back the hashed password
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  getMyProfile,
};