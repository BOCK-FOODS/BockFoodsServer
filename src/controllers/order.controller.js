// src/controllers/order.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const placeOrder = async (req, res) => {
  const userId = req.user.userId;

  try {
    // 1. Find the user's cart with all items and their details
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
            groceryItem: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // 2. Calculate the total amount from the items in the cart
    const totalAmount = cart.items.reduce((sum, item) => {
      const itemPrice = item.menuItem?.price || item.groceryItem?.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    // 3. Use a transaction to perform all database writes together
    const order = await prisma.$transaction(async (tx) => {
      // a. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
        },
      });

      // b. Create OrderItems from CartItems
      const orderItemsData = cart.items.map(item => ({
        orderId: newOrder.id,
        quantity: item.quantity,
        price: item.menuItem?.price || item.groceryItem?.price,
        menuItemId: item.menuItemId,
        groceryItemId: item.groceryItemId,
      }));
      
      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      // c. Clear the user's cart by deleting all CartItems
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    res.status(201).json({ message: 'Order placed successfully!', order });

  } catch (error) {
    console.error('Order placement failed:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

module.exports = { placeOrder };