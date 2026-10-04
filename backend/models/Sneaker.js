const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema(
  {
    size: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const sneakerSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ['running', 'baloncesto', 'skate', 'lifestyle', 'entrenamiento'],
      required: true,
    },
    gender: { type: String, enum: ['hombre', 'mujer', 'unisex'], required: true },
    price: { type: Number, required: true, min: 0 },
    color: { type: String, required: true },
    sizes: { type: [sizeSchema], default: [] },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
    // public_id de Cloudinary de las imágenes subidas desde la API (las del seed no tienen).
    imagePublicIds: { type: [String], default: [], select: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sneaker', sneakerSchema);
