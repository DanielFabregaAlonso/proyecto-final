const Order = require('../models/Order');
const Sneaker = require('../models/Sneaker');

const REQUIRED_ADDRESS_FIELDS = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];

function isAddressComplete(shippingAddress) {
  if (!shippingAddress || typeof shippingAddress !== 'object') return false;
  return REQUIRED_ADDRESS_FIELDS.every((field) => {
    const value = shippingAddress[field];
    return typeof value === 'string' && value.trim().length > 0;
  });
}

async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El pedido necesita al menos un articulo' });
    }
    if (!isAddressComplete(shippingAddress)) {
      return res.status(400).json({ message: 'Faltan datos de la direccion de envio' });
    }

    // Pass 1: validate everything that doesn't require mutation (quantities present and valid).
    const quantities = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'La cantidad debe ser un numero entero positivo' });
      }
      quantities.push(quantity);
    }

    // Pass 2: atomically decrement stock per item. Each update re-reads current stock at
    // write time, so this naturally handles duplicate line items for the same sneaker/size
    // within this request as well as concurrent checkouts from other requests.
    // Known limitation: if a later item's update fails after an earlier item's update
    // already succeeded, the earlier decrement is not automatically rolled back (no Mongo
    // transaction is used here, matching the plan's scope).
    const orderItems = [];
    let total = 0;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const quantity = quantities[i];
      const updated = await Sneaker.findOneAndUpdate(
        {
          _id: item.sneakerId,
          sizes: { $elemMatch: { size: Number(item.size), stock: { $gte: quantity } } },
        },
        { $inc: { 'sizes.$.stock': -quantity } },
        { new: true }
      );
      if (!updated) {
        const exists = await Sneaker.exists({ _id: item.sneakerId });
        if (!exists) {
          return res.status(404).json({ message: `Zapatilla no encontrada: ${item.sneakerId}` });
        }
        return res.status(409).json({ message: `Sin stock suficiente para la talla ${item.size}` });
      }
      orderItems.push({
        sneaker: updated._id,
        size: Number(item.size),
        quantity,
        priceAtPurchase: updated.price,
      });
      total += updated.price * quantity;
    }

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      status: 'pagado',
      total,
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('items.sneaker');
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.sneaker');
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado invalido' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
