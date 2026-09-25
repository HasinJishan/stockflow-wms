const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getMyOrders,
    createMyOrder,
    getOrderByNumber,
    createOrder,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer-specific routes MUST come before the '/:orderNumber' wildcard route,
// otherwise Express matches "my-orders" as an :orderNumber param and it gets
// blocked by the admin/staff-only authorize() check below.
router.get('/my-orders', protect, getMyOrders);
router.post('/my-orders', protect, createMyOrder);

// Admin/staff routes
router.get('/', protect, authorize('admin', 'staff'), getAllOrders);
router.post('/', protect, authorize('admin', 'staff'), createOrder);
router.get('/:orderNumber', protect, authorize('admin', 'staff'), getOrderByNumber);
router.patch('/:orderNumber/status', protect, authorize('admin', 'staff'), updateOrderStatus);

module.exports = router;