// src/index.js

const express = require('express');
require('dotenv').config();
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const restaurantRouter = require('./routes/restaurant.routes'); // <-- Import
const cors = require('cors'); // <-- 1. Import cors
const cartRouter = require('./routes/cart.routes'); // <-- Import
const orderRouter = require('./routes/order.routes'); // <-- Import
const groceryRouter = require('./routes/grocery.routes'); // <-- Import


const app = express();
app.use(cors()); 

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Backend!');
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/restaurants', restaurantRouter); // <-- Use the new router
app.use('/api/cart', cartRouter); // <-- Use the new cart router
app.use('/api/orders', orderRouter); // <-- Use the new order router
app.use('/api/grocerystores', groceryRouter); // <-- Use the new grocery router

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});