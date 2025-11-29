// src/controllers/restaurant.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Cannot fetch restaurants', error: error.message });
  }
};

// GET /api/restaurants/:id
const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: id },
      include: {
        menuItems: true, // Also fetch all menu items for this restaurant
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Cannot fetch restaurant details', error: error.message });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
};