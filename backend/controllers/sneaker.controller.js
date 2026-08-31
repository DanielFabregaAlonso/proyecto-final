const mongoose = require('mongoose');
const Sneaker = require('../models/Sneaker');
const { uploadBufferToCloudinary } = require('../middlewares/upload');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseSizes(sizesField) {
  if (!sizesField) return [];
  const parsed = typeof sizesField === 'string' ? JSON.parse(sizesField) : sizesField;
  return parsed.map((s) => ({ size: Number(s.size), stock: Number(s.stock) }));
}

async function listSneakers(req, res, next) {
  try {
    const { category, brand, gender, search, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (gender) filter.gender = gender;
    if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const [items, total] = await Promise.all([
      Sneaker.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Sneaker.countDocuments(filter),
    ]);

    res.json({ items, page: pageNum, hasMore: pageNum * limitNum < total, total });
  } catch (err) {
    next(err);
  }
}

async function getSneaker(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Zapatilla no encontrada' });
    }
    const sneaker = await Sneaker.findById(req.params.id);
    if (!sneaker) return res.status(404).json({ message: 'Zapatilla no encontrada' });
    res.json({ sneaker });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Zapatilla no encontrada' });
    }
    next(err);
  }
}

async function createSneaker(req, res, next) {
  try {
    const { sku, name, brand, category, gender, price, color, description, featured } = req.body;

    if (!sku || !name || !brand || !category || !gender || price === undefined || !color) {
      return res.status(400).json({
        message: 'Los campos sku, nombre, marca, categoria, genero, precio y color son obligatorios',
      });
    }

    let sizes;
    try {
      sizes = parseSizes(req.body.sizes);
    } catch (parseErr) {
      return res.status(400).json({ message: 'El campo sizes debe ser un JSON valido' });
    }

    const images = [];
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'kickz/sneakers');
      images.push(result.secure_url);
    }

    const sneaker = await Sneaker.create({
      sku,
      name,
      brand,
      category,
      gender,
      price: Number(price),
      color,
      description,
      featured: featured === 'true' || featured === true,
      sizes,
      images,
    });
    res.status(201).json({ sneaker });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ya existe una zapatilla con ese SKU' });
    }
    next(err);
  }
}

async function updateSneaker(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Zapatilla no encontrada' });
    }

    const sneaker = await Sneaker.findById(req.params.id);
    if (!sneaker) return res.status(404).json({ message: 'Zapatilla no encontrada' });

    const fields = ['name', 'brand', 'category', 'gender', 'color', 'description'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) sneaker[field] = req.body[field];
    });
    if (req.body.price !== undefined) sneaker.price = Number(req.body.price);
    if (req.body.featured !== undefined) {
      sneaker.featured = req.body.featured === 'true' || req.body.featured === true;
    }
    if (req.body.sizes !== undefined) {
      try {
        sneaker.sizes = parseSizes(req.body.sizes);
      } catch (parseErr) {
        return res.status(400).json({ message: 'El campo sizes debe ser un JSON valido' });
      }
    }
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'kickz/sneakers');
      sneaker.images.push(result.secure_url);
    }

    await sneaker.save();
    res.json({ sneaker });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Zapatilla no encontrada' });
    }
    next(err);
  }
}

async function deleteSneaker(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Zapatilla no encontrada' });
    }

    const sneaker = await Sneaker.findByIdAndDelete(req.params.id);
    if (!sneaker) return res.status(404).json({ message: 'Zapatilla no encontrada' });
    res.json({ message: 'Zapatilla eliminada' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Zapatilla no encontrada' });
    }
    next(err);
  }
}

module.exports = { listSneakers, getSneaker, createSneaker, updateSneaker, deleteSneaker };
