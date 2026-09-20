const express = require('express');
const router = express.Router();
const { getAdjustments, createAdjustment } = require('../controllers/stockAdjustmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'staff'), getAdjustments);
router.post('/', protect, authorize('admin', 'staff'), createAdjustment);

module.exports = router;