const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');

const router = express.Router();

router.post('/', protect, requireRole('cliente'), createOrder);
router.get('/mine', protect, requireRole('cliente'), getMyOrders);
router.get('/', protect, requireRole('admin'), getAllOrders);
router.patch('/:id/status', protect, requireRole('admin'), updateOrderStatus);

module.exports = router;
