// src/controllers/cart.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// A helper function to get or create a cart for a user
const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }
  return cart;
};



// GET /api/cart
const getCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { // Include the cart items
          include: {
            menuItem: true, // And for each item, include the menu item details
          },
        },
      },
    });

    if (!cart) {
      // If user has no cart yet, return an empty structure
      return res.status(200).json({ items: [], total: 0 });
    }
    
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: 'Failed to get cart', error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  const userId = req.user.userId;
  const { menuItemId, groceryItemId, quantity } = req.body; // <-- Accept both IDs

  if ((!menuItemId && !groceryItemId) || quantity == null || quantity <= 0) {
    return res.status(400).json({ message: 'An item ID and a valid quantity are required.' });
  }

  try {
    const cart = await getOrCreateCart(userId);
    const whereClause = menuItemId 
      ? { cartId: cart.id, menuItemId: menuItemId }
      : { cartId: cart.id, groceryItemId: groceryItemId };
    
    const existingCartItem = await prisma.cartItem.findFirst({ where: whereClause });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          quantity: quantity,
          menuItemId: menuItemId, // Will be null if groceryItemId is provided
          groceryItemId: groceryItemId, // Will be null if menuItemId is provided
        },
      });
    }
    await getCart(req, res); // Return the full, updated cart
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
};

// --- MODIFIED: removeItemFromCart ---
const removeItemFromCart = async (req, res) => {
    const userId = req.user.userId;
    const { menuItemId, groceryItemId } = req.body; // <-- Accept both IDs

    if (!menuItemId && !groceryItemId) {
        return res.status(400).json({ message: 'An item ID is required.' });
    }

    try {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) return res.status(404).json({ message: "Cart not found." });

        const whereClause = menuItemId 
            ? { cartId: cart.id, menuItemId: menuItemId }
            : { cartId: cart.id, groceryItemId: groceryItemId };

        const existingCartItem = await prisma.cartItem.findFirst({ where: whereClause });

        if (existingCartItem) {
            if (existingCartItem.quantity > 1) {
                await prisma.cartItem.update({
                    where: { id: existingCartItem.id },
                    data: { quantity: { decrement: 1 } },
                });
            } else {
                await prisma.cartItem.delete({ where: { id: existingCartItem.id } });
            }
        }
        await getCart(req, res); // Return the full, updated cart
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove item', error: error.message });
    }
};

// ... (Make sure to export all functions) ...
module.exports = { addItemToCart, getCart, removeItemFromCart };