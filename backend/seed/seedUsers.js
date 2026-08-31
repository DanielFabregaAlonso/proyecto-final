require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const readExcelSheet = require('./readExcelSheet');

async function seedUsers() {
  await connectDB();
  const rows = await readExcelSheet('users');

  await User.deleteMany({});

  const users = await Promise.all(
    rows.map(async (row) => ({
      name: row.name,
      email: row.email.toLowerCase(),
      passwordHash: await bcrypt.hash(row.password, 10),
      role: row.role,
    }))
  );

  await User.insertMany(users);
  console.log(`Seeded ${users.length} users.`);
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
