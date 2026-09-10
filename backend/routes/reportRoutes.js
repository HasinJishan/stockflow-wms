const express = require('express');
const router = express.Router();
const { getReportsSummary } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/summary', protect, authorize('admin', 'staff'), getReportsSummary);

module.exports = router;