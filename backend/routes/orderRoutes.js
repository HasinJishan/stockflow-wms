const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getMyOrders,
    getOrderByNumber,
    createOrder,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'staff'), getAllOrders);
router.get('/:orderNumber', protect, authorize('admin', 'staff'), getOrderByNumber);
router.post('/', protect, authorize('admin', 'staff'), createOrder);
router.patch('/:orderNumber/status', protect, authorize('admin', 'staff'), updateOrderStatus);
router.get('/my-orders', protect, getMyOrders);

module.exports = router;