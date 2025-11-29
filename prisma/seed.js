const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'Restaurant Owner',
      password: hashedPassword,
      role: 'RESTAURANT_OWNER',
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Pizza Palace',
      address: '123 Pizza St, Foodville',
      cuisine: 'Italian',
      ownerId: owner.id,
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Burger Barn',
      address: '456 Burger Ave, Foodville',
      cuisine: 'American',
      ownerId: owner.id,
    },
  });

  console.log('Seeding rich grocery data...');

  const vegCategory = await prisma.groceryCategory.create({ data: { name: 'Fresh Vegetables' } });
  const fruitsCategory = await prisma.groceryCategory.create({ data: { name: 'Fresh Fruits' } });
  const dairyCategory = await prisma.groceryCategory.create({ data: { name: 'Dairy and Bread' } });
  const staplesCategory = await prisma.groceryCategory.create({ data: { name: 'Atta, Rice and Dal' } });
  const oilsCategory = await prisma.groceryCategory.create({ data: { name: 'Oils and Ghee' } });
  const biscuitsCategory = await prisma.groceryCategory.create({ data: { name: 'Biscuits and Cakes' } });

  const quickMart = await prisma.groceryStore.create({ data: { name: 'QuickMart' } });

  await prisma.groceryItem.createMany({
    data: [
      { name: 'Fortune Sunlite Oil', price: 18.50, stock: 100, storeId: quickMart.id, categoryId: oilsCategory.id, isFeatured: true },
      { name: 'Parle-G Biscuits', price: 4.50, stock: 200, storeId: quickMart.id, categoryId: biscuitsCategory.id, isFeatured: true },
      { name: 'Amul Pure Ghee', price: 55.00, stock: 50, storeId: quickMart.id, categoryId: oilsCategory.id, isFeatured: true },
      { name: 'India Gate Basmati', price: 32.00, stock: 70, storeId: quickMart.id, categoryId: staplesCategory.id, isFeatured: true },
      { name: 'Tata Tea Premium', price: 8.00, stock: 90, storeId: quickMart.id, isFeatured: true },
      { name: 'Britannia Bread', price: 2.50, stock: 150, storeId: quickMart.id, categoryId: dairyCategory.id, isFeatured: true },
      { name: 'Onion', price: 1.50, stock: 100, storeId: quickMart.id, categoryId: vegCategory.id, isFeatured: false },
      { name: 'Tomato', price: 2.00, stock: 100, storeId: quickMart.id, categoryId: vegCategory.id, isFeatured: false },
      { name: 'Potato', price: 1.20, stock: 150, storeId: quickMart.id, categoryId: vegCategory.id, isFeatured: false },
      { name: 'Apple', price: 3.00, stock: 80, storeId: quickMart.id, categoryId: fruitsCategory.id, isFeatured: false },
      { name: 'Banana', price: 1.80, stock: 120, storeId: quickMart.id, categoryId: fruitsCategory.id, isFeatured: false },
      { name: 'Amul Milk', price: 1.00, stock: 200, storeId: quickMart.id, categoryId: dairyCategory.id, isFeatured: false },
      { name: 'Aashirvaad Atta', price: 15.00, stock: 120, storeId: quickMart.id, categoryId: staplesCategory.id, isFeatured: false },
      { name: 'Oreo Biscuits', price: 3.00, stock: 180, storeId: quickMart.id, categoryId: biscuitsCategory.id, isFeatured: false },
    ]
  });

  console.log('Rich seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });