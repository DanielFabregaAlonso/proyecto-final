const express = require('express');
const {
  listSneakers,
  getSneaker,
  createSneaker,
  updateSneaker,
  deleteSneaker,
} = require('../controllers/sneaker.controller');
const { protect } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
const { upload } = require('../middlewares/upload');

const router = express.Router();

router.get('/', listSneakers);
router.get('/:id', getSneaker);
router.post('/', protect, requireRole('admin'), upload.single('image'), createSneaker);
router.put('/:id', protect, requireRole('admin'), upload.single('image'), updateSneaker);
router.delete('/:id', protect, requireRole('admin'), deleteSneaker);

module.exports = router;
