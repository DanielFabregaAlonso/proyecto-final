const path = require('path');
const ExcelJS = require('exceljs');
const { faker } = require('@faker-js/faker');

faker.seed(2026);

const CATEGORIES = ['running', 'baloncesto', 'skate', 'lifestyle', 'entrenamiento'];
const GENDERS = ['hombre', 'mujer', 'unisex'];
const COLORS = ['Negro', 'Blanco', 'Gris', 'Azul marino', 'Rojo', 'Verde', 'Beige', 'Multicolor'];
const SIZES = [38, 39, 40, 41, 42, 43, 44, 45];

const PRODUCTS = [
  { brand: 'Nike', model: 'Air Max 90', category: 'lifestyle' },
  { brand: 'Nike', model: 'Air Zoom Pegasus 40', category: 'running' },
  { brand: 'Nike', model: 'React Infinity Run', category: 'running' },
  { brand: 'Nike', model: 'Kyrie Flytrap', category: 'baloncesto' },
  { brand: 'Nike', model: 'SB Dunk Low', category: 'skate' },
  { brand: 'Nike', model: 'Metcon 9', category: 'entrenamiento' },
  { brand: 'Adidas', model: 'Ultraboost Light', category: 'running' },
  { brand: 'Adidas', model: 'Samba OG', category: 'lifestyle' },
  { brand: 'Adidas', model: 'Dame 8', category: 'baloncesto' },
  { brand: 'Adidas', model: 'Puig', category: 'skate' },
  { brand: 'Adidas', model: 'Dropset 2', category: 'entrenamiento' },
  { brand: 'Puma', model: 'RS-X', category: 'lifestyle' },
  { brand: 'Puma', model: 'Velocity Nitro 3', category: 'running' },
  { brand: 'Puma', model: 'Court Rider', category: 'baloncesto' },
  { brand: 'New Balance', model: '990v6', category: 'lifestyle' },
  { brand: 'New Balance', model: 'FuelCell Rebel v4', category: 'running' },
  { brand: 'New Balance', model: 'Fresh Foam X 1080v13', category: 'running' },
  { brand: 'Asics', model: 'Gel-Kayano 30', category: 'running' },
  { brand: 'Asics', model: 'Gel-Nimbus 26', category: 'running' },
  { brand: 'Vans', model: 'Old Skool', category: 'skate' },
  { brand: 'Vans', model: 'Sk8-Hi', category: 'skate' },
  { brand: 'Converse', model: 'Chuck Taylor All Star', category: 'lifestyle' },
  { brand: 'Converse', model: 'Chuck 70', category: 'lifestyle' },
  { brand: 'Reebok', model: 'Nano X4', category: 'entrenamiento' },
  { brand: 'Reebok', model: 'Club C 85', category: 'lifestyle' },
  { brand: 'Under Armour', model: 'HOVR Phantom 3', category: 'running' },
  { brand: 'Under Armour', model: 'Curry 11', category: 'baloncesto' },
  { brand: 'Jordan', model: 'Air Jordan 1 Mid', category: 'lifestyle' },
  { brand: 'Jordan', model: 'Air Jordan 4 Retro', category: 'lifestyle' },
  { brand: 'Jordan', model: 'Luka 2', category: 'baloncesto' },
];

const CATEGORY_BLURB = {
  running: 'corredores que buscan amortiguacion y ligereza',
  baloncesto: 'jugadores que necesitan agarre y estabilidad en pista',
  skate: 'skaters que priorizan agarre y durabilidad',
  entrenamiento: 'entrenamientos de alta intensidad en el gimnasio',
  lifestyle: 'el dia a dia con un diseno atemporal',
};

// Fotos reales de zapatillas (Unsplash, licencia libre para hotlinking) en vez
// de placeholders aleatorios de picsum.photos.
const SNEAKER_PHOTOS = [
  'https://images.unsplash.com/photo-1669671943625-e20799ee5f42',
  'https://images.unsplash.com/photo-1645928565297-47f4708dc978',
  'https://images.unsplash.com/photo-1698108223361-d2f50515d946',
  'https://images.unsplash.com/photo-1595930116495-e6531bf701a6',
  'https://images.unsplash.com/photo-1572380034678-c4d9b1039751',
  'https://images.unsplash.com/photo-1698440235228-9c617924c06e',
  'https://images.unsplash.com/photo-1537412779515-d4d99ed35927',
  'https://images.unsplash.com/photo-1712467533059-733432958ff4',
  'https://images.unsplash.com/photo-1569016811829-2e7740b85cea',
];

function photoFor(index) {
  const photo = SNEAKER_PHOTOS[index % SNEAKER_PHOTOS.length];
  return `${photo}?w=600&h=600&fit=crop&auto=format&q=80`;
}

function skuFor(brand, model, index) {
  const base = `${brand}-${model}`.toUpperCase().replace(/[^A-Z0-9]+/g, '-');
  return `${base}-${index}`;
}

function randomSizes() {
  const count = faker.number.int({ min: 4, max: 7 });
  const chosen = faker.helpers.arrayElements(SIZES, count).sort((a, b) => a - b);
  return chosen.map((size) => `${size}:${faker.number.int({ min: 0, max: 12 })}`).join('|');
}

const sneakers = [];
let photoIndex = 0;
PRODUCTS.forEach((product) => {
  for (let i = 1; i <= 2; i += 1) {
    const color = faker.helpers.arrayElement(COLORS);
    const gender = faker.helpers.arrayElement(GENDERS);
    const sku = skuFor(product.brand, product.model, i);
    sneakers.push({
      sku,
      name: `${product.brand} ${product.model}`,
      brand: product.brand,
      category: product.category,
      gender,
      price: faker.number.int({ min: 60, max: 220 }),
      color,
      sizes: randomSizes(),
      description: `${product.brand} ${product.model} en color ${color.toLowerCase()}, pensada para ${CATEGORY_BLURB[product.category]}.`,
      imageUrl: photoFor(photoIndex),
      featured: faker.datatype.boolean({ probability: 0.2 }),
    });
    photoIndex += 1;
  }
});

const users = [
  { name: 'Admin Kickz', email: 'admin@kickz.com', password: 'Admin1234!', role: 'admin' },
  { name: 'Gestion Kickz', email: 'gestion@kickz.com', password: 'Admin1234!', role: 'admin' },
];
for (let i = 0; i < 16; i += 1) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  users.push({
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: 'Cliente1234!',
    role: 'cliente',
  });
}

const clienteUsers = users.filter((u) => u.role === 'cliente');
const STATUSES = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
const orderRows = [];
for (let i = 1; i <= 38; i += 1) {
  const orderId = `ORD-${String(i).padStart(4, '0')}`;
  const user = faker.helpers.arrayElement(clienteUsers);
  const chosenSneakers = faker.helpers.arrayElements(sneakers, faker.number.int({ min: 1, max: 3 }));
  const status = faker.helpers.arrayElement(STATUSES);
  const orderDate = faker.date.past({ years: 1 }).toISOString().slice(0, 10);
  const shipping = {
    shippingName: user.name,
    shippingAddress: faker.location.streetAddress(),
    shippingCity: faker.location.city(),
    shippingPostalCode: faker.location.zipCode(),
    shippingCountry: 'España',
    shippingPhone: `+34 6${faker.string.numeric(8)}`,
  };

  chosenSneakers.forEach((sneaker) => {
    const sizesAvailable = sneaker.sizes.split('|').map((s) => Number(s.split(':')[0]));
    orderRows.push({
      orderId,
      userEmail: user.email,
      sneakerSku: sneaker.sku,
      size: faker.helpers.arrayElement(sizesAvailable),
      quantity: faker.number.int({ min: 1, max: 2 }),
      priceAtPurchase: sneaker.price,
      status,
      orderDate,
      ...shipping,
    });
  });
}

function addSheet(workbook, name, columns, rows) {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = columns.map((key) => ({ header: key, key }));
  sheet.addRows(rows);
}

async function build() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kickz seed generator';
  workbook.created = new Date();

  addSheet(workbook, 'users', ['name', 'email', 'password', 'role'], users);
  addSheet(
    workbook,
    'sneakers',
    ['sku', 'name', 'brand', 'category', 'gender', 'price', 'color', 'sizes', 'description', 'imageUrl', 'featured'],
    sneakers
  );
  addSheet(
    workbook,
    'orders',
    [
      'orderId', 'userEmail', 'sneakerSku', 'size', 'quantity', 'priceAtPurchase', 'status', 'orderDate',
      'shippingName', 'shippingAddress', 'shippingCity', 'shippingPostalCode', 'shippingCountry', 'shippingPhone',
    ],
    orderRows
  );

  const outPath = path.join(__dirname, 'kickz-data.xlsx');
  await workbook.xlsx.writeFile(outPath);

  console.log(`Generated ${users.length} users, ${sneakers.length} sneakers, ${orderRows.length} order items across 38 orders.`);
  console.log(`Written to ${outPath}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
