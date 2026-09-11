const express = require('express');
const router = express.Router();
const { getAnalytics, getAdminDashboard } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'staff'), getAnalytics);
router.get('/dashboard', protect, authorize('admin', 'staff'), getAdminDashboard);

module.exports = router;