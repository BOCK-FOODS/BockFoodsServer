// src/controllers/grocery.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllGroceryStores = async (req, res) => {
  try {
    const stores = await prisma.groceryStore.findMany();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Cannot fetch grocery stores', error: error.message });
  }
};

const getGroceryStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const store = await prisma.groceryStore.findUnique({
      where: { id },
      include: { items: true }, // Include all items for the store
    });
    if (!store) {
      return res.status(404).json({ message: 'Grocery store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Cannot fetch store details', error: error.message });
  }
};

const getAllGroceryItems = async (req, res) => {
  try {
    const items = await prisma.groceryItem.findMany();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Cannot fetch grocery items', error: error.message });
  }
};

module.exports = { getAllGroceryStores, getGroceryStoreById,   getAllGroceryItems, // <-- Add this
 };