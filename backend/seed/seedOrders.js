require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Sneaker = require('../models/Sneaker');
const Order = require('../models/Order');
const readExcelSheet = require('./readExcelSheet');

async function seedOrders() {
  await connectDB();
  const rows = await readExcelSheet('orders');

  const users = await User.find({});
  const sneakers = await Sneaker.find({});
  const userByEmail = new Map(users.map((u) => [u.email, u]));
  const sneakerBySku = new Map(sneakers.map((s) => [s.sku, s]));

  const grouped = new Map();
  rows.forEach((row) => {
    if (!grouped.has(row.orderId)) grouped.set(row.orderId, []);
    grouped.get(row.orderId).push(row);
  });

  await Order.deleteMany({});

  const orders = [];
  grouped.forEach((items, orderId) => {
    const first = items[0];
    const user = userByEmail.get(first.userEmail.toLowerCase());
    if (!user) {
      console.warn(`Skipping ${orderId}: unknown user ${first.userEmail}`);
      return;
    }

    const orderItems = [];
    let total = 0;
    items.forEach((item) => {
      const sneaker = sneakerBySku.get(item.sneakerSku);
      if (!sneaker) {
        console.warn(`Skipping item in ${orderId}: unknown sneaker ${item.sneakerSku}`);
        return;
      }
      const quantity = Number(item.quantity);
      const priceAtPurchase = Number(item.priceAtPurchase);
      orderItems.push({ sneaker: sneaker._id, size: Number(item.size), quantity, priceAtPurchase });
      total += quantity * priceAtPurchase;
    });
    if (orderItems.length === 0) return;

    orders.push({
      user: user._id,
      items: orderItems,
      shippingAddress: {
        fullName: first.shippingName,
        address: first.shippingAddress,
        city: first.shippingCity,
        postalCode: first.shippingPostalCode,
        country: first.shippingCountry,
        phone: first.shippingPhone,
      },
      status: first.status,
      total,
      createdAt: new Date(first.orderDate),
    });
  });

  await Order.insertMany(orders);
  console.log(`Seeded ${orders.length} orders.`);
  process.exit(0);
}

seedOrders().catch((err) => {
  console.error(err);
  process.exit(1);
});
