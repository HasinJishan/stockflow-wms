const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'staff'), getNotifications);
router.patch('/:id/read', protect, authorize('admin', 'staff'), markAsRead);
router.patch('/read-all', protect, authorize('admin', 'staff'), markAllAsRead);

module.exports = router;