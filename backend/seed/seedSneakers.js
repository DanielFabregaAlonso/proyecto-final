require('dotenv').config();
const connectDB = require('../config/db');
const Sneaker = require('../models/Sneaker');
const readExcelSheet = require('./readExcelSheet');

function parseSizes(field) {
  return String(field).split('|').map((chunk) => {
    const [size, stock] = chunk.split(':');
    return { size: Number(size), stock: Number(stock) };
  });
}

async function seedSneakers() {
  await connectDB();
  const rows = await readExcelSheet('sneakers');

  await Sneaker.deleteMany({});

  const sneakers = rows.map((row) => ({
    sku: row.sku,
    name: row.name,
    brand: row.brand,
    category: row.category,
    gender: row.gender,
    price: Number(row.price),
    color: row.color,
    sizes: parseSizes(row.sizes),
    description: row.description,
    images: row.imageUrl ? [row.imageUrl] : [],
    featured: row.featured === true,
  }));

  await Sneaker.insertMany(sneakers);
  console.log(`Seeded ${sneakers.length} sneakers.`);
  process.exit(0);
}

seedSneakers().catch((err) => {
  console.error(err);
  process.exit(1);
});
